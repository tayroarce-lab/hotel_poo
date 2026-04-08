# Documento de Funcionalidad — Sistema de Reservas de Hotel (POO)

Este documento detalla la estructura del sistema de gestión de reservas desarrollado con JavaScript utilizando el paradigma de Programación Orientada a Objetos (POO).

---

## 1. Clase `Hotel`
**Archivo:** `js/hotel.js`
**Propósito:** Es la clase principal o "contenedor". Su responsabilidad es representar al establecimiento y almacenar las colecciones de habitaciones, clientes y reservas.

### Atributos
*   `nombre` (String): El nombre del hotel (Ej: "Grand POO Hotel").
*   `direccion` (String): La ubicación física del establecimiento.
*   `habitaciones` (Array): Una lista que almacena instancias de la clase `Habitacion`.
*   `clientes` (Array): Una lista que almacena instancias de la clase `Cliente`.
*   `reservas` (Array): Una lista que almacena instancias de la clase `Reserva`.

### Métodos
*   `constructor(nombre, direccion)`: Inicializa los valores del hotel y crea los arreglos vacíos de habitaciones, clientes y reservas.
*   `agregarHabitacion(habitacion)`: Recibe una instancia de `Habitacion` y la añade al array.
*   `agregarCliente(cliente)`: Recibe una instancia de `Cliente` y la añade al array.
*   `agregarReserva(reserva)`: Recibe una instancia de `Reserva` y la añade al array.
*   `mostrarHabitaciones()`: Recorre el array de habitaciones e imprime la info de cada una en consola.
*   `mostrarClientes()`: Recorre el array de clientes e imprime la info de cada uno en consola.
*   `mostrarReservas()`: Recorre el array de reservas e imprime la info de cada una en consola.

---

## 2. Clase `Habitacion`
**Archivo:** `js/Habitacion.js`
**Propósito:** Representa el bien físico que se puede alquilar. Controla su propio estado interno para determinar si está ocupada o disponible.

### Atributos
*   `numero` (String/Number): El código identificador único (Ej: 101, 205).
*   `tipo` (String): Categoría ("Simple", "Doble", "Suite", "Presidencial").
*   `precio` (Number): Costo de la habitación por noche.
*   `estado` (String): Su condición actual. Se inicializa en `"disponible"`.

### Métodos
*   `constructor(numero, tipo, precio)`: Asigna los valores y fija el `estado` inicial como `"disponible"`.
*   `reservar()`: Cambia el estado a `"ocupado"`. Se llama cuando una reserva se crea para esta habitación.
*   `liberar()`: Retorna el estado a `"disponible"`. Se llama cuando se cancela una reserva asociada.
*   `mostrarInfo()`: Imprime en consola los datos de la habitación (número, tipo, precio, estado).

---

## 3. Clase `Cliente`
**Archivo:** `js/Cliente.js`
**Propósito:** Modulariza la información de los usuarios que adquieren los servicios del hotel.

### Atributos
*   `nombre` (String): El nombre completo de la persona.
*   `identificacion` (String): DNI, Pasaporte o documento usado como identificador único.
*   `contacto` (String): Email de contacto.

### Métodos
*   `constructor(nombre, identificacion, contacto)`: Inicializa la información de la instancia al ser creada.
*   `mostrarInfo()`: Imprime en consola los datos del cliente (nombre, identificación, contacto).

---

## 4. Clase `Reserva`
**Archivo:** `js/Reserva.js`
**Propósito:** Clase de asociación que une las instancias de `Cliente` y `Habitacion` a través de un rango de fechas. Controla el ciclo de vida de la ocupación de una habitación por un cliente.

### Atributos
*   `cliente` (Objeto `Cliente`): Referencia a la instancia del cliente que hizo la reserva.
*   `habitacion` (Objeto `Habitacion`): Referencia a la instancia de la habitación reservada.
*   `fechaInicio` (String): Fecha de entrada.
*   `fechaFin` (String): Fecha de salida.
*   `estado` (String): Condición de la reserva. Se inicializa en `"activa"`.

### Métodos
*   `constructor(cliente, habitacion, fechaInicio, fechaFin)`: Recibe los parámetros para asociar al cliente con la habitación y establece el estado en `"activa"`.
*   `cancelar()`: Cambia el estado a `"cancelada"` y llama a `this.habitacion.liberar()` para devolver la habitación a estado disponible.
*   `mostrarInfo()`: Imprime en consola los datos de la reserva (nombre del cliente, número de habitación).

