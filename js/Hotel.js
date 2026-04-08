class Hotel {
    constructor(nombre, direccion) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.habitaciones = [];
        this.clientes = [];
        this.reservas = [];
    }

    agregarHabitacion(habitacion) {
        this.habitaciones.push(habitacion);
    }

    agregarCliente(cliente) {
        this.clientes.push(cliente);
    }

    agregarReserva(reserva) {
        this.reservas.push(reserva);
    }

    mostrarHabitaciones() {
        this.habitaciones.forEach(habitacion => habitacion.mostrarInfo());
    }

    mostrarClientes() {
        this.clientes.forEach(cliente => cliente.mostrarInfo());
    }

    mostrarReservas() {
        this.reservas.forEach(reserva => reserva.mostrarInfo());
    }
}