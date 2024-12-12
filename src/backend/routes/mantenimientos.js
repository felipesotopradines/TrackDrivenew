// routes/maintence.js
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
        console.log('Módulo maintence cargado y conectado a la base de datos SQLite');
    }
});

// Obtener todos los jobs (para llenar combos)
router.get('/getJobs', (req, res) => {
    db.all('SELECT id, name, Price FROM jobs', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener mantenimientos por vehículo
router.get('/getMaintenceByVehicle/:idVehicle', (req, res) => {
    const { idVehicle } = req.params;
    const query = `
        SELECT m.id, m.dateCreate, m.dateStart, m.dateEnd, m.mount, m.status, m.message, j.name AS jobName
        FROM maintenance m
        JOIN jobs j ON m.jobID = j.id
        WHERE m.idVehicle = ?`;
    db.all(query, [idVehicle], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Obtener mantenimiento por ID
router.get('/getMaintence/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT m.id, m.idVehicle, m.dateCreate, m.dateStart, m.dateEnd, m.mount, m.status, m.message, j.name AS jobName
        FROM maintenance m
        JOIN jobs j ON m.jobID = j.id
        WHERE m.id = ?`;
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Mantenimiento no encontrado' });
        }
    });
});

// Obtener todos los mantenimientos de todos los vehículos
router.get('/getAllMaintence', (req, res) => {
    const query = `
        SELECT 
            m.id, 
            m.idVehicle, 
            m.dateCreate, 
            m.dateStart, 
            m.dateEnd, 
            m.mount, 
            m.status, 
            m.message, 
            j.name AS jobName
        FROM maintenance m
        JOIN jobs j ON m.jobID = j.id
        ORDER BY m.dateCreate DESC`;

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Crear un nuevo mantenimiento
router.post('/createMaintence', (req, res) => {
    const { idVehicle, dateCreate, dateStart, dateEnd, mount, status, message, jobID } = req.body;
    const query = `
        INSERT INTO maintenance (idVehicle, dateCreate, dateStart, dateEnd, mount, status, message, jobID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [idVehicle, dateCreate, dateStart, dateEnd, mount, status, message, jobID], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: 'Mantenimiento creado exitosamente' });
    });
});

// Actualizar un mantenimiento
router.put('/updateMaintence/:id', (req, res) => {
    const { id } = req.params;
    const { idVehicle, dateCreate, dateStart, dateEnd, mount, status, message, jobID } = req.body;
    const query = `
        UPDATE maintenance
        SET idVehicle = ?, dateCreate = ?, dateStart = ?, dateEnd = ?, mount = ?, status = ?, message = ?, jobID = ?
        WHERE id = ?`;
    db.run(query, [idVehicle, dateCreate, dateStart, dateEnd, mount, status, message, jobID, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ message: 'Mantenimiento actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Mantenimiento no encontrado' });
        }
    });
});

// Eliminar un mantenimiento
router.delete('/deleteMaintence/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM maintenance WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ message: 'Mantenimiento eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Mantenimiento no encontrado' });
        }
    });
});

module.exports = router;
