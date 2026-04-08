class Habitacion {
    constructor(numero, tipo, precio) {
        this.numero = numero;
        this.tipo = tipo;
        this.precio = precio;
        this.estado = "disponible";
    }

    reservar() {
        this.estado = "ocupado";
    }

    liberar() {
        this.estado = "disponible";
    }

    mostrarInfo() {
        console.log(`Habitación ${this.numero} - ${this.tipo} - ${this.precio} - ${this.estado}`);
    }
}