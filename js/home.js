import Hotel from '../objects/hotel.js';
import Habitacion from '../objects/habitacion.js';
import Cliente from '../objects/cliente.js';
import Reserva from '../objects/reserva.js';

// ==========================================
// 1. ESTADO DE LA APLICACIÓN (MEMORIA)
// ==========================================
const miHotel = new Hotel("Hotel Paradiso", "Calle Falsa 123");
const clientes = [];
const reservas = [];

// ==========================================
// 2. NAVEGACIÓN SPA (Single Page Application)
// ==========================================
const secHabitaciones = document.getElementById('secHabitaciones');
const secClientes = document.getElementById('secClientes');
const secReservas = document.getElementById('secReservas');
const secDashboard = document.getElementById('secDashboard');

const todasLasSecciones = [secHabitaciones, secClientes, secReservas, secDashboard];
const todosLosBotonesNav = [
    document.getElementById('btnNavHabitaciones'),
    document.getElementById('btnNavClientes'),
    document.getElementById('btnNavReservas'),
    document.getElementById('btnNavDashboard')
];

function mostrarSeccion(seccionActiva, botonActivo) {
    todasLasSecciones.forEach(s => s.hidden = true);
    todosLosBotonesNav.forEach(b => b.classList.remove('active'));
    
    seccionActiva.hidden = false;
    botonActivo.classList.add('active');
}

document.getElementById('btnNavHabitaciones').addEventListener('click', (e) => mostrarSeccion(secHabitaciones, e.target));
document.getElementById('btnNavClientes').addEventListener('click', (e) => mostrarSeccion(secClientes, e.target));
document.getElementById('btnNavReservas').addEventListener('click', (e) => mostrarSeccion(secReservas, e.target));
document.getElementById('btnNavDashboard').addEventListener('click', (e) => {
    actualizarUI();
    mostrarSeccion(secDashboard, e.target);
});

// ==========================================
// 3. CAPTURA Y VALIDACIÓN (Clicks en Botones)
// ==========================================

// --- Registrar Habitación ---
document.getElementById('btnGuardarHabitacion').addEventListener('click', () => {
    const inputNumero = document.getElementById('habitacionNumero');
    const inputTipo = document.getElementById('habitacionTipo');
    const inputPrecio = document.getElementById('habitacionPrecio');

    const numero = inputNumero.value.trim();
    const tipo = inputTipo.value;
    const precio = parseFloat(inputPrecio.value);

    if(!numero || !precio) {
        alert("⚠️ Por favor, rellena todos los campos.");
        return;
    }

    if (miHotel.buscarHabitacion(numero)) {
        alert("⚠️ Error: Ya existe la habitación " + numero);
        return;
    }

    const nueva = new Habitacion(numero, tipo, precio);
    miHotel.agregarHabitacion(nueva);
    alert(`✅ Habitación ${numero} registrada con éxito.`);
    
    inputNumero.value = "";
    inputPrecio.value = "";
});

// --- Registrar Cliente ---
document.getElementById('btnGuardarCliente').addEventListener('click', () => {
    const inputNombre = document.getElementById('clienteNombre');
    const inputId = document.getElementById('clienteId');
    const inputContacto = document.getElementById('clienteContacto');

    const nombre = inputNombre.value.trim();
    const id = inputId.value.trim();
    const contacto = inputContacto.value.trim();

    if(!nombre || !id || !contacto) {
        alert("⚠️ Por favor, rellena todos los campos.");
        return;
    }

    if (clientes.find(c => c.identificacion === id)) {
        alert("⚠️ Error: El ID " + id + " ya pertenece a otro cliente.");
        return;
    }

    const nuevoCliente = new Cliente(nombre, id, contacto);
    clientes.push(nuevoCliente);
    alert(`✅ Cliente ${nombre} registrado con éxito.`);
    
    inputNombre.value = "";
    inputId.value = "";
    inputContacto.value = "";
});

