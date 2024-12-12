export function getServerUrl(): string {
    // Recuperar los valores del localStorage
    const serverConfig = JSON.parse(localStorage.getItem('serverConfig') || '{}');
    
    // Valores predeterminados en caso de que no existan en localStorage
    const ip = serverConfig.ip || 'localhost';
    const port = serverConfig.port || '3000';
  
    // Construir y retornar la URL
    return `http://${ip}:${port}/api`;
  }
  