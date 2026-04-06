// Habitación: número, tipo, precio, estado.


class Habitacion {
    constructor(numero, tipo, precio) {
        this.numero = numero;
        this.tipo = tipo;
        this.precio = precio;
        this.estado = "disponible";
    }

    ocupar() {
        this.estado = "ocupada";
    }

    liberar() {
        this.estado = "disponible";
    }
}

export default Habitacion;