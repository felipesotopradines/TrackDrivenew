// routes/sucursales.js
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
        console.log('Módulo sucursales cargado y conectado a la base de datos SQLite');
    }
});

// Obtener todas las sucursales
router.get('/', (req, res) => {
    db.all('SELECT id, nombre, direccion, latitud, longitud FROM sucursales', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener una sucursal por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, nombre, direccion, latitud, longitud FROM sucursales WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Sucursal no encontrada' });
        }
    });
});

module.exports = router;