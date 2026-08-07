import { Tarea } from "./tarea.js";

export class GestorTareas {
  constructor(claveStorage = "taskflow_tareas") {
    this.claveStorage = claveStorage;
    this.tareas = this.cargarDesdeStorage();
  }

  agregar(datos) {
    const tarea = new Tarea(datos);
    this.tareas = [...this.tareas, tarea];
    this.guardarEnStorage();
    return tarea;
  }

  editar(id, cambios) {
    const tarea = this.buscarPorId(id);
    if (!tarea) {
      throw new Error("La tarea no existe.");
    }

    tarea.actualizar(cambios);
    this.guardarEnStorage();
    return tarea;
  }

  cambiarEstado(id) {
    const tarea = this.buscarPorId(id);
    if (!tarea) {
      throw new Error("La tarea no existe.");
    }

    tarea.cambiarEstado();
    this.guardarEnStorage();
    return tarea;
  }

  eliminar(id) {
    const cantidadAnterior = this.tareas.length;
    this.tareas = this.tareas.filter((tarea) => tarea.id !== id);

    if (cantidadAnterior === this.tareas.length) {
      throw new Error("No se encontró la tarea que se desea eliminar.");
    }

    this.guardarEnStorage();
  }

  buscarPorId(id) {
    return this.tareas.find((tarea) => tarea.id === id);
  }

  filtrar({ estado = "todas", texto = "" } = {}) {
    const termino = texto.trim().toLowerCase();

    return this.tareas.filter((tarea) => {
      const coincideEstado = estado === "todas" || tarea.estado === estado;
      const coincideTexto = tarea.descripcion.toLowerCase().includes(termino);
      return coincideEstado && coincideTexto;
    });
  }

  obtenerResumen() {
    const total = this.tareas.length;
    const completadas = this.tareas.filter(({ estado }) => estado === "completada").length;

    return {
      total,
      completadas,
      pendientes: total - completadas
    };
  }

  guardarEnStorage() {
    localStorage.setItem(this.claveStorage, JSON.stringify(this.tareas));
  }

  cargarDesdeStorage() {
    try {
      const datos = JSON.parse(localStorage.getItem(this.claveStorage)) ?? [];

      if (!Array.isArray(datos)) return [];

      return datos
        .filter((datosTarea) => datosTarea && typeof datosTarea.descripcion === "string")
        .map((datosTarea) => {
          const fecha = new Date(datosTarea.fechaLimite);
          const fechaValida = datosTarea.fechaLimite && !Number.isNaN(fecha.getTime());

          return new Tarea({
            ...datosTarea,
            fechaLimite: fechaValida
              ? fecha.toISOString()
              : new Date(Date.now() + 86400000).toISOString()
          });
        });
    } catch (error) {
      console.error("No fue posible recuperar las tareas:", error);
      return [];
    }
  }
}
