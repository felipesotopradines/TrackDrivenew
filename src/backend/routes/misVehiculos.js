// routes/misVehiculos.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // Importar la biblioteca sharp

//Constantes
// Inicializacion de rutas de Express
const router = express.Router();

// Configuración path / ruta de SQLite
const dbFilePath = path.join(__dirname, '../db/db.sqlite');

// Inicializacion de la conexion a la DB
const db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos SQLite:', err);
    } else {
        console.log('Módulo misVehiculos cargado y conectado a la base de datos SQLite');
    }
});

// Funciones varias usadas por los diversos metodos
// Función privada para obtener el path del almacenamiento de imágenes
function getVehicleDir(user_id, vehicle_id, metodo) {
    console.info("Recuperando path desde: " + metodo);
    basePath = path.join(__dirname, `../img/userID_${user_id}/${vehicle_id}`);
    console.log(basePath);
    return basePath;
}

// Función para procesar y guardar una imagen
async function processAndSaveImage(imageData, directory, name) {
    const extension = imageData.match(/^data:image\/(\w+);base64,/)[1];
    const filename = `${name}.${extension}`;
    const outputPath = path.join(directory, filename);

    const imageBuffer = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    await sharp(imageBuffer)
        .resize(600, 600, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .toFile(outputPath);

    return filename;
}

// <-- Aca da inicio la definicion de los endpoint usados en el CRUD -->

// C => Create / Crear / Insertar
// R => Read / Leer / Recuperar / Seleccinonar
// U => Update / Modificar / Actualizar
// D => Delete / Eliminanar / Borrar / Remover

// Listar todos los vehículos sin importar el usuario
// CRUD = R de READ (Todos los Registro)
router.get('/', (req, res) => {
    db.all('SELECT id, user_id, marca, modelo, ano, color, patente, kilometraje, front, back, inside FROM misVehiculos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Procesar imágenes para cada vehículo
        rows.forEach(row => {
            const vehicleDir = getVehicleDir(row.user_id, row.id, "GET (Raiz)");
            if (row.front) {
                const frontPath = path.join(vehicleDir, row.front);
                if (fs.existsSync(frontPath)) {
                    row.front_b64 = fs.readFileSync(frontPath, 'base64');
                }
            }
            if (row.back) {
                const backPath = path.join(vehicleDir, row.back);
                if (fs.existsSync(backPath)) {
                    row.back_b64 = fs.readFileSync(backPath, 'base64');
                }
            }
            if (row.inside) {
                const insidePath = path.join(vehicleDir, row.inside);
                if (fs.existsSync(insidePath)) {
                    row.inside_b64 = fs.readFileSync(insidePath, 'base64');
                }
            }
        });
        res.json(rows);
    });
});

// Obtener todos los vehículos de un usuario
// CRUD = R de READ (todos los registros del Usuario user_id)
router.get('/user/:user_id', (req, res) => {
    const { user_id } = req.params;
    db.all('SELECT id, user_id, marca, modelo, ano, color, patente, kilometraje, front, back, inside FROM misVehiculos WHERE user_id = ?', [user_id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        rows.forEach(row => {
            const vehicleDir = getVehicleDir(row.user_id, row.id, "GET (MisVehiculos)");
            if (row.front) {
                const frontPath = path.join(vehicleDir, row.front);
                if (fs.existsSync(frontPath)) {
                    row.front_b64 = fs.readFileSync(frontPath, 'base64');
                }
            }
            if (row.back) {
                const backPath = path.join(vehicleDir, row.back);
                if (fs.existsSync(backPath)) {
                    row.back_b64 = fs.readFileSync(backPath, 'base64');
                }
            }
            if (row.inside) {
                const insidePath = path.join(vehicleDir, row.inside);
                if (fs.existsSync(insidePath)) {
                    row.inside_b64 = fs.readFileSync(insidePath, 'base64');
                }
            }
        });
        res.json(rows);
    });
});

// Obtener un vehículo por ID
// CRUD = R de READ (solo 1 Registro)
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT id, user_id, marca, modelo, ano, color, patente, kilometraje, front, back, inside FROM misVehiculos WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            const vehicleDir = getVehicleDir(row.user_id, row.id, "GET (Vehiculo)");
            if (row.front) {
                const frontPath = path.join(vehicleDir, row.front);
                if (fs.existsSync(frontPath)) {
                    row.front_b64 = fs.readFileSync(frontPath, 'base64');
                }
            }
            if (row.back) {
                const backPath = path.join(vehicleDir, row.back);
                if (fs.existsSync(backPath)) {
                    row.back_b64 = fs.readFileSync(backPath, 'base64');
                }
            }
            if (row.inside) {
                const insidePath = path.join(vehicleDir, row.inside);
                if (fs.existsSync(insidePath)) {
                    row.inside_b64 = fs.readFileSync(insidePath, 'base64');
                }
            }
            res.json(row);
        } else {
            res.status(404).json({ error: 'Vehículo no encontrado' });
        }
    });
});

