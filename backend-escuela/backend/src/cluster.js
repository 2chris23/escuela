import cluster from 'cluster';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Proceso principal ${process.pid} está corriendo`);
  console.log(`Iniciando ${numCPUs} workers...`);

  // Crear workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} murió. Reiniciando...`);
    cluster.fork();
  });
} else {
  // Los workers pueden compartir cualquier conexión TCP
  // En este caso es un servidor HTTP
  import('./index.js');
  console.log(`Worker ${process.pid} iniciado`);
} 