---

## 5. Archivo `main.js`
**Propósito:** Conecta las clases con la interfaz de usuario (DOM). Contiene toda la lógica de negocio, renderizado, persistencia y eventos.

### Funcionalidades principales
*   **Persistencia con `localStorage`:** Los datos del hotel (habitaciones, clientes, reservas) se guardan automáticamente en `localStorage` después de cada operación. Al recargar la página, los datos se restauran reconstruyendo instancias reales de cada clase con sus métodos. Si es la primera vez que se abre la app, se cargan datos de demostración.
*   **Registrar habitaciones:** Valida que el número no esté duplicado, crea la instancia y actualiza la tabla.
*   **Registrar clientes:** Valida que la identificación no esté duplicada, crea la instancia y actualiza la tabla.
*   **Crear reservas:** Valida que la habitación esté disponible y que las fechas sean coherentes, crea la reserva y cambia el estado de la habitación a "ocupado".
*   **Cancelar reservas:** Cambia el estado de la reserva a "cancelada" y libera la habitación.
*   **Renderizado dinámico:** Todas las tablas (habitaciones, clientes, reservas) se generan dinámicamente mediante template literals.
*   **Estadísticas en tiempo real:** Se actualizan los contadores de habitaciones totales, disponibles, clientes y reservas activas.
*   **Notificaciones tipo toast:** Feedback visual al usuario con mensajes de éxito o error.
*   **Navegación por pestañas:** Sistema de tabs con `addEventListener` (sin `onclick` en HTML).
*   **Delegación de eventos:** Los botones "Cancelar" se crean dinámicamente y se capturan mediante delegación en el `tbody`.

### Convenciones de código
*   **camelCase:** Variables, funciones, clases CSS e IDs de HTML.
*   **Sin `<form>` ni `submit`:** Toda la interacción se maneja con `addEventListener("click")`.
*   **Sin `onclick` en HTML:** Los eventos se registran exclusivamente desde JavaScript.
*   **Nombres descriptivos en arrow functions:** Se usan nombres como `habitacion`, `cliente`, `reserva` en lugar de letras solas (`h`, `c`, `r`).

---

## 6. Interfaz de usuario
**Archivo HTML:** `pages/home.html`
**Archivo CSS:** `styles/style.css`

### Diseño
*   Tema claro con fondo blanco/crema y acentos en **naranja** (`#f97316`).
*   Tipografía: **Inter** (Google Fonts).
*   Iconografía: **Lucide Icons** vía CDN.
*   Diseño responsivo con `grid` y media queries.

### Estructura
*   **Header:** Logo, título del hotel, badge informativo.
*   **Stats:** 4 tarjetas con estadísticas en tiempo real.
*   **Tabs:** 3 pestañas (Habitaciones, Clientes, Reservas) con animación `fadeIn`.
*   **Formularios:** Campos de entrada agrupados en grids, sin usar `<form>`.
*   **Tablas:** Listado dinámico con badges de estado y botones de acción.
*   **Toasts:** Notificaciones flotantes en la esquina inferior derecha.

---

## 7. Estructura de archivos

```
hotel_poo/
├── js/
│   ├── Hotel.js         ← Clase Hotel
│   ├── Habitacion.js    ← Clase Habitacion
│   ├── Cliente.js       ← Clase Cliente
│   └── Reserva.js       ← Clase Reserva
├── pages/
│   └── home.html        ← Interfaz principal
├── styles/
│   └── style.css        ← Estilos (tema naranja)
├── main.js              ← Lógica, eventos y persistencia
└── documentacion.md     ← Este documento
```

---

## 8. Reglas de negocio implementadas

| Regla | Implementación |
|---|---|
| No reservar habitaciones ocupadas | Se valida `habitacion.estado !== "disponible"` antes de crear la reserva |
| Cambiar estado al reservar | Se llama `habitacion.reservar()` que cambia estado a `"ocupado"` |
| Cambiar estado al cancelar | Se llama `reserva.cancelar()` que ejecuta `habitacion.liberar()` |
| Un cliente puede tener múltiples reservas | No hay restricción en la creación de reservas por cliente |
| No duplicar números de habitación | Se valida con `.some()` antes de agregar |
| No duplicar identificación de cliente | Se valida con `.some()` antes de agregar |
| Fecha de salida mayor a entrada | Se valida `fechaFin > fechaInicio` antes de crear la reserva |
| Persistencia de datos | Se guarda/carga desde `localStorage` automáticamente |
