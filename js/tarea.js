export class Tarea {
  constructor({
    id = crypto.randomUUID(),
    descripcion,
    estado = "pendiente",
    fechaCreacion = new Date().toISOString(),
    fechaLimite,
    prioridad = "media"
  }) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite;
    this.prioridad = prioridad;
  }

  cambiarEstado() {
    this.estado = this.estado === "pendiente" ? "completada" : "pendiente";
  }

  actualizar({ descripcion, fechaLimite, prioridad }) {
    this.descripcion = descripcion;
    this.fechaLimite = fechaLimite;
    this.prioridad = prioridad;
  }

  estaVencida() {
    return this.estado !== "completada" && new Date(this.fechaLimite) < new Date();
  }
}
