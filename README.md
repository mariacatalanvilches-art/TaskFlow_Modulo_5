# TaskFlow

Aplicación web para crear, editar, eliminar, filtrar y completar tareas utilizando JavaScript moderno.

## Funcionalidades

- Crear, editar y eliminar tareas.
- Cambiar el estado entre pendiente y completada.
- Filtrar tareas por estado.
- Buscar tareas por descripción.
- Guardar y recuperar información con LocalStorage.
- Cargar tareas externas mediante `fetch()` desde JSONPlaceholder.
- Simular asincronía al guardar mediante `setTimeout`.
- Mostrar un contador regresivo actualizado con `setInterval`.
- Gestionar eventos `submit`, `click`, `keyup`, `change` y `mouseover`.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
- Programación orientada a objetos
- DOM
- Fetch API
- LocalStorage

## Estructura

```text
TaskFlow_Modulo_5/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── tarea.js
│   ├── gestorTareas.js
│   ├── api.js
│   └── app.js
├── assets/
├── docs/
│   ├── Informe_Breve.md
│   └── Repositorio_GitHub.txt
└── README.md
```

## Cómo ejecutar

1. Abrir la carpeta del proyecto con Visual Studio Code.
2. Ejecutar el proyecto con la extensión Live Server.
3. También se puede abrir `index.html`, aunque para módulos ES6 se recomienda Live Server.
4. Presionar **Cargar tareas desde API** para probar el consumo de datos externos.

## Autora

María Soledad Catalán Vilches  
Curso Desarrollo Front-End
