import { GestorTareas } from "./gestorTareas.js";
import { obtenerTareasApi } from "./api.js";

const gestor = new GestorTareas("taskflow_tareas_v2_es");

const elementos = {
  form: document.querySelector("#formTarea"),
  tareaId: document.querySelector("#tareaId"),
  descripcion: document.querySelector("#descripcion"),
  fechaLimite: document.querySelector("#fechaLimite"),
  prioridad: document.querySelector("#prioridad"),
  btnGuardar: document.querySelector("#btnGuardar"),
  btnCancelar: document.querySelector("#btnCancelar"),
  btnCargarApi: document.querySelector("#btnCargarApi"),
  lista: document.querySelector("#listaTareas"),
  mensaje: document.querySelector("#mensajeEstado"),
  buscar: document.querySelector("#buscarTarea"),
  filtro: document.querySelector("#filtroEstado"),
  contadorCaracteres: document.querySelector("#contadorCaracteres"),
  total: document.querySelector("#totalTareas"),
  pendientes: document.querySelector("#tareasPendientes"),
  completadas: document.querySelector("#tareasCompletadas")
};

const formatearFecha = (fecha) => {
  const fechaObj = new Date(fecha);

  if (!fecha || Number.isNaN(fechaObj.getTime())) {
    return "Sin fecha límite";
  }

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(fechaObj);
};

const calcularTiempoRestante = (fechaLimite) => {
  const fechaObj = new Date(fechaLimite);

  if (!fechaLimite || Number.isNaN(fechaObj.getTime())) {
    return "Sin fecha límite";
  }

  const diferencia = fechaObj.getTime() - Date.now();

  if (diferencia <= 0) return "Fecha vencida";

  const dias = Math.floor(diferencia / 86400000);
  const horas = Math.floor((diferencia % 86400000) / 3600000);
  const minutos = Math.floor((diferencia % 3600000) / 60000);

  return `${dias}d ${horas}h ${minutos}m restantes`;
};

const mostrarMensaje = (texto, tipo = "info") => {
  elementos.mensaje.textContent = texto;
  elementos.mensaje.dataset.tipo = tipo;

  setTimeout(() => {
    if (elementos.mensaje.textContent === texto) {
      elementos.mensaje.textContent = "";
    }
  }, 2000);
};

const obtenerFiltros = () => ({
  estado: elementos.filtro.value,
  texto: elementos.buscar.value
});

const renderResumen = () => {
  const { total, pendientes, completadas } = gestor.obtenerResumen();
  elementos.total.textContent = total;
  elementos.pendientes.textContent = pendientes;
  elementos.completadas.textContent = completadas;
};

const crearTarjeta = (tarea) => {
  const tarjeta = document.createElement("article");
  tarjeta.className = `task-card ${tarea.estado === "completada" ? "task-card--completed" : ""}`;
  tarjeta.dataset.id = tarea.id;

  tarjeta.innerHTML = `
    <div class="task-card__top">
      <div>
        <h3 class="task-card__title"></h3>
        <div class="badges">
          <span class="badge badge--${tarea.prioridad}">${tarea.prioridad}</span>
          <span class="badge">${tarea.estado}</span>
        </div>
      </div>
      <span class="countdown">${calcularTiempoRestante(tarea.fechaLimite)}</span>
    </div>

    <div>
      <strong>Fecha límite:</strong> ${formatearFecha(tarea.fechaLimite)}
    </div>

    <div class="task-card__actions">
      <button class="task-action task-action--complete" data-accion="estado">
        ${tarea.estado === "completada" ? "Marcar pendiente" : "Completar"}
      </button>
      <button class="task-action task-action--edit" data-accion="editar">Editar</button>
      <button class="task-action task-action--delete" data-accion="eliminar">Eliminar</button>
    </div>
  `;

  tarjeta.querySelector(".task-card__title").textContent = tarea.descripcion;

  tarjeta.addEventListener("mouseover", () => {
    tarjeta.classList.add("is-highlighted");
  });

  tarjeta.addEventListener("mouseleave", () => {
    tarjeta.classList.remove("is-highlighted");
  });

  return tarjeta;
};

