import Hotel from "../objects/hotel.js";
import Habitacion from "../objects/habitacion.js";
import Cliente from "../objects/cliente.js";
import Reserva from "../objects/reserva.js";

const miHotel = new Hotel("Hotel Paradiso", "Calle Falsa 123");
const clientes = [];
const reservas = [];

const btnGuardarHabitacion = document.getElementById("btnGuardarHabitacion");
btnGuardarHabitacion.addEventListener("click", () => {
    const numero = document.getElementById("habitacionNumero").value;
    const tipo = document.getElementById("habitacionTipo").value;
    const precio = document.getElementById("habitacionPrecio").value;

    const habitacion = miHotel.buscarHabitacion(numero);

    if (habitacion) {
        alert("Habitación ya existe");
        return;
    }

    const nuevaHabitacion = new Habitacion(numero, tipo, precio);
    miHotel.agregarHabitacion(nuevaHabitacion);

    alert("Habitación registrada");
});