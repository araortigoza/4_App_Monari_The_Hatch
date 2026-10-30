// SE IMPORTA LA FUNCION DE CREAR ALMACEN DEL FRAMEWOKR MONARI
import { crearAlmacen } from "./monari.js";

// SE DEFINE EL ESTADO INICIAL DE LA APP
const estadoInicial = {
    tareas: [], // ARRAY DE OBJETOS DE LAS TAREAS
    texto: "", // STRING PARA DETECTAR LO QUE ESTRIBE EL USUARIO
    filtro: "todas", // UN SELECTOR PARA FILTRAR LAS TAREAS (POR DEFECTO EN TODAS)
    siguienteId: 1, // UN CONTADOR NUMERICO INCREMENTAL
};

// FUNCION PARA CALCULAR Y RETORNAR UN NUEVO ESTADO
function reducer(estado, accion) {
    // LEE EL TIPO DE ACCION
    switch (accion.tipo) {
        // CASO ESCRIBIR
        case "ESCRIBIR":
            return { ...estado, texto: accion.texto }; // CREA UN NUEVO OBJETO RESPETANDO LO QUE YA HABIA DENTRO DEL ESTADO Y AGREGAR EL TEXTO NUEVO

        // CASO AGREGAR
        case "AGREGAR": {
            const texto = estado.texto.trim(); // ELIMINA DEL INICIO Y FIN LOS ESPACIOS EN BLANCO

            // SI ES TEXTO VIENE VACIO
            if (texto === "") {
                return estado; // SE DECIDE NO HACER CAMBIOS Y RETORNAR EL ESTADO EXACTAMENTE IGUAL
            }

            // SI HAY TEXTO VALIDO
            return {
                ...estado, // A LA COPIA DE LAS PROPS RECIBIDAS =
                tareas: [...estado.tareas, { id: estado.siguienteId, texto, hecha: false }], // ANADE UNA TAREA AL ARRAY
                texto: "", // DEJA NUEVAMENTE VACIO
                siguienteId: estado.siguienteId + 1, // AUMENTA EL NUMERO DE ID PARA LA PROXIMA TAREA
            };
        }

        // CASO ALTERNAR
        case "ALTERNAR":
            return {
                ...estado, // A LA COPIA DE LAS PROPS RECIBIDAS =
                // RECORRE EL ARRAY DE TAREAS
                tareas: estado.tareas.map((tarea) =>
                    // SI EL ID COINCIDE CON EL ID DE LA ACCION RECIBIDA -> ALTERNA EL VALOR BOOLEANO
                    tarea.id === accion.id ? { ...tarea, hecha: !tarea.hecha } : tarea
                ),
            };
        
        // CASO BORRAR
        case "BORRAR":
            return {
                ...estado, // A LA COPIA DE LAS PROPS RECIBIDAS =
                tareas: estado.tareas.filter((tarea) => tarea.id !== accion.id), // BORR DEL ARRAY DE TAREAS LA TAREA CUYO ID COINCIDA CON LA RECIBIDA
            };
        
        // CASO FILTRAR
        case "FILTRAR":
            return { ...estado, filtro: accion.filtro }; // ACTUALIZA LA PROPIEDAD DE FILTRO (COMPLETADAS, PENDIENTES O TODAS)
        
        // SI LLEGA CUALQUIER OTRA ACCION DESCONOCIDA
        default:
            return estado; // SE RETORNA EL ESTADO SIN CAMBIOS
    }
}

const almacen = crearAlmacen(reducer, estadoInicial); // SE INSTANCIA EL ALMACEN

// SE EXPORTA EL ALMACEN
export { almacen };