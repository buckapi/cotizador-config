# Administrador de Tarifas por Tramos

Aplicación web para la gestión y administración de esquemas de tarifas basados en tramos de distancia. Permite crear, editar y visualizar diferentes configuraciones de precios según distancias y tipos de vehículos.

## Características Principales

- 🚗 Gestión de tramos de distancia con tarifas personalizadas
- 📱 Interfaz responsive con múltiples vistas (Cuadrícula, Lista, Línea de tiempo)
- 🔐 Autenticación segura
- 📊 Visualización detallada de tarifas por tipo de vehículo
- ✏️ Edición en tiempo real de esquemas de tarifas
- 📱 Diseño adaptativo para diferentes tamaños de pantalla

## Tecnologías Utilizadas

- Frontend:
  - HTML5, CSS3, JavaScript (ES6+)
  - Bootstrap 5.3
  - Font Awesome para iconos
  - SweetAlert2 para notificaciones
- Backend:
  - API REST personalizada

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```

2. Configurar la URL de la API en `script.js`:
   ```javascript
   const API_URL = 'https://tu-api.com/endpoint';
   ```

3. Configurar las credenciales de administrador en `script.js`:
   ```javascript
   const ADMIN_PASSWORD = 'tu_contraseña_segura';
   ```

4. Abrir `index.html` en un servidor web local o desplegar en tu hosting preferido.

## Uso

1. **Iniciar Sesión**
   - Ingresa con la contraseña de administrador configurada

2. **Vistas Disponibles**
   - **Cuadrícula**: Muestra los tramos en formato de tarjetas
   - **Lista**: Muestra los tramos en formato de lista
   - **Línea de tiempo**: Muestra los tramos en orden secuencial

3. **Gestión de Tramos**
   - **Nuevo Esquema**: Crea un nuevo tramo de tarifas
   - **Editar**: Modifica un tramo existente
   - **Eliminar**: Elimina un tramo (con confirmación)

4. **Tipos de Tarifas**
   - **Fijas**: Tarifas estándar para un rango de distancia
   - **Por intervalo**: Tarifas que se aplican por cada unidad de distancia

## Estructura del Proyecto

```
admin-tramos/
├── index.html          # Página principal
├── script.js           # Lógica de la aplicación
├── styles.css          # Estilos personalizados
├── delete-tramo.js     # Módulo para eliminar tramos
└── README.md           # Este archivo
```

## Seguridad

- Todas las solicitudes a la API requieren autenticación
- La contraseña se almacena de forma segura en sesión
- Se implementan medidas contra XSS y CSRF

## Contribución

1. Haz un Fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

¿Preguntas o comentarios? ¡No dudes en contactarnos!

---

*Última actualización: Junio 2024*
