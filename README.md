# Monari Tareas

Lista de tareas construida con **Monari**, un mini framework de JavaScript hecho desde cero (JSX, arquitectura FLUX y virtual DOM). Esta app es la prueba de que el framework funciona.

## Funcionalidades

- Agregar tareas (las vacías se ignoran).
- Marcar tareas como hechas o pendientes.
- Borrar tareas.
- Filtrar por todas, pendientes y hechas.
- Contador de tareas pendientes.

## Requisitos

- Node.js 20.19 o superior (o 22.12 o superior), por Vite 8.

## Cómo correrla

```
npm install
npm run dev
```

Abre en el navegador la dirección que muestra la terminal (normalmente `http://localhost:5173`).

Otros comandos:

- `npm run build`: genera la versión final en la carpeta `dist`.
- `npm run preview`: prueba esa versión final localmente.

## Estructura

```
monari-tareas/
├── src/
│   ├── monari.js
│   ├── almacen.js
│   ├── App.jsx
│   ├── main.js
│   └── estilos.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

- `src/monari.js`: copia del framework. Si cambias el framework, esta copia hay que actualizarla a mano.
- `src/almacen.js`: estado inicial, reducer y almacén.
- `src/App.jsx`: componentes de la interfaz (`App`, `Formulario`, `Filtros` y `Tarea`).
- `src/main.js`: monta la aplicación en la página.
- `src/estilos.css`: estilos.
- `index.html`: contiene el `<div id="app">` donde se dibuja todo.
- `vite.config.js`: configura cómo Vite convierte el JSX.

## Cómo funciona

La app sigue la arquitectura FLUX: los datos van en una sola dirección.

```
Evento en pantalla → dispatch(acción) → reducer → estado nuevo → se vuelve a dibujar
```

1. El usuario hace algo (escribir, hacer clic).
2. El evento llama a `dispatch` con una acción, por ejemplo `{ tipo: "BORRAR", id: 2 }`.
3. El `reducer` recibe el estado actual y la acción, y devuelve un estado nuevo.
4. El almacén avisa a la aplicación, que vuelve a dibujar. Monari compara con lo que ya estaba en pantalla y solo cambia lo que hace falta.

### Estado

```js
{
    tareas: [],          // { id, texto, hecha }
    texto: "",           // lo que se escribe en el campo
    filtro: "todas",     // "todas", "pendientes" o "hechas"
    siguienteId: 1,      // id de la próxima tarea
}
```

### Acciones

| Acción | Datos | Qué hace |
|---|---|---|
| `ESCRIBIR` | `texto` | Guarda lo que se escribe en el campo. |
| `AGREGAR` | ninguno | Agrega una tarea con el texto del campo y lo limpia. Si está vacío, no hace nada. |
| `ALTERNAR` | `id` | Cambia una tarea entre hecha y pendiente. |
| `BORRAR` | `id` | Elimina una tarea. |
| `FILTRAR` | `filtro` | Cambia el filtro activo. |

## Configuración del JSX

Para que Vite convierta el JSX en llamadas a `crearElemento`, `vite.config.js` usa el JSX clásico:

```js
import { defineConfig } from "vite";

export default defineConfig({
    oxc: {
        jsx: {
            runtime: "classic",
            pragma: "crearElemento",
        },
    },
    optimizeDeps: {
        noDiscovery: true,
    },
});
```

Además, cada archivo `.jsx` debe importar `crearElemento` desde `monari.js`, aunque no lo llame por su nombre: el JSX lo usa por debajo.

## Framework

Monari tiene su propio repositorio, con la guía "Cómo Hacerlo" y la referencia técnica (https://github.com/araortigoza/4_Framework_Monari_The_Hatch).
