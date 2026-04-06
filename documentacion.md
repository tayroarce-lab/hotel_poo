# Documento de Funcionalidad - Sistema de Reservas de Hotel (POO)

Este documento detalla la estructura principal del sistema de gestión de reservas desarrollado con JavaScript utilizando el paradigma de Programación Orientada a Objetos (POO).

---

## 1. Clase `Hotel`
**Propósito:** Es la clase principal o "contenedor". Su responsabilidad es representar al establecimiento y ser dueña de la colección de habitaciones físicas. Contiene las operaciones para agregar, remover y buscar habitaciones.

### Atributos
*   `nombre` (String): El nombre del hotel (Ej: "Hotel Paradiso").
*   `direccion` (String): La ubicación física del establecimiento.
*   `habitaciones` (Array): Una lista que almacena instancias de la clase `Habitacion`.

### Métodos
*   `constructor(nombre, direccion)`: Inicializa los valores del hotel y crea el arreglo vacío de habitaciones.
*   `agregarHabitacion(habitacion)`: Recibe una instancia de `Habitacion` y la añade al array de habitaciones.
*   `eliminarHabitacion(numero)`: Elimina del array una habitación específica buscando su identificador numérico.
*   `buscarHabitacion(numero)`: Busca dentro del array una habitación específica y retorna su objeto, útil para validaciones antes de hacer reservas.
*   `mostrarHabitaciones()`: Retorna el array completo para poder listar el estado físico del hotel en el dashboard.

---

## 2. Clase `Habitacion`
**Propósito:** Representa el bien físico que se puede alquilar. Controla su propio estado interno para abstraer si está ocupada o no, evitando que clases externas lo modifiquen deliberadamente sin pasar por la lógica adecuada (encapsulamiento).

### Atributos
*   `numero` (String/Number): El código identificador único (Ej: "101", "205-A").
*   `tipo` (String): Categoría ("Sencilla", "Doble", "Suite").
*   `precio` (Number): Costo de la habitación por noche.
*   `estado` (String): Su condición actual. Por defecto se inicializa en `"disponible"`.

### Métodos
*   `constructor(...)`: Asigna los valores. Fija el `estado` inicial como `"disponible"`.
*   `ocupar()`: Método interno que cambia el estado a `"ocupada"`. Debe llamarse siempre que una `Reserva` se confirme para esa habitación.
*   `liberar()`: Retorna el estado de la habitación a `"disponible"`. Debe llamarse cada que se cancele o termine una `Reserva`.

---

## 3. Clase `Cliente`
**Propósito:** Es una clase de datos puros. Su misión es modularizar la información de los usuarios que adquieren los servicios del hotel, manteniendo la cohesión.

### Atributos
*   `nombre` (String): El nombre completo de la persona.
*   `identificacion` (String): DNI, Pasaporte o documento útil como llave primaria.
*   `contacto` (String): Número de teléfono, email o dirección de contacto.

### Métodos
*   `constructor(nombre, identificacion, contacto)`: Inicializa la información de la instancia al ser creada.

---

## 4. Clase `Reserva`
**Propósito:** Esta es una clase de *asociación*. Une las instancias de `Cliente` y `Habitacion` a través de un marco de tiempo. Controla el ciclo de vida o "flujo" en el que una persona retiene una habitación. 

### Atributos
*   `cliente` (Objeto `Cliente`): Una referencia a la instancia del cliente que solicitó la operación.
*   `habitacion` (Objeto `Habitacion`): Una referencia a la instancia que va a ser ocupada.
*   `fechaInicio` (String/Date): Fecha de llegada.
*   `fechaFin` (String/Date): Fecha de salida.
*   `estado` (String): Condición temporal de la reserva. Por defecto se inicia en `"confirmada"`.

### Métodos
*   `constructor(...)`: Recibe todos los parámetros para unir al cliente y la habitación. Establece su estado en `"confirmada"`.
*   `confirmar()`: (Opcional, en caso de flujos más complejos donde empiece como "pendiente"). Cambia el estado interno a `"confirmada"`.
*   `cancelar()`: Cambia el estado de la clase a `"cancelada"`. Este método se dispara antes de llamar a `habitacion.liberar()`.
