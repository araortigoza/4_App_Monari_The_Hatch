import { crearElemento } from "./monari.js";

// SE DEFINE UN ARRAY DE FILTROS DISPONIBLES EN LA INTERFAZ
const FILTROS = [
    { valor: "todas", etiqueta: "Todas" },
    { valor: "pendientes", etiqueta: "Pendientes" },
    { valor: "hechas", etiqueta: "Hechas" },
];

// FUNCION PARA FILTRAR LAS TAREAS SEGUN LO QUE QUIERE EL USUARIO
function filtrarTareas(tareas, filtro) {
    // VERIFICA QUE EL FILTRO RECIBIDO SEA IGUAL A PENDIENTES
    if (filtro === "pendientes") {
        return tareas.filter((tarea) => !tarea.hecha); // FILTRA TODAS LAS TAREAS CUYO VALOR SEA FALSE
    }

    // VERIFICA QUE EL FILTRO RECIBIDO SEA IGUAL A HECHAS
    if (filtro === "hechas") {
        return tareas.filter((tarea) => tarea.hecha); // FILTRA TODAS LAS TAREAS CUYO VALOR SEA TRUE
    }

    return tareas; // RETORNA TAREAS FILTRADAS
}

// COMPONENTE FORMULARIO
function Formulario({ texto, dispatch }) {
    // FUNCION QUE CAPTURA EL EVENTO DEL FORMULARIO
    function enviar(evento) {
        evento.preventDefault(); // PREVIENE QUE LA PAGINA SE RECARGUE
        dispatch({ tipo: "AGREGAR" }); // DISPARA LA ACCION "AGREGAR"
    }

    // FUNCION QUE CAPTURA CADA LETRA QUE EL USUARIO ESCRIBE EN EL INTUP
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

// COMPONENTE FILTROS
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

// COMPONENTE TAREAS
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

// COMPONENTE RAIZ APP
function App({ estado, dispatch }) {
    const visibles = filtrarTareas(estado.tareas, estado.filtro); // LLAMA A LA FUNCION PARA FILTRAR TAREAS
    const pendientes = estado.tareas.filter((tarea) => !tarea.hecha).length; // CUENTA CUANTAS TAREAS PENDIENTES HAY

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

// SE EXPORTA APP
export { App };