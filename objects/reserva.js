class Reserva {
    constructor(cliente, habitacion, fechaInicio, fechaFin) {
        this.cliente = cliente;
        this.habitacion = habitacion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = "confirmada";
    }

    confirmar() {
        this.estado = "confirmada";
    }

    cancelar() {
        this.estado = "cancelada";
    }
}

export default Reserva;