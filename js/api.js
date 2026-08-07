const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";

const TITULOS_ES = [
  "Preparar informe del proyecto",
  "Estudiar JavaScript ES6",
  "Revisar documentación",
  "Subir proyecto a GitHub",
  "Realizar pruebas finales"
];

const crearTareasEnEspanol = (datos = []) =>
  TITULOS_ES.map((descripcion, index) => {
    const datoApi = datos[index] ?? {};
    const numero = Number(datoApi.id) || index + 1;

    return {
      id: `api-es-${numero}-${Date.now()}-${index}`,
      descripcion,
      estado: datoApi.completed ? "completada" : "pendiente",
      fechaCreacion: new Date().toISOString(),
      fechaLimite: new Date(Date.now() + (index + 1) * 86400000).toISOString(),
      prioridad: index % 3 === 0 ? "alta" : index % 2 === 0 ? "media" : "baja"
    };
  });

export const obtenerTareasApi = async () => {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return crearTareasEnEspanol(datos);
  } catch (error) {
    console.warn("No se pudo consultar JSONPlaceholder. Se usarán tareas de respaldo en español.", error);

    // Respaldo para que la demostración siga funcionando aunque falle Internet o la API.
    return crearTareasEnEspanol();
  }
};