// Registrar un nuevo vehículo
// CRUD = C de CREATE
router.post('/', async (req, res) => {
    const { user_id, marca, modelo, ano, color, patente, kilometraje, front, back, inside } = req.body;

    // Validación de campos requeridos
    const errores = [];
    const currentYear = new Date().getFullYear(); // Obtener el año actual
    const firstCarYear = 1886; // Año en que se vendió el primer automóvil

    if (!user_id || !marca || !modelo || !ano || !color || !patente || !kilometraje || !front || !back || !inside) {
        errores.push('Todos los campos son requeridos');
    }

    // Validar que año y kilometraje sean números
    if (isNaN(ano)) {
        errores.push('El campo "Año" debe ser un número válido');
    } else {
        // Validar el rango del año
        if (ano < firstCarYear) {
            errores.push(`El campo "Año" no puede ser menor a ${firstCarYear}`);
        }
        if (ano > currentYear + 1) {
            errores.push(`El campo "Año" no puede ser mayor a ${currentYear + 1}`);
        }
    }

    if (isNaN(kilometraje)) {
        errores.push('El campo "Kilometraje" debe ser un número válido');
    } else {
        // Validar el rango del año
        if (kilometraje < 0) {
            errores.push(`El campo "Kilometraje" debe ser un número positivo`);
        }
    }

    // Verificar si hay errores iniciales
    if (errores.length > 0) {
        return res.status(400).json({ error: errores });
    }

    try {
        // Validar si la patente ya está registrada
        db.get(
            'SELECT id FROM misVehiculos WHERE patente = ?',
            [patente],
            (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al validar la patente' });
                }

                if (row) {
                    return res.status(400).json({ error: 'La patente ya está registrada' });
                }

                // Insertar el vehículo en la base de datos sin las imágenes
                db.run(
                    'INSERT INTO misVehiculos (user_id, marca, modelo, ano, color, patente, kilometraje) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [user_id, marca, modelo, ano, color, patente, kilometraje],
                    async function (insertErr) {
                        if (insertErr) {
                            return res.status(500).json({ error: insertErr.message });
                        }

                        const vehicle_id = this.lastID; // Obtener el ID del vehículo recién insertado
                        const vehicleDir = getVehicleDir(user_id, vehicle_id, "POST (Nuevo)"); // Crear directorio basado en el ID

                        // Crear la carpeta para almacenar las imágenes
                        if (!fs.existsSync(vehicleDir)) {
                            fs.mkdirSync(vehicleDir, { recursive: true });
                        }

                        try {
                            // Procesar imágenes y guardarlas
                            const frontFilename = await processAndSaveImage(front, vehicleDir, 'front');
                            const backFilename = await processAndSaveImage(back, vehicleDir, 'back');
                            const insideFilename = await processAndSaveImage(inside, vehicleDir, 'inside');

                            // Actualizar las rutas de las imágenes en la base de datos
                            db.run(
                                'UPDATE misVehiculos SET front = ?, back = ?, inside = ? WHERE id = ?',
                                [frontFilename, backFilename, insideFilename, vehicle_id],
                                function (updateErr) {
                                    if (updateErr) {
                                        return res.status(500).json({ error: updateErr.message });
                                    }
                                    res.status(201).json({ id: vehicle_id, message: 'Vehículo registrado correctamente' });
                                }
                            );
                        } catch (imageError) {
                            console.error('Error al procesar las imágenes:', imageError);
                            res.status(500).json({ error: 'Error al procesar las imágenes' });
                        }
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).json({ error: 'Error inesperado' });
    }
});

// Actualizar un vehículo existente
// CRUD = U de UPDATE
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, marca, modelo, ano, color, patente, kilometraje, front, back, inside } = req.body;

    // Validación de campos requeridos y formato
    const errores = [];
    const currentYear = new Date().getFullYear(); // Año actual
    const firstCarYear = 1886; // Año en que se vendió el primer automóvil

    if (!user_id || !marca || !modelo || !ano || !color || !patente || !kilometraje) {
        errores.push('Todos los campos excepto las imágenes son requeridos');
    }

    // Validar que año y kilometraje sean números
    if (isNaN(ano)) {
        errores.push('El campo "Año" debe ser un número válido');
    } else {
        // Validar el rango del año
        if (ano < firstCarYear) {
            errores.push(`El campo "Año" no puede ser menor a ${firstCarYear}`);
        }
        if (ano > currentYear + 1) {
            errores.push(`El campo "Año" no puede ser mayor a ${currentYear + 1}`);
        }
    }

    if (isNaN(kilometraje)) {
        errores.push('El campo "Kilometraje" debe ser un número válido');
    } else {
        // Validar el rango del año
        if (kilometraje < 0) {
            errores.push(`El campo "Kilometraje" debe ser un número positivo`);
        }
    }

    // Retornar errores si los hay
    if (errores.length > 0) {
        return res.status(400).json({ error: errores });
    }

    try {
        // Validar si la patente ya está registrada para otro vehículo
        db.get(
            'SELECT id FROM misVehiculos WHERE patente = ? AND id != ?',
            [patente, id],
            (err, row) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al validar la patente' });
                }

                if (row) {
                    return res.status(400).json({ error: 'La patente ya está registrada para otro vehículo' });
                }

                // Recuperar los detalles actuales del vehículo
                db.get(
                    'SELECT front, back, inside, id, user_id FROM misVehiculos WHERE id = ?',
                    [id],
                    async (err, row) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (!row) {
                            return res.status(404).json({ error: 'Vehículo no encontrado' });
                        }

                        // Obtener el directorio del vehículo
                        const vehicleDir = getVehicleDir(row.user_id, row.id, 'PUT (Actualiza)');
                        if (!fs.existsSync(vehicleDir)) {
                            fs.mkdirSync(vehicleDir, { recursive: true });
                        }

                        // Procesar imágenes solo si son diferentes a las actuales
                        const processImageIfChanged = async (imageData, currentFilename, name) => {
                            if (!imageData) return currentFilename;

                            const imageBuffer = Buffer.from(
                                imageData.replace(/^data:image\/\w+;base64,/, ''),
                                'base64'
                            );
                            const currentPath = path.join(vehicleDir, currentFilename || '');
                            const isSame =
                                currentFilename &&
                                fs.existsSync(currentPath) &&
                                Buffer.compare(fs.readFileSync(currentPath), imageBuffer) === 0;

                            if (isSame) {
                                return currentFilename; // Retorna el nombre actual si no cambia
                            }

                            // Procesar nueva imagen
                            const extension = imageData.match(/^data:image\/(\w+);base64,/)[1];
                            const filename = `${name}.${extension}`;
                            const outputPath = path.join(vehicleDir, filename);

                            await sharp(imageBuffer)
                                .resize(600, 600, {
                                    fit: sharp.fit.inside,
                                    withoutEnlargement: true,
                                })
                                .toFile(outputPath);

                            return filename;
                        };

                        // Validar y procesar imágenes si han cambiado
                        const frontFilename = await processImageIfChanged(front, row.front, 'front');
                        const backFilename = await processImageIfChanged(back, row.back, 'back');
                        const insideFilename = await processImageIfChanged(inside, row.inside, 'inside');

                        // Actualizar el vehículo en la base de datos
                        db.run(
                            `UPDATE misVehiculos SET marca = ?, modelo = ?, ano = ?, color = ?, patente = ?, kilometraje = ?, 
                            front = COALESCE(?, front), back = COALESCE(?, back), inside = COALESCE(?, inside) WHERE id = ?`,
                            [
                                marca,
                                modelo,
                                ano,
                                color,
                                patente,
                                kilometraje,
                                frontFilename,
                                backFilename,
                                insideFilename,
                                id,
                            ],
                            function (updateErr) {
                                if (updateErr) {
                                    return res.status(500).json({ error: updateErr.message });
                                }
                                if (this.changes === 0) {
                                    return res.status(404).json({ error: 'Vehículo no encontrado' });
                                }
                                res.json({ message: 'Vehículo actualizado correctamente' });
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).json({ error: 'Error inesperado' });
    }
});

// Eliminar un vehículo por ID
// CRUD = D de DELETE (Elimina el registro)
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Obtener los detalles del vehículo (incluidas las imágenes) antes de eliminar
    db.get(
        'SELECT user_id, front, back, inside FROM misVehiculos WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }

            const vehicleDir = getVehicleDir(row.user_id, id, "DELETE");

            // Eliminar el vehículo de la base de datos
            db.run('DELETE FROM misVehiculos WHERE id = ?', [id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Vehículo no encontrado' });
                }

                // Eliminar las imágenes asociadas y el directorio del vehículo
                try {
                    // Intentar eliminar las imágenes
                    const deleteImage = (filename) => {
                        if (filename) {
                            const filePath = path.join(vehicleDir, filename);
                            if (fs.existsSync(filePath)) {
                                fs.unlinkSync(filePath);
                            }
                        }
                    };

                    deleteImage(row.front);
                    deleteImage(row.back);
                    deleteImage(row.inside);

                    // Intentar eliminar el directorio del vehículo si está vacío
                    if (fs.existsSync(vehicleDir)) {
                        fs.rmdirSync(vehicleDir, { recursive: true });
                    }

                    res.json({ message: 'Vehículo y archivos eliminados correctamente' });
                } catch (fileError) {
                    console.error('Error al eliminar archivos o directorio:', fileError);
                    res.status(500).json({
                        message: 'Vehículo eliminado, pero hubo un error al eliminar los archivos asociados',
                    });
                }
            });
        }
    );
});

// Exporta las rutas/edpoint antes creados
module.exports = router;
