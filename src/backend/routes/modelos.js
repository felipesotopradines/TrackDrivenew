// routes/modelos.js
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
        console.log('Módulo modelos cargado y conectado a la base de datos SQLite');
    }
});

// Obtener todos los modelos
router.get('/', (req, res) => {
    db.all('SELECT id, marca, modelo, ano FROM modelos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener modelos por marca
router.get('/marca/:marcaId', (req, res) => {
    const { marcaId } = req.params;
    const normalizedMarcaId = marcaId.trim().toLowerCase(); // Normalizar el parámetro recibido

    db.all(
        'SELECT id, marca, modelo, ano FROM modelos WHERE TRIM(LOWER(marca)) = ?',
        [normalizedMarcaId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        }
    );
});



// Obtener un modelo por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, marca, modelo, ano FROM modelos WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Modelo no encontrado' });
        }
    });
});

module.exports = router;