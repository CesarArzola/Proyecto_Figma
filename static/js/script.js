// Datos iniciales para los 12 computadores del laboratorio
var computadores = [
    { id: 1, bueno: true, comentarios: ["Funciona a la perfección.", "Listo para clases de programación."] },
    { id: 2, bueno: true, comentarios: ["Todo bien con este equipo."] },
    { id: 3, bueno: false, comentarios: ["Este computador se encuentra en mal estado, por favor busca uno que se encuentre en funcionamiento."] },
    { id: 4, bueno: true, comentarios: ["Funciona fluido y rápido."] },
    { id: 5, bueno: false, comentarios: ["Este computador está funcionando lento, parece que tiene algún problema.", "También me ha dado algunos errores al usarlo, creo que necesita una revisión."] },
    { id: 6, bueno: true, comentarios: ["Teclado y mouse respondiendo bien."] },
    { id: 7, bueno: true, comentarios: ["Pantalla limpia y en buen estado."] },
    { id: 8, bueno: true, comentarios: ["Sin inconvenientes."] },
    { id: 9, bueno: true, comentarios: ["Todo perfecto por aquí."] },
    { id: 10, bueno: false, comentarios: ["Se apaga repentinamente."] },
    { id: 11, bueno: true, comentarios: ["Software actualizado instalado."] },
    { id: 12, bueno: true, comentarios: ["Equipo disponible para uso libre."] }
];

// Nombres aleatorios de usuarios simulados
var nombresUsuarios = ["Juan Manuel", "Joaquín Pérez", "María Silva", "Camila Torres", "Lucas Gómez", "Sofía Rojas"];

// ID del computador seleccionado actualmente
var pcSeleccionadoId = 5;

// Inicialización al cargar la ventana
window.onload = function () {
    renderizarMapa();

    if (typeof actualizarDetallesPC === "function") {
        actualizarDetallesPC();
    }
};

// Renderizar la grilla de computadores
function renderizarMapa() {
    var gridContainer = document.getElementById("pcGrid");

    if (gridContainer !== null) {
        // Limpiar contenedor antes de renderizar
        gridContainer.innerHTML = "";

        // Bucle para iterar y crear cada estación de trabajo
        for (var i = 0; i < computadores.length; i++) {
            var pc = computadores[i];
            var esSeleccionado = (pc.id === pcSeleccionadoId);

            var pcElement = document.createElement("div");
            pcElement.className = "pc-station" + (esSeleccionado ? " selected" : "");
            pcElement.setAttribute("data-id", pc.id);
            pcElement.onclick = createPCClickHandler(pc.id);

            var badgeClass = pc.bueno ? "good" : "bad";
            var badgeIcon = pc.bueno ? "fa-check" : "fa-xmark";

            pcElement.innerHTML =
                '<div class="station-screen">' +
                '<i class="fa-solid fa-desktop"></i>' +
                '<div class="status-indicator ' + badgeClass + '">' +
                '<i class="fa-solid ' + badgeIcon + '"></i>' +
                '</div>' +
                '</div>' +
                '<div class="chair"></div>' +
                '<span class="pc-label">PC ' + pc.id + '</span>';

            gridContainer.appendChild(pcElement);
        }
    } else {
        console.warn("El elemento 'pcGrid' no se encontró en esta página.");
    }
}

// Manejador de clic para cada PC
function createPCClickHandler(id) {
    return function () {
        pcSeleccionadoId = id;
        renderizarMapa();
        actualizarDetallesPC();
        abrirModalPC(id);
    };
}

// Obtener objeto PC por ID
function obtenerPC(id) {
    for (var i = 0; i < computadores.length; i++) {
        if (computadores[i].id === id) {
            return computadores[i];
        }
    }
    return null;
}

// Actualizar banner superior y sección de comentarios
function actualizarDetallesPC() {
    var pc = obtenerPC(pcSeleccionadoId);
    if (!pc) return;

    var bannerText = document.getElementById("bannerText");
    var bannerBadge = document.getElementById("bannerBadge");
    var bannerBadgeIcon = document.getElementById("bannerBadgeIcon");

    if (pc.bueno) {
        bannerText.innerText = "Este computador (PC " + pc.id + ") está en buen estado y se encuentra funcionando correctamente.";
        bannerBadge.className = "pc-badge-icon good";
        bannerBadgeIcon.className = "fa-solid fa-check";
    } else {
        bannerText.innerText = "Este computador (PC " + pc.id + ") se encuentra en mal estado, por favor busca uno que se encuentre en funcionamiento.";
        bannerBadge.className = "pc-badge-icon bad";
        bannerBadgeIcon.className = "fa-solid fa-xmark";
    }

    renderizarComentarios(pc);
}

