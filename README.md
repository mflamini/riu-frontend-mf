# Gestión de Héroes - Prueba Técnica

Una aplicación web desarrollada en Angular para la gestión completa de superhéroes. Permite crear, leer, actualizar y eliminar héroes con una interfaz intuitiva y moderna.

## Características

- **CRUD completo**: Crear, editar, visualizar y eliminar héroes
- **Búsqueda en tiempo real**: Filtrado por nombre de héroe
- **Paginación**: Navegación eficiente con tamaños de página configurables
- **Autenticación**: Sistema de login con credenciales predefinidas
- **Persistencia local**: Los datos se guardan en localStorage
- **Responsive**: Diseño adaptable a diferentes dispositivos
- **Validaciones**: Formularios con validaciones en tiempo real
- **Confirmación de eliminación**: Modal de confirmación para prevenir borrados accidentales

## Tecnologías

- Angular 18+ (Standalone Components)
- TypeScript
- RxJS para manejo de estado reactivo
- CSS3 con diseño responsivo
- LocalStorage para persistencia de datos

## Prerrequisitos

Asegúrate de tener instalado:

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI (`npm install -g @angular/cli`)

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/mflamini/riu-frontend-mf.git
cd riu-frontend-mf
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar la aplicación

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Credenciales de Acceso

Para ingresar a la aplicación utiliza:

- **Usuario**: `admin`
- **Contraseña**: `admin123`

## Uso de la Aplicación

### Panel de Login

- Ingresa las credenciales predefinidas
- El sistema te redirigirá automáticamente al dashboard

### Gestión de Héroes

- **Listar**: Visualiza todos los héroes con paginación
- **Buscar**: Utiliza el campo de búsqueda para filtrar por nombre
- **Agregar**: Haz clic en "Agregar Héroe" para crear uno nuevo
- **Editar**: Haz clic en el ícono de edición junto a cada héroe
- **Eliminar**: Haz clic en el ícono de basura y confirma la acción

### Campos del Formulario

- **Nombre**: Nombre del superhéroe (requerido)
- **Poder**: Descripción de sus superpoderes (requerido)
- **Descripción**: Información adicional sobre el héroe

## Funcionalidades Destacadas

### Paginación Inteligente

- Tamaños configurables: 5, 10, 20, 50 elementos por página
- Navegación anterior/siguiente
- Filtrado que mantiene la paginación

### Validaciones del Formulario

- Campos requeridos marcados claramente
- Mensajes de error descriptivos
- Directiva personalizada para convertir texto a mayúsculas

### Gestión de Estado

- Uso de RxJS para manejo reactivo de datos
- Spinner de carga durante operaciones asíncronas
- Manejo de errores con mensajes informativos

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero-list/          # Lista principal de héroes
│   │   ├── login/              # Componente de autenticación
│   │   └── shared/             # Componentes compartidos
│   ├── services/
│   │   ├── hero-services/      # Lógica de negocio de héroes
│   │   ├── auth-service/       # Servicio de autenticación
│   │   └── spinner/            # Servicio para loading
│   ├── models/                 # Interfaces y tipos
│   ├── directives/             # Directivas personalizadas
│   └── guards/                 # Guards de rutas
```

## Testing

Para ejecutar los tests unitarios:

```bash
ng test
```

## Build para Producción

```bash
ng build --prod
```

Los archivos se generarán en la carpeta `dist/`.

## Configuración Adicional

### SSR (Server-Side Rendering)

El proyecto está configurado con pre-renderizado para mejorar el SEO y la carga inicial.

## Soporte

Si encuentras algún problema o tienes sugerencias, no dudes en crear un issue en el repositorio.

---

Desarrollado como parte de una prueba técnica - 2025

Matias Flamini
