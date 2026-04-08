class Cliente {
    constructor(nombre, identificacion, contacto) {
        this.nombre = nombre;
        this.identificacion = identificacion;
        this.contacto = contacto;
    }

    mostrarInfo() {
        console.log(`Cliente ${this.nombre} - ${this.identificacion} - ${this.contacto}`);
    }
}