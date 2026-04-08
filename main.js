// ============================================================
//  main.js — Sistema de Reservas de Hotel
//  Sin onclick en HTML — todo con addEventListener
//  Iconos: Lucide Icons (lucide.createIcons())
//  Persistencia: localStorage
// ============================================================

// ── Instancia principal del hotel ───────────────────────────
const hotel = new Hotel("Grand POO Hotel", "Av. Principal 123");

// ── Contador de IDs de reserva ───────────────────────────────
let contadorReserva = 1;

// ============================================================
//  PERSISTENCIA — localStorage
// ============================================================

/**
 * Guarda el estado completo del hotel en localStorage.
 * Serializa habitaciones, clientes y reservas como JSON.
 */
function guardarEnLocalStorage() {
    const datos = {
        habitaciones: hotel.habitaciones.map(habitacion => ({
            numero:  habitacion.numero,
            tipo:    habitacion.tipo,
            precio:  habitacion.precio,
            estado:  habitacion.estado
        })),
        clientes: hotel.clientes.map(cliente => ({
            nombre:         cliente.nombre,
            identificacion: cliente.identificacion,
            contacto:       cliente.contacto
        })),
        reservas: hotel.reservas.map(reserva => ({
            id:              reserva.id,
            clienteId:       reserva.cliente.identificacion,
            habitacionNumero: reserva.habitacion.numero,
            fechaInicio:     reserva.fechaInicio,
            fechaFin:        reserva.fechaFin,
            estado:          reserva.estado
        })),
        contadorReserva: contadorReserva
    };
    localStorage.setItem("hotelDatos", JSON.stringify(datos));
}

/**
 * Carga los datos desde localStorage y reconstruye los objetos
 * como instancias reales de las clases (con sus métodos).
 * Retorna true si se cargaron datos, false si no había nada guardado.
 */
function cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem("hotelDatos");
    if (!datosGuardados) return false;

    const datos = JSON.parse(datosGuardados);

    // Reconstruir habitaciones como instancias de Habitacion
    datos.habitaciones.forEach(datosHabitacion => {
        const habitacion = new Habitacion(datosHabitacion.numero, datosHabitacion.tipo, datosHabitacion.precio);
        habitacion.estado = datosHabitacion.estado;
        hotel.agregarHabitacion(habitacion);
    });

    // Reconstruir clientes como instancias de Cliente
    datos.clientes.forEach(datosCliente => {
        const cliente = new Cliente(datosCliente.nombre, datosCliente.identificacion, datosCliente.contacto);
        hotel.agregarCliente(cliente);
    });

    // Reconstruir reservas reconectando las referencias a cliente y habitación
    datos.reservas.forEach(datosReserva => {
        const cliente    = hotel.clientes.find(cadaCliente => cadaCliente.identificacion === datosReserva.clienteId);
        const habitacion = hotel.habitaciones.find(cadaHabitacion => String(cadaHabitacion.numero) === String(datosReserva.habitacionNumero));
        const reserva    = new Reserva(cliente, habitacion, datosReserva.fechaInicio, datosReserva.fechaFin);
        reserva.id       = datosReserva.id;
        reserva.estado   = datosReserva.estado;
        hotel.agregarReserva(reserva);
    });

    contadorReserva = datos.contadorReserva || 1;
    return true;
}

// ── Cargar datos o usar datos de demostración ────────────────
const datosCargados = cargarDesdeLocalStorage();

if (!datosCargados) {
    // Primera vez: cargar datos de demostración
    const habitacionesIniciales = [
        new Habitacion(101, "Simple",   150),
        new Habitacion(102, "Doble",    250),
        new Habitacion(103, "Suite",    500),
        new Habitacion(104, "Simple",   150),
        new Habitacion(201, "Doble",    250),
        new Habitacion(202, "Suite",    500),
    ];

    const clientesIniciales = [
        new Cliente("Ana López",      "C001", "ana@email.com"),
        new Cliente("Carlos Ramos",   "C002", "carlos@email.com"),
        new Cliente("Sofía Martínez", "C003", "sofia@email.com"),
    ];

    habitacionesIniciales.forEach(habitacion => hotel.agregarHabitacion(habitacion));
    clientesIniciales.forEach(cliente => hotel.agregarCliente(cliente));
    guardarEnLocalStorage();
}

// ============================================================
//  FUNCIONES DE NEGOCIO
// ============================================================

function registrarHabitacion() {
    const numero = document.getElementById("inputNumeroHabitacion").value.trim();
    const tipo   = document.getElementById("inputTipoHabitacion").value;
    const precio = parseFloat(document.getElementById("inputPrecioHabitacion").value); //El .parseFloat() convierte el valor del input a número

    if (!numero || !tipo || isNaN(precio) || precio <= 0) {
        mostrarNotificacion("Completa todos los campos correctamente.", "error");
        return;
    }

    const yaExiste = hotel.habitaciones.some(habitacion => String(habitacion.numero) === numero); //El .some() devuelve true si encuentra al menos un elemento que cumpla la condición
    if (yaExiste) {
        mostrarNotificacion(`La habitación ${numero} ya está registrada.`, "error");
        return;
    }

    const nuevaHabitacion = new Habitacion(numero, tipo, precio);
    hotel.agregarHabitacion(nuevaHabitacion);

    document.getElementById("inputNumeroHabitacion").value = "";
    document.getElementById("inputPrecioHabitacion").value = "";
    document.getElementById("inputTipoHabitacion").value   = "";

    actualizarTablaHabitaciones();
    actualizarSelectsReserva();
    guardarEnLocalStorage();
    mostrarNotificacion(`Habitación ${numero} registrada correctamente.`, "exito");
}

function registrarCliente() {
    const nombre         = document.getElementById("inputNombreCliente").value.trim();
    const identificacion = document.getElementById("inputIdCliente").value.trim();
    const contacto       = document.getElementById("inputContactoCliente").value.trim();

    if (!nombre || !identificacion || !contacto) {
        mostrarNotificacion("Completa todos los campos del cliente.", "error");
        return;
    }

    const yaExiste = hotel.clientes.some(cliente => cliente.identificacion === identificacion);
    if (yaExiste) {
        mostrarNotificacion(`Ya existe un cliente con ID ${identificacion}.`, "error");
        return;
    }

    const nuevoCliente = new Cliente(nombre, identificacion, contacto);
    hotel.agregarCliente(nuevoCliente);

    document.getElementById("inputNombreCliente").value   = "";
    document.getElementById("inputIdCliente").value       = "";
    document.getElementById("inputContactoCliente").value = "";

    actualizarTablaClientes();
    actualizarSelectsReserva();
    guardarEnLocalStorage();
    mostrarNotificacion(`Cliente ${nombre} registrado correctamente.`, "exito");
}

function crearReserva() {
    const idCliente     = document.getElementById("selectClienteReserva").value;
    const numHabitacion = document.getElementById("selectHabitacionReserva").value;
    const fechaInicio   = document.getElementById("inputFechaInicio").value;
    const fechaFin      = document.getElementById("inputFechaFin").value;

    if (!idCliente || !numHabitacion || !fechaInicio || !fechaFin) {
        mostrarNotificacion("Completa todos los campos de la reserva.", "error");
        return;
    }

    if (fechaFin <= fechaInicio) {
        mostrarNotificacion("La fecha de salida debe ser posterior a la de entrada.", "error");
        return;
    }

    const cliente    = hotel.clientes.find(cadaCliente => cadaCliente.identificacion === idCliente);
    const habitacion = hotel.habitaciones.find(cadaHabitacion => String(cadaHabitacion.numero) === numHabitacion);

    if (habitacion.estado !== "disponible") {
        mostrarNotificacion(`La habitación ${habitacion.numero} ya está ocupada.`, "error");
        return;
    }

    habitacion.reservar();
    const nuevaReserva = new Reserva(cliente, habitacion, fechaInicio, fechaFin);
    nuevaReserva.id    = contadorReserva++;
    hotel.agregarReserva(nuevaReserva);

    document.getElementById("inputFechaInicio").value = "";
    document.getElementById("inputFechaFin").value    = "";

    actualizarTablaHabitaciones();
    actualizarTablaReservas();
    actualizarSelectsReserva();
    guardarEnLocalStorage();
    mostrarNotificacion(`Reserva creada: ${cliente.nombre} → Hab. ${habitacion.numero}`, "exito");
}

