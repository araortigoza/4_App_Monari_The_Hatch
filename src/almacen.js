import { crearAlmacen } from "./monari.js";

const estadoInicial = {
    tareas: [],
    texto: "",
    filtro: "todas",
    siguienteId: 1,
};

function reducer(estado, accion) {
    switch (accion.tipo) {
        case "ESCRIBIR":
            return { ...estado, texto: accion.texto };

        case "AGREGAR": {
            const texto = estado.texto.trim();

            if (texto === "") {
                return estado;
            }

            return {
                ...estado,
                tareas: [...estado.tareas, { id: estado.siguienteId, texto, hecha: false }],
                texto: "",
                siguienteId: estado.siguienteId + 1,
            };
        }

        case "ALTERNAR":
            return {
                ...estado,
                tareas: estado.tareas.map((tarea) =>
                    tarea.id === accion.id ? { ...tarea, hecha: !tarea.hecha } : tarea
                ),
            };

        case "BORRAR":
            return {
                ...estado,
                tareas: estado.tareas.filter((tarea) => tarea.id !== accion.id),
            };

        case "FILTRAR":
            return { ...estado, filtro: accion.filtro };

        default:
            return estado;
    }
}

const almacen = crearAlmacen(reducer, estadoInicial);

export { almacen };