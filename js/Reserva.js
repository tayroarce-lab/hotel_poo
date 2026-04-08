class Reserva {
    constructor(cliente, habitacion, fechaInicio, fechaFin) {
        this.cliente = cliente;
        this.habitacion = habitacion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = "activa";
    }

    cancelar() {
        this.estado = "cancelada";
        this.habitacion.liberar();
    }

    mostrarInfo() {
        console.log(`Reserva ${this.cliente.nombre} - ${this.habitacion.numero}`);
    }
}