// --- Crear Reserva ---
document.getElementById('btnConfirmarReserva').addEventListener('click', () => {
    const inputCli = document.getElementById('reservaClienteId');
    const inputHab = document.getElementById('reservaHabNumero');
    const inputInicio = document.getElementById('reservaInicio');
    const inputFin = document.getElementById('reservaFin');

    const idCliente = inputCli.value.trim();
    const numHab = inputHab.value.trim();
    const fechaInicio = inputInicio.value;
    const fechaFin = inputFin.value;

    if(!idCliente || !numHab || !fechaInicio || !fechaFin) {
        alert("⚠️ Faltan datos para crear la reserva.");
        return;
    }

    if (fechaInicio >= fechaFin) {
        alert("⚠️ Error: La fecha de fin debe ser posterior a la de inicio.");
        return;
    }

    const cliente = clientes.find(c => c.identificacion === idCliente);
    if (!cliente) {
        alert(`❌ Error: Cliente ID ${idCliente} no está registrado.`);
        return;
    }

    const habitacion = miHotel.buscarHabitacion(numHab);
    if (!habitacion) {
        alert(`❌ Error: La habitación ${numHab} no existe en este hotel.`);
        return;
    }

    if (habitacion.estado === "ocupada") {
        alert(`❌ Error: La habitación ${numHab} ya está ocupada por otro cliente.`);
        return;
    }

    // Usar POO
    const nuevaReserva = new Reserva(cliente, habitacion, fechaInicio, fechaFin);
    reservas.push(nuevaReserva);
    habitacion.ocupar();

    alert(`✅ Reserva exitosa: Habitación ${numHab} asignada a ${cliente.nombre}.`);
    
    inputCli.value = "";
    inputHab.value = "";
    inputInicio.value = "";
    inputFin.value = "";
});

// ==========================================
// 4. ACTUALIZACIÓN VISUAL (DASHBOARD)
// ==========================================
function actualizarUI() {
    // 1. Habitaciones
    const divHab = document.getElementById('listaHabitaciones');
    const habitaciones = miHotel.mostrarHabitaciones();
    divHab.innerHTML = habitaciones.length === 0 ? '<p class="textMuted">No hay habitaciones registradas.</p>' : '';
    
    habitaciones.forEach(hab => {
        const cls = hab.estado === 'ocupada' ? 'badgeDanger' : 'badgeSuccess';
        divHab.innerHTML += `
            <div class="cardItem">
                <div class="cardHeader">
                    <h4>Habitación ${hab.numero}</h4>
                    <span class="badge ${cls}">${hab.estado.toUpperCase()}</span>
                </div>
                <p><strong>Tipo:</strong> ${hab.tipo}</p>
                <p><strong>Precio:</strong> $${hab.precio}/noche</p>
            </div>
        `;
    });

    // 2. Clientes
    const divCli = document.getElementById('listaClientes');
    divCli.innerHTML = clientes.length === 0 ? '<p class="textMuted">No hay clientes registrados.</p>' : '';
    
    clientes.forEach(cli => {
        divCli.innerHTML += `
            <div class="cardItem">
                <h4>${cli.nombre}</h4>
                <p><strong>ID:</strong> ${cli.identificacion}</p>
                <p><strong>Contacto:</strong> ${cli.contacto}</p>
            </div>
        `;
    });

    // 3. Reservas y Botón de Cancelar
    const divRes = document.getElementById('listaReservas');
    divRes.innerHTML = reservas.length === 0 ? '<p class="textMuted">No hay reservas registradas.</p>' : '';
    
    window.cancelarReserva = (indice) => {
        const reserva = reservas[indice];
        if(reserva.estado !== "confirmada") return;
        
        // POO: el objeto realiza su lógica
        reserva.cancelar();
        reserva.habitacion.liberar();
        
        alert("✅ Reserva cancelada correctamente. La habitación vuelve a estar libre.");
        actualizarUI(); 
    };

    reservas.forEach((res, index) => {
        const cls = res.estado === 'confirmada' ? 'badgeSuccess' : 'badgeDanger';
        divRes.innerHTML += `
            <div class="cardItem reservaItem">
                <div class="cardHeader">
                    <h4>Reserva #${index + 1}</h4>
                    <span class="badge ${cls}">${res.estado.toUpperCase()}</span>
                </div>
                <p><strong>Cliente:</strong> ${res.cliente.nombre}</p>
                <p><strong>Habitación:</strong> ${res.habitacion.numero}</p>
                <p><strong>Fechas:</strong> ${res.fechaInicio} ➔ ${res.fechaFin}</p>
                ${res.estado === "confirmada" 
                    ? `<button class="btn btnDanger" onclick="cancelarReserva(${index})">Cancelar Reserva</button>`
                    : ``
                }
            </div>
        `;
    });
}