// Renderizar los comentarios mostrando máximo los 3 más recientes
function renderizarComentarios(pc) {
    var commentsContainer = document.getElementById("commentsContainer");
    commentsContainer.innerHTML = "";

    if (!pc.comentarios || pc.comentarios.length === 0) {
        commentsContainer.innerHTML = '<div class="no-comments">No hay comentarios registrados para este computador.</div>';
        return;
    }

    var comentariosAMostrar = pc.comentarios.slice(-3);

    for (var i = comentariosAMostrar.length - 1; i >= 0; i--) {
        var textoComentario = comentariosAMostrar[i];
        var nombreAutor = nombresUsuarios[(i + pc.id) % nombresUsuarios.length];

        var commentCard = document.createElement("div");
        commentCard.className = "comment-card";
        commentCard.innerHTML =
            '<p class="comment-text">"' + escapeHtml(textoComentario) + '"</p>' +
            '<div class="comment-author">' +
            '<div class="avatar"><i class="fa-solid fa-user"></i></div>' +
            '<span class="author-name">' + nombreAutor + '</span>' +
            '</div>';

        commentsContainer.appendChild(commentCard);
    }
}

// Modal dinámica según estado del PC
function abrirModalPC(id) {
    var pc = obtenerPC(id);
    if (!pc) return;

    var modalOverlay = document.getElementById("modalOverlay");
    var modalTitle = document.getElementById("modalTitle");
    var modalDesc = document.getElementById("modalDesc");
    var modalButtons = document.getElementById("modalButtons");

    modalTitle.innerText = "Gestión de PC " + pc.id;

    if (pc.bueno) {
        modalDesc.innerText = "El equipo actualmente figura en BUEN ESTADO. ¿Qué deseas hacer con él?";
        modalButtons.innerHTML =
            '<button class="btn-action primary" onclick="cambiarEstadoPC(' + id + ', false)">' +
            '<i class="fa-solid fa-triangle-exclamation"></i> Informar que se echó a perder' +
            '</button>' +
            '<button class="btn-action secondary" onclick="ocuparPC(' + id + ')">' +
            '<i class="fa-solid fa-user-check"></i> Marcar que lo voy a ocupar' +
            '</button>' +
            '<button class="btn-action cancel" onclick="cerrarModal()">Cancelar</button>';
    } else {
        modalDesc.innerText = "El equipo actualmente figura en MAL ESTADO. ¿Este equipo ya se arregló?";
        modalButtons.innerHTML =
            '<button class="btn-action primary" onclick="cambiarEstadoPC(' + id + ', true)">' +
            '<i class="fa-solid fa-circle-check"></i> Sí, ya se arregló' +
            '</button>' +
            '<button class="btn-action secondary" onclick="enfocarInputProblema()">' +
            '<i class="fa-solid fa-comment-dots"></i> No, sigue malo / Reportar nuevo problema' +
            '</button>' +
            '<button class="btn-action cancel" onclick="cerrarModal()">Cancelar</button>';
    }

    modalOverlay.style.display = "flex";
}

function cerrarModal() {
    var modalOverlay = document.getElementById("modalOverlay");
    modalOverlay.style.display = "none";
}

// Cambiar el estado de bueno / malo de un computador
function cambiarEstadoPC(id, nuevoEstadoBueno) {
    var pc = obtenerPC(id);
    if (pc) {
        pc.bueno = nuevoEstadoBueno;
        if (!nuevoEstadoBueno) {
            pc.comentarios.push("El equipo fue reportado con problemas de funcionamiento.");
        } else {
            pc.comentarios.push("El equipo ha sido reparado y se encuentra operativo.");
        }

        if (pc.comentarios.length > 3) {
            pc.comentarios = pc.comentarios.slice(-3);
        }

        renderizarMapa();
        actualizarDetallesPC();
        cerrarModal();
        mostrarNotificacion(nuevoEstadoBueno ? "¡Equipo marcado como reparado!" : "¡Estado actualizado a mal funcionamiento!");
    }
}

function ocuparPC(id) {
    cerrarModal();
    mostrarNotificacion("Has seleccionado el PC " + id + " para tu sesión de uso.");
}

function enfocarInputProblema() {
    cerrarModal();
    var input = document.getElementById("inputProblem");
    input.focus();
    mostrarNotificacion("Escribe abajo los detalles sobre la falla.");
}

// Agregar comentario al computador actual (máximo 3 guardados)
function agregarComentario() {
    var input = document.getElementById("inputProblem");
    var texto = input.value.trim();

    if (texto === "") {
        mostrarNotificacion("Por favor escribe un comentario o problema antes de enviar.");
        return;
    }

    var pc = obtenerPC(pcSeleccionadoId);
    if (pc) {
        pc.comentarios.push(texto);

        if (pc.comentarios.length > 3) {
            pc.comentarios = pc.comentarios.slice(-3);
        }

        input.value = "";
        actualizarDetallesPC();
        mostrarNotificacion("Comentario agregado correctamente al PC " + pc.id);
    }
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        agregarComentario();
    }
}

// Mostrar notificación toast al usuario
function mostrarNotificacion(mensaje) {
    var toast = document.getElementById("toast");
    toast.innerText = mensaje;
    toast.className = "toast-notification active";

    setTimeout(function () {
        toast.className = "toast-notification";
    }, 2600);
}

// Escapar caracteres HTML por seguridad
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}