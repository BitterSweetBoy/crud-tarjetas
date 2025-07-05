## Configuración del Entorno

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/BitterSweetBoy/crud-tarjetas.git
   cd crud-tarjetas
   ```

2. **Configura las variables de entorno:**  
   Renombra el archivo `.env.example` a `.env` en la raíz del proyecto.

## Ejecución del Proyecto

### Usando Docker Compose (Recomendado)

**Ejecuta todos los servicios:**
```bash
docker-compose up -d
```

Esto iniciará tres servicios:
- **Backend API (NestJS)**: Puerto 3000
- **Frontend (Angular)**: Puerto 4200
- **Base de datos (MySQL)**: Puerto 3307

### Acceso a la Aplicación

- **Frontend**: http://localhost:4200
- **API Backend**: http://localhost:3000
- **Documentación API (Swagger)**: http://localhost:3000/docs

## Desarrollo Local

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev 
```
Antes de iniciar el servidor en modo desarrollo, descomenta la siguiente sección en `main.ts` para que cargue correctamente las variables del archivo `.env`:

```bash
config({
  path: path.resolve(__dirname, '../../.env'),
});
```


### Frontend (Angular)

```bash
cd frontend
npm install --legacy-peer-deps
ng serve  # Servidor de desarrollo en puerto 4200
```

### Docker
- `docker-compose down`: Detener todos los servicios
- `docker-compose logs [servicio]`: Ver logs de un servicio específico
- `docker-compose restart [servicio]`: Reiniciar un servicio

## Estructura del Proyecto

- `/backend`: API NestJS con TypeScript
- `/frontend`: Aplicación Angular con PrimeNG y Tailwind CSS
- `/init.sql`: Script de inicialización de la base de datos (Export de la base de datos)
- `docker-compose.yml`: Configuración de orquestación de servicios

## Base de Datos

La base de datos se inicializa automáticamente con el esquema definido en `init.sql`, que incluye las tablas `cards`, `card_descriptions` y `cards_logs` para auditoría. 

## Notas

- El frontend utiliza un build multi-etapa con Nginx para servir los archivos estáticos en producción
- La API incluye documentación automática con Swagger disponible en `/docs`
- Los datos de la base de datos persisten mediante volúmenes de Docker
