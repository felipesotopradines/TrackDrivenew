// routes/usuarios.js
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
        console.log('Módulo usuarios cargado y conectado a la base de datos SQLite');
    }
});

// Obtener todos los usuarios (sin el campo de contraseña)
router.get('/', (req, res) => {
    db.all('SELECT id, nombre, email, password FROM usuarios', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Login de usuario
router.get('/login', (req, res) => {
    const { email, password } = req.query;
    db.get('SELECT id, nombre, email FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado o credenciales incorrectas' });
        }
    });
});

// Obtener un usuario por ID (sin el campo de contraseña)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, nombre, email FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

// Actualizar contraseña de usuario
router.put('/:id/password', (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Validar si los valores están definidos correctamente
    if (!oldPassword || !newPassword) {
        console.warn('Las contraseñas proporcionadas no son válidas');
        res.status(400).json({ error: 'Contraseña antigua y nueva son requeridas' });
        return;
    }

    console.log(`Solicitud para actualizar la contraseña del usuario con ID: ${id}`);

    // Primero, validar que la contraseña anterior coincida
    db.get('SELECT password FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error(`Error al buscar al usuario con ID: ${id}`, err);
            res.status(500).json({ error: err.message });
            return;
        }

        if (!row) {
            console.warn(`No se encontró el usuario con ID: ${id}`);
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        if (row.password !== oldPassword) {
            console.warn(`La contraseña antigua no coincide para el usuario con ID: ${id}`);
            res.status(400).json({ error: 'La contraseña anterior no es correcta' });
            return;
        }

        // Validar que `newPassword` no sea null, undefined, o vacío
        if (newPassword == null || newPassword.trim() === '') {
            console.warn(`La nueva contraseña proporcionada no es válida para el usuario con ID: ${id}`);
            res.status(400).json({ error: 'La nueva contraseña no puede ser vacía o nula' });
            return;
        }

        console.log(`Actualizando la contraseña del usuario con ID: ${id} a la nueva contraseña`);

        // Actualizar la contraseña con la nueva
        db.run('UPDATE usuarios SET password = ? WHERE id = ?', [newPassword, id], function (err) {
            if (err) {
                console.error(`Error al actualizar la contraseña del usuario con ID: ${id}`, err);
                res.status(500).json({ error: err.message });
                return;
            }

            if (this.changes) {
                console.log(`Contraseña actualizada correctamente para el usuario con ID: ${id}. Old Password: ${oldPassword}, New Password: ${newPassword}`);
                res.json({ message: 'Contraseña actualizada correctamente' });
            } else {
                console.warn(`No se encontró el usuario con ID: ${id} para actualizar. Old Password: ${oldPassword}, New Password: ${newPassword}`);
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        });
    });
});

// Crear un nuevo usuario (validando que el email sea único)
router.post('/', (req, res) => {
    const { nombre, email, password } = req.body;

    // Validar si los valores están definidos correctamente
    if (!nombre || !email || !password) {
        console.warn('Faltan campos requeridos para el registro del usuario');
        res.status(400).json({ error: 'Todos los campos son requeridos: nombre, email, password' });
        return;
    }

    db.get('SELECT COUNT(id) AS count FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row.count > 0) {
            res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        } else {
            db.run('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(201).json({ id: this.lastID, nombre, email });
            });
        }
    });
});

// Actualizar contraseña de usuario sin doble factor
router.put('/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    // Validar si los valores están definidos correctamente
    if (!email || !newPassword) {
        console.warn('Faltan campos requeridos para el restablecimiento de contraseña');
        res.status(400).json({ error: 'Email y nueva contraseña son requeridos' });
        return;
    }

    db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        } else {
            db.run('UPDATE usuarios SET password = ? WHERE email = ?', [newPassword, email], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.status(200).json({ message: 'Contraseña restablecida con éxito' });
            });
        }
    });
});

module.exports = router;
