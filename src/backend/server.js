// Requiere instalar express, sqlite3 y cors
// Ejecuta los siguientes comandos:
// npm install express sqlite3 cors

const express = require('express');
const path = require('path');
const cors = require('cors');

// Crear instancia de la aplicación
const app = express();

// Definir constantes para la ruta base de la API y el directorio estático
const API_BASE = '/api';
const STATIC_DIR = path.join(__dirname, '../www');

// Configurar encabezados CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Servir los archivos del frontend Angular (compilados en www/)
app.use(express.static(STATIC_DIR));
console.log(`Sirviendo archivos estáticos desde: ${STATIC_DIR}`);

// Middleware para manejar datos JSON y formularios de gran tamaño
app.use(express.json({ limit: '10mb' })); // Ajusta el límite según tus necesidades
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Para formularios no JSON

// Configurar encabezados CORS manualmente (opcional, ya que usas cors)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir todos los orígenes
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Encabezados permitidos
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Responder a solicitudes preflight
  }
  next();
});

// Importar rutas
const coloresRoutes = require('./routes/colores');
const marcasRoutes = require('./routes/marcas');
const misVehiculosRoutes = require('./routes/misVehiculos');
const modelosRoutes = require('./routes/modelos');
const sucursalesRoutes = require('./routes/sucursales');
const usuariosRoutes = require('./routes/usuarios');
const maintence = require('./routes/mantenimientos')

// Registrar las rutas utilizando la constante API_BASE
app.use(`${API_BASE}/colores`, coloresRoutes);
app.use(`${API_BASE}/marcas`, marcasRoutes);
app.use(`${API_BASE}/misVehiculos`, misVehiculosRoutes);
app.use(`${API_BASE}/modelos`, modelosRoutes);
app.use(`${API_BASE}/sucursales`, sucursalesRoutes);
app.use(`${API_BASE}/usuarios`, usuariosRoutes);
app.use(`${API_BASE}/maintence`, maintence);


// Iniciar el servidor
const PORT = process.env.PORT || 3000;

// Servir el frontend Angular para cualquier ruta no capturada por las APIs
app.get('*', (req, res) => {
  console.log(`Ruta no encontrada: ${req.path}. Mostrando información sobre la API.`);

  const htmlMessage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Info</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h1>Ruta no encontrada</h1>
            <p>Por favor, asegúrese de acceder a los endpoints disponibles de la API.</p>
            <p>Ejemplo: <a href="http://localhost:${PORT}${API_BASE}" target="_blank">http://localhost:${PORT}${API_BASE}</a></p>
        </body>
        </html>
    `;

  res.status(404).send(htmlMessage);
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}${API_BASE}`);
  console.log(`Frontend estático servido desde ${STATIC_DIR}`);
  console.log('Iniciando el servidor y cargando los módulos necesarios...');
});
