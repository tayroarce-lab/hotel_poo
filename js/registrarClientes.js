import Hotel from "../objects/hotel.js";
import Habitacion from "../objects/habitacion.js";
import Cliente from "../objects/cliente.js";
import Reserva from "../objects/reserva.js";

const fechaInicio = document.getElementById("reservaFechaInicio").value;
const fechaFin = document.getElementById("reservaFechaFin").value;
const btnConfirmarReserva = document.getElementById("btnConfirmarReserva");

const miHotel = new Hotel("Hotel Paradiso", "Calle Falsa 123");
const clientes = [];
const reservas = [];


btnConfirmarReserva.addEventListener("click", () => {

    const cliente = clientes.find(c => c.identificacion === idCliente);
    const habitacion = miHotel.buscarHabitacion(numHabitacion);

    if (!cliente) {
        alert("Cliente no encontrado");
        return;
    }

    if (!habitacion) {
        alert("Habitación no encontrada");
        return;
    }

    if (habitacion.estado !== "disponible") {
        alert("Habitación no disponible");
        return;
    }

    const nuevaReserva = new Reserva(cliente, habitacion, fechaInicio, fechaFin);
    reservas.push(nuevaReserva);
    habitacion.ocupar();

    alert("Reserva confirmada");
});