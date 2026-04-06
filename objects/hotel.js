class Hotel {
    constructor(nombre, direccion) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.habitaciones = [];
    }

    agregarHabitacion(habitacion) {
        this.habitaciones.push(habitacion);
    }

    eliminarHabitacion(numero) {
        this.habitaciones = this.habitaciones.filter(habitacion => habitacion.numero !== numero);
    }

    buscarHabitacion(numero) {
        return this.habitaciones.find(habitacion => habitacion.numero === numero);
    }

    mostrarHabitaciones() {
        return this.habitaciones;
    }
}

export default Hotel;