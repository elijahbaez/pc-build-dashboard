const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// 1. INVENTORY ENDPOINTS (Components)
// ==========================================

// GET all components in stock
app.get('/api/inventory', async (req, res) => {
    try {
        const allComponents = await pool.query('SELECT * FROM components ORDER BY category, name');
        res.json(allComponents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new hardware component to inventory
app.post('/api/inventory', async (req, res) => {
    try {
        const { name, category, price, stock_quantity } = req.body;
        const newComponent = await pool.query(
            'INSERT INTO components (name, category, price, stock_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, category, price, stock_quantity]
        );
        res.json(newComponent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 2. BUILDS ENDPOINTS (Client Systems)
// ==========================================

// GET all completed custom builds
app.get('/api/builds', async (req, res) => {
    try {
        const allBuilds = await pool.query('SELECT * FROM builds ORDER BY build_date DESC');
        res.json(allBuilds.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST a new client build
app.post('/api/builds', async (req, res) => {
    try {
        const { client_name, total_cost, notes } = req.body;
        const newBuild = await pool.query(
            'INSERT INTO builds (client_name, total_cost, notes) VALUES ($1, $2, $3) RETURNING *',
            [client_name, total_cost, notes]
        );
        res.json(newBuild.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 3. BENCHMARK ENDPOINTS (Thermal Data)
// ==========================================

// GET all thermal benchmarks with the associated client build info
app.get('/api/benchmarks', async (req, res) => {
    try {
        // Using a JOIN to combine the benchmarks table with the builds table
        const benchmarks = await pool.query(`
            SELECT b.id, bu.client_name, b.cpu_temp_idle, b.cpu_temp_load, b.gpu_temp_load, b.benchmark_software 
            FROM benchmarks b
            JOIN builds bu ON b.build_id = bu.id
        `);
        res.json(benchmarks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});