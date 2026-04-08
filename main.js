// ============================================================
//  main.js — Sistema de Reservas de Hotel
//  Sin onclick en HTML — todo con addEventListener
//  Iconos: Lucide Icons (lucide.createIcons())
// ============================================================

// ── Instancia principal del hotel ───────────────────────────
const hotel = new Hotel("Grand Antigravity Hotel", "Av. Principal 123");

// ── Datos precargados para demostración ─────────────────────
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

habitacionesIniciales.forEach(h => hotel.agregarHabitacion(h));
clientesIniciales.forEach(c => hotel.agregarCliente(c));

// ── Contador de IDs de reserva ───────────────────────────────
let contadorReserva = 1;

// ============================================================
//  FUNCIONES DE NEGOCIO
// ============================================================

function registrarHabitacion() {
    const numero = document.getElementById("inputNumeroHabitacion").value.trim();
    const tipo   = document.getElementById("inputTipoHabitacion").value;
    const precio = parseFloat(document.getElementById("inputPrecioHabitacion").value);

    if (!numero || !tipo || isNaN(precio) || precio <= 0) {
        mostrarNotificacion("Completa todos los campos correctamente.", "error");
        return;
    }

    const yaExiste = hotel.habitaciones.some(h => String(h.numero) === numero);
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

    const yaExiste = hotel.clientes.some(c => c.identificacion === identificacion);
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

    const cliente    = hotel.clientes.find(c => c.identificacion === idCliente);
    const habitacion = hotel.habitaciones.find(h => String(h.numero) === numHabitacion);

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
    mostrarNotificacion(`Reserva creada: ${cliente.nombre} → Hab. ${habitacion.numero}`, "exito");
}

function cancelarReserva(idReserva) {
    const reserva = hotel.reservas.find(r => r.id === idReserva);

    if (!reserva || reserva.estado === "cancelada") {
        mostrarNotificacion("Esta reserva ya estaba cancelada.", "error");
        return;
    }

    reserva.cancelar();

    actualizarTablaHabitaciones();
    actualizarTablaReservas();
    actualizarSelectsReserva();
    mostrarNotificacion(`Reserva #${idReserva} cancelada. Hab. ${reserva.habitacion.numero} disponible.`, "exito");
}

// ============================================================
//  FUNCIONES DE RENDERIZADO
// ============================================================

function actualizarTablaHabitaciones() {
    const tbody = document.getElementById("tablaHabitacionesBody");
    if (!tbody) return;

    tbody.innerHTML = hotel.habitaciones.map(h => `
        <tr>
            <td>${h.numero}</td>
            <td>${h.tipo}</td>
            <td>$${h.precio.toLocaleString()}</td>
            <td>
                <span class="badge ${h.estado === 'disponible' ? 'badgeDisponible' : 'badgeOcupada'}">
                    ${h.estado === 'disponible'
                        ? '<i data-lucide="circle-check"></i>'
                        : '<i data-lucide="circle-x"></i>'}
                    ${h.estado}
                </span>
            </td>
        </tr>
    `).join("");

    actualizarStats();
    lucide.createIcons();
}

function actualizarTablaClientes() {
    const tbody = document.getElementById("tablaClientesBody");
    if (!tbody) return;

    tbody.innerHTML = hotel.clientes.map(c => `
        <tr>
            <td>${c.nombre}</td>
            <td>${c.identificacion}</td>
            <td>${c.contacto}</td>
            <td>${hotel.reservas.filter(r => r.cliente.identificacion === c.identificacion && r.estado === "activa").length} activa(s)</td>
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

    tbody.innerHTML = hotel.reservas.map(r => `
        <tr class="${r.estado === 'cancelada' ? 'filaCancelada' : ''}">
            <td>#${r.id}</td>
            <td>${r.cliente.nombre}</td>
            <td>Hab. ${r.habitacion.numero} (${r.habitacion.tipo})</td>
            <td>${r.fechaInicio}</td>
            <td>${r.fechaFin}</td>
            <td class="celdaAcciones">
                <span class="badge ${r.estado === 'activa' ? 'badgeActiva' : 'badgeCancelada'}">
                    ${r.estado === 'activa'
                        ? '<i data-lucide="circle-check"></i>'
                        : '<i data-lucide="circle-x"></i>'}
                    ${r.estado}
                </span>
                ${r.estado === 'activa'
                    ? `<button class="btnCancelar" data-idReserva="${r.id}"><i data-lucide="x"></i> Cancelar</button>`
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
        hotel.clientes.map(c =>
            `<option value="${c.identificacion}">${c.nombre} (${c.identificacion})</option>`
        ).join("");

    selectHabitacion.innerHTML =
        `<option value="">-- Selecciona una habitación --</option>` +
        hotel.habitaciones
            .filter(h => h.estado === "disponible")
            .map(h =>
                `<option value="${h.numero}">Hab. ${h.numero} — ${h.tipo} — $${h.precio}</option>`
            ).join("");
}

function actualizarStats() {
    const totalHabitaciones = document.getElementById("statTotalHabitaciones");
    const disponibles       = document.getElementById("statDisponibles");
    const clientes          = document.getElementById("statClientes");
    const reservasActivas   = document.getElementById("statReservasActivas");

    if (totalHabitaciones) totalHabitaciones.textContent = hotel.habitaciones.length;
    if (disponibles)       disponibles.textContent = hotel.habitaciones.filter(h => h.estado === "disponible").length;
    if (clientes)          clientes.textContent = hotel.clientes.length;
    if (reservasActivas)   reservasActivas.textContent = hotel.reservas.filter(r => r.estado === "activa").length;
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
    document.querySelectorAll(".tabContent").forEach(el => el.classList.remove("tabContentActivo"));
    document.querySelectorAll(".tabBtn").forEach(el => el.classList.remove("tabBtnActivo"));

    document.getElementById(idPestana).classList.add("tabContentActivo");
    document.querySelector(`[data-tabId="${idPestana}"]`).classList.add("tabBtnActivo");
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
    document.querySelectorAll(".tabBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            cambiarPestana(btn.dataset.tabId);
        });
    });

    // ── Delegación de eventos: botones "Cancelar" dinámicos ──
    // Se escucha en el tbody para capturar clics en botones generados dinámicamente
    document.getElementById("tablaReservasBody")
        .addEventListener("click", (event) => {
            const btnCancelar = event.target.closest(".btnCancelar");
            if (!btnCancelar) return;

            const idReserva = parseInt(btnCancelar.dataset.idReserva, 10);
            cancelarReserva(idReserva);
        });
});
