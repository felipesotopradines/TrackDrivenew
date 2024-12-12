// routes/marcas.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Configuración de SQLite
const dbFilePath = path.join(__dirname, '../db/db.sqlite');
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos SQLite:', err);
    } else {
        console.log('Módulo marcas cargado y conectado a la base de datos SQLite');
    }
});

// Obtener todas las marcas
router.get('/', (req, res) => {
    db.all('SELECT id, nombre FROM marcas', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener una marca por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, nombre FROM marcas WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Marca no encontrada' });
        }
    });
});

module.exports = router;