function cancelarReserva(idReserva) {
    const reserva = hotel.reservas.find(cadaReserva => cadaReserva.id === idReserva);

    if (!reserva || reserva.estado === "cancelada") {
        mostrarNotificacion("Esta reserva ya estaba cancelada.", "error");
        return;
    }

    reserva.cancelar();

    actualizarTablaHabitaciones();
    actualizarTablaReservas();
    actualizarSelectsReserva();
    guardarEnLocalStorage();
    mostrarNotificacion(`Reserva #${idReserva} cancelada. Hab. ${reserva.habitacion.numero} disponible.`, "exito");
}

// ============================================================
//  FUNCIONES DE RENDERIZADO
// ============================================================

function actualizarTablaHabitaciones() {
    const tbody = document.getElementById("tablaHabitacionesBody");
    if (!tbody) return;

    tbody.innerHTML = hotel.habitaciones.map(habitacion => `
        <tr>
            <td>${habitacion.numero}</td>
            <td>${habitacion.tipo}</td>
            <td>$${habitacion.precio.toLocaleString()}</td>
            <td>
                <span class="badge ${habitacion.estado === 'disponible' ? 'badgeDisponible' : 'badgeOcupada'}">
                    ${habitacion.estado === 'disponible'
                        ? '<i data-lucide="circle-check"></i>'
                        : '<i data-lucide="circle-x"></i>'}
                    ${habitacion.estado}
                </span>
            </td>
        </tr>
    `).join(""); //El .join("") une todos los elementos del array en un solo string

    actualizarStats();
    lucide.createIcons();
}

function actualizarTablaClientes() {
    const tbody = document.getElementById("tablaClientesBody");
    if (!tbody) return;

    tbody.innerHTML = hotel.clientes.map(cliente => `
        <tr>
            <td>${cliente.nombre}</td>
            <td>${cliente.identificacion}</td>
            <td>${cliente.contacto}</td>
            <td>${hotel.reservas.filter(reserva => reserva.cliente.identificacion === cliente.identificacion && reserva.estado === "activa").length} activa(s)</td>
        </tr>
    `).join("");

    actualizarStats();
    lucide.createIcons();
}

