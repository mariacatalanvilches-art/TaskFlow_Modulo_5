# Informe breve del proyecto TaskFlow

## 1. Descripción

TaskFlow es una aplicación web de gestión de tareas desarrollada con HTML, CSS y JavaScript. Permite crear, editar, eliminar, completar, buscar y filtrar tareas.

## 2. Orientación a objetos

Se creó la clase `Tarea`, que representa cada tarea con propiedades como identificador, descripción, estado, fecha de creación, fecha límite y prioridad.

También se creó la clase `GestorTareas`, responsable de administrar la lista de tareas, guardarlas en LocalStorage, filtrarlas, editarlas y eliminarlas.

## 3. JavaScript ES6+

El proyecto utiliza `let`, `const`, clases, módulos, template literals, arrow functions, destructuring, spread operator, `async/await` y métodos modernos de arreglos.

## 4. Eventos y DOM

La interfaz utiliza eventos de formulario, clic, teclado, cambio de filtros y mouseover. La lista de tareas se crea de forma dinámica mediante manipulación del DOM.

## 5. Asincronía

Se usa `setTimeout` para simular el tiempo de guardado y mostrar mensajes durante dos segundos. También se usa `setInterval` para actualizar el contador regresivo de las tareas.

## 6. API y almacenamiento

La aplicación consume tareas desde JSONPlaceholder mediante `fetch()` y maneja errores con `try/catch`. Las tareas se guardan y recuperan mediante LocalStorage.

## 7. Conclusión

El proyecto cumple con los principales objetivos del módulo: programación orientada a objetos, ES6+, manipulación del DOM, eventos, asincronía, consumo de API y almacenamiento local.
