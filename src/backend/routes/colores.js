// routes/colores.js
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
        console.log('Módulo colores cargado y conectado a la base de datos SQLite');
    }
});

// Obtener todos los colores
router.get('/', (req, res) => {
    db.all('SELECT id, color FROM colores', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener un color por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, color FROM colores WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Color no encontrado' });
        }
    });
});

module.exports = router;