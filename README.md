API para la app “Listen To Me”. Desarrollada en Node.js con PostgreSQL. Provee endpoints para consumo por clientes web y móviles.

Requisitos

Node.js (>=18) y npm

PostgreSQL (>=13) en local o remoto

Git

Clonar
$ git clone <URL_DEL_REPOSITORIO>
$ cd <nombre_del_proyecto>

Configuración

Copia el archivo de ejemplo de variables si existe (por ej. .env.example a .env).

Define variables mínimas:
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/listen_to_me
NODE_ENV=development
JWT_SECRET=una_clave_segura (si aplica)

Instalación
$ node -v && npm -v
$ npm install

Base de datos

Crea la base listen_to_me en PostgreSQL.

Aplica migraciones con la herramienta del proyecto (Prisma/Sequelize/Knex, según corresponda).
Ejemplos (ajusta a tu stack):
$ npx prisma migrate dev
o
$ npx sequelize db:migrate

Ejecución (desarrollo)
$ npm run dev
Si no existe, usa:
$ npm start

Ejecución (producción)
$ npm run build (si aplica)
$ NODE_ENV=production npm start

Pruebas rápidas

Verifica que el servidor escuche en http://localhost:3000
 (o el puerto definido).

Endpoints de salud/comprobación (si existen):
GET /health → 200 OK
GET / → “API-LISTEN-TO-ME”

Usa Postman/Insomnia o curl para probar rutas.

Scripts npm (típicos, ajusta a tu package.json)

npm run dev: inicia con recarga (nodemon)

npm start: inicia en modo normal

npm test: ejecuta pruebas

npm run lint: linting

Estructura sugerida (puede variar)
src/
app/ rutas, controladores, validaciones
core/ middlewares, errores
db/ cliente y migraciones
services/ lógica de negocio
index.ts|js punto de entrada

Solución de problemas

“port already in use”: cambia PORT en .env o libera el puerto.

“database connection refused”: revisa DATABASE_URL, credenciales y que PostgreSQL esté activo.

“migration failed”: revisa migraciones y versión del CLI elegido.

Dependencias rotas: elimina node_modules y package-lock.json, luego:
$ npm install

Versiones: asegúrate de usar Node 18+.

Seguridad y buenas prácticas

No subas .env al repositorio.

Usa JWT_SECRET robusto y rota claves en producción.

Habilita CORS solo para orígenes permitidos.

Añade logs estructurados y manejo centralizado de errores.