function actualizarTablaReservas() {
    const tbody = document.getElementById("tablaReservasBody");
    if (!tbody) return;

    if (hotel.reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="emptyState">No hay reservas registradas</td></tr>`;
        actualizarStats();
        return;
    }

    tbody.innerHTML = hotel.reservas.map(reserva => `
        <tr class="${reserva.estado === 'cancelada' ? 'filaCancelada' : ''}">
            <td>#${reserva.id}</td>
            <td>${reserva.cliente.nombre}</td>
            <td>Hab. ${reserva.habitacion.numero} (${reserva.habitacion.tipo})</td>
            <td>${reserva.fechaInicio}</td>
            <td>${reserva.fechaFin}</td>
            <td class="celdaAcciones">
                <span class="badge ${reserva.estado === 'activa' ? 'badgeActiva' : 'badgeCancelada'}">
                    ${reserva.estado === 'activa'
                        ? '<i data-lucide="circle-check"></i>'
                        : '<i data-lucide="circle-x"></i>'}
                    ${reserva.estado}
                </span>
                ${reserva.estado === 'activa'
                    ? `<button class="btnCancelar" data-idreserva="${reserva.id}"><i data-lucide="x"></i> Cancelar</button>`
                    : ""}
            </td>
        </tr>
    `).join("");

    actualizarStats();
    lucide.createIcons();
}

function actualizarSelectsReserva() {
    const selectCliente    = document.getElementById("selectClienteReserva");
    const selectHabitacion = document.getElementById("selectHabitacionReserva");
    if (!selectCliente || !selectHabitacion) return;

    selectCliente.innerHTML =
        `<option value="">-- Selecciona un cliente --</option>` +
        hotel.clientes.map(cliente =>
            `<option value="${cliente.identificacion}">${cliente.nombre} (${cliente.identificacion})</option>`
        ).join("");

    selectHabitacion.innerHTML =
        `<option value="">-- Selecciona una habitación --</option>` +
        hotel.habitaciones
            .filter(habitacion => habitacion.estado === "disponible")
            .map(habitacion =>
                `<option value="${habitacion.numero}">Hab. ${habitacion.numero} — ${habitacion.tipo} — $${habitacion.precio}</option>`
            ).join("");
}

function actualizarStats() {
    const totalHabitaciones = document.getElementById("statTotalHabitaciones");
    const disponibles       = document.getElementById("statDisponibles");
    const clientes          = document.getElementById("statClientes");
    const reservasActivas   = document.getElementById("statReservasActivas");

    if (totalHabitaciones) totalHabitaciones.textContent = hotel.habitaciones.length;
    if (disponibles)       disponibles.textContent = hotel.habitaciones.filter(habitacion => habitacion.estado === "disponible").length;
    if (clientes)          clientes.textContent = hotel.clientes.length;
    if (reservasActivas)   reservasActivas.textContent = hotel.reservas.filter(reserva => reserva.estado === "activa").length;
}

// ============================================================
//  NOTIFICACIONES
// ============================================================

function mostrarNotificacion(mensaje, tipo = "exito") {
    const contenedor = document.getElementById("notificaciones");
    if (!contenedor) return;

    const toast = document.createElement("div");
    toast.className = `toast ${tipo === "exito" ? "toastExito" : "toastError"}`;
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(() => toast.classList.add("toastVisible"), 50);
    setTimeout(() => {
        toast.classList.remove("toastVisible");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============================================================
//  NAVEGACIÓN POR PESTAÑAS
// ============================================================

function cambiarPestana(idPestana) {
    document.querySelectorAll(".tabContent").forEach(elemento => elemento.classList.remove("tabContentActivo"));
    document.querySelectorAll(".tabBtn").forEach(elemento => elemento.classList.remove("tabBtnActivo"));

    document.getElementById(idPestana).classList.add("tabContentActivo");
    document.querySelector(`[data-tabid="${idPestana}"]`).classList.add("tabBtnActivo");
}

// ============================================================
//  INICIALIZACIÓN — todos los listeners aquí
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ── Inicializar iconos Lucide en el HTML estático ────────
    lucide.createIcons();

    // ── Render inicial ───────────────────────────────────────
    actualizarTablaHabitaciones();
    actualizarTablaClientes();
    actualizarTablaReservas();
    actualizarSelectsReserva();

    // ── Botones principales ──────────────────────────────────
    document.getElementById("btnRegistrarHabitacion")
        .addEventListener("click", registrarHabitacion);

    document.getElementById("btnRegistrarCliente")
        .addEventListener("click", registrarCliente);

    document.getElementById("btnCrearReserva")
        .addEventListener("click", crearReserva);

    // ── Navegación por pestañas ──────────────────────────────
    document.querySelectorAll(".tabBtn").forEach(botonTab => {
        botonTab.addEventListener("click", () => {
            cambiarPestana(botonTab.dataset.tabid);
        });
    });

    // ── Delegación de eventos: botones "Cancelar" dinámicos ──
    // Se escucha en el tbody para capturar clics en botones generados dinámicamente
    document.getElementById("tablaReservasBody")
        .addEventListener("click", (event) => {
            const btnCancelar = event.target.closest(".btnCancelar");
            if (!btnCancelar) return;

            const idReserva = parseInt(btnCancelar.dataset.idreserva, 10);
            cancelarReserva(idReserva);
        });
});