const renderTareas = () => {
  const tareas = gestor.filtrar(obtenerFiltros());
  elementos.lista.replaceChildren();

  if (!tareas.length) {
    const vacio = document.createElement("div");
    vacio.className = "empty-state";
    vacio.textContent = "No hay tareas que coincidan con el filtro seleccionado.";
    elementos.lista.append(vacio);
  } else {
    tareas.forEach((tarea) => elementos.lista.append(crearTarjeta(tarea)));
  }

  renderResumen();
};

const limpiarFormulario = () => {
  elementos.form.reset();
  elementos.tareaId.value = "";
  elementos.prioridad.value = "media";
  elementos.btnGuardar.textContent = "Guardar tarea";
  elementos.btnCancelar.hidden = true;
  elementos.contadorCaracteres.textContent = "0/120 caracteres";
};

const cargarFormularioParaEditar = (id) => {
  const tarea = gestor.buscarPorId(id);
  if (!tarea) return;

  elementos.tareaId.value = tarea.id;
  elementos.descripcion.value = tarea.descripcion;
  elementos.fechaLimite.value = tarea.fechaLimite.slice(0, 16);
  elementos.prioridad.value = tarea.prioridad;
  elementos.btnGuardar.textContent = "Actualizar tarea";
  elementos.btnCancelar.hidden = false;
  elementos.contadorCaracteres.textContent = `${tarea.descripcion.length}/120 caracteres`;
  elementos.descripcion.focus();
};

elementos.form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datos = {
    descripcion: elementos.descripcion.value.trim(),
    fechaLimite: new Date(elementos.fechaLimite.value).toISOString(),
    prioridad: elementos.prioridad.value
  };

  if (!datos.descripcion) {
    mostrarMensaje("Escribe una descripción para la tarea.", "error");
    return;
  }

  elementos.btnGuardar.disabled = true;
  elementos.btnGuardar.textContent = "Guardando...";

  await new Promise((resolve) => setTimeout(resolve, 700));

  try {
    if (elementos.tareaId.value) {
      gestor.editar(elementos.tareaId.value, datos);
      mostrarMensaje("Tarea actualizada correctamente.");
    } else {
      gestor.agregar(datos);
      mostrarMensaje("Tarea agregada correctamente.");
    }

    limpiarFormulario();
    renderTareas();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  } finally {
    elementos.btnGuardar.disabled = false;
    if (!elementos.tareaId.value) {
      elementos.btnGuardar.textContent = "Guardar tarea";
    }
  }
});

elementos.btnCancelar.addEventListener("click", limpiarFormulario);

elementos.lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  const tarjeta = evento.target.closest("[data-id]");

  if (!boton || !tarjeta) return;

  const { id } = tarjeta.dataset;
  const { accion } = boton.dataset;

  try {
    if (accion === "estado") {
      gestor.cambiarEstado(id);
      mostrarMensaje("Estado de la tarea actualizado.");
    }

    if (accion === "editar") {
      cargarFormularioParaEditar(id);
      return;
    }

    if (accion === "eliminar") {
      const confirmar = window.confirm("¿Deseas eliminar esta tarea?");
      if (!confirmar) return;

      gestor.eliminar(id);
      mostrarMensaje("Tarea eliminada.");
    }

    renderTareas();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
});

elementos.buscar.addEventListener("keyup", renderTareas);
elementos.filtro.addEventListener("change", renderTareas);

elementos.descripcion.addEventListener("keyup", () => {
  elementos.contadorCaracteres.textContent =
    `${elementos.descripcion.value.length}/120 caracteres`;
});

elementos.btnCargarApi.addEventListener("click", async () => {
  elementos.btnCargarApi.disabled = true;
  elementos.btnCargarApi.textContent = "Cargando...";

  try {
    const tareasApi = await obtenerTareasApi();

    tareasApi.forEach((tarea) => {
      gestor.agregar(tarea);
    });

    mostrarMensaje("Tareas externas cargadas correctamente.");
    renderTareas();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  } finally {
    elementos.btnCargarApi.disabled = false;
    elementos.btnCargarApi.textContent = "Cargar tareas desde API";
  }
});

setInterval(() => {
  document.querySelectorAll(".task-card").forEach((tarjeta) => {
    const tarea = gestor.buscarPorId(tarjeta.dataset.id);
    const contador = tarjeta.querySelector(".countdown");

    if (tarea && contador) {
      contador.textContent = calcularTiempoRestante(tarea.fechaLimite);
    }
  });
}, 60000);

renderTareas();
