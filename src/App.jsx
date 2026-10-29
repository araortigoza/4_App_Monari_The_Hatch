import { crearElemento } from "./monari.js";

const FILTROS = [
    { valor: "todas", etiqueta: "Todas" },
    { valor: "pendientes", etiqueta: "Pendientes" },
    { valor: "hechas", etiqueta: "Hechas" },
];

function filtrarTareas(tareas, filtro) {
    if (filtro === "pendientes") {
        return tareas.filter((tarea) => !tarea.hecha);
    }

    if (filtro === "hechas") {
        return tareas.filter((tarea) => tarea.hecha);
    }

    return tareas;
}

function Formulario({ texto, dispatch }) {
    function enviar(evento) {
        evento.preventDefault();
        dispatch({ tipo: "AGREGAR" });
    }

    function escribir(evento) {
        dispatch({ tipo: "ESCRIBIR", texto: evento.target.value });
    }

    return (
        <form onSubmit={enviar}>
            <input placeholder="Nueva tarea" value={texto} onInput={escribir} />
            <button type="submit">Agregar</button>
        </form>
    );
}

function Filtros({ filtro, dispatch }) {
    return (
        <div className="filtros">
            {FILTROS.map((opcion) => (
                <button
                    className={opcion.valor === filtro ? "activo" : ""}
                    onClick={() => dispatch({ tipo: "FILTRAR", filtro: opcion.valor })}
                >
                    {opcion.etiqueta}
                </button>
            ))}
        </div>
    );
}

function Tarea({ tarea, dispatch }) {
    return (
        <li className={tarea.hecha ? "hecha" : ""}>
            <input
                type="checkbox"
                checked={tarea.hecha}
                onChange={() => dispatch({ tipo: "ALTERNAR", id: tarea.id })}
            />
            <span>{tarea.texto}</span>
            <button onClick={() => dispatch({ tipo: "BORRAR", id: tarea.id })}>Borrar</button>
        </li>
    );
}

function App({ estado, dispatch }) {
    const visibles = filtrarTareas(estado.tareas, estado.filtro);
    const pendientes = estado.tareas.filter((tarea) => !tarea.hecha).length;

    return (
        <main>
            <h1>Tareas</h1>
            <Formulario texto={estado.texto} dispatch={dispatch} />
            <Filtros filtro={estado.filtro} dispatch={dispatch} />
            <ul>
                {visibles.map((tarea) => (
                    <Tarea tarea={tarea} dispatch={dispatch} />
                ))}
            </ul>
            {visibles.length === 0 && <p>No hay tareas para mostrar.</p>}
            <p>{pendientes} pendientes</p>
        </main>
    );
}

export { App };