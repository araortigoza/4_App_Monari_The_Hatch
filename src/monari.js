// EQUIVALE AL createElement
// TIPO = REPRESENTA EL TIPO DE ELEMENTO HTML (div, spam, h1, etc.)
// PROPIEDADES = UN OBJETO QUE CONTIENE TODOS LOS ATRIBUTOS O PROPS PASADOS AL ELEMENTO
// HIJOS = TODOS LOS ELEMENTOS HIJOS ANIDADOS DENTRO DEL COMPONENTE
function crearElemento(tipo, propiedades, ...hijos) {
    const props = propiedades || {}; // ASEGURA QUE SI PROPIEDADES VIENE NULL SEA UN OBJETO VACIO PARA NO LANZAR ERROR
    // SE FILTRAN LOS HIJOS HACIENDO QUE SEAN VALIDOS
    const hijosValidos = hijos
        .flat(Infinity) // APLANA LOS ARRAYS QUE HAYA EN HIJOS EN INFINIDAD
        .filter((hijo) => hijo != null && typeof hijo !== "boolean") // ASEGURA QUE NO HAYA NULL NI VALORES BOOLEANOS
        .map((hijo) => (typeof hijo === "object" ? hijo : String(hijo))); // SI UN HIJO ES UN OBJETO SE DEJA TAL CUAL Y SI NO LO CONVIERTE A STRING

    // VERIFICA SI EL TIPO DE TIPO MM ES UNA FUNCION
    if (typeof tipo === "function") {
        return tipo({ ...props, hijos: hijosValidos }); // EJECUTA LA FUNCION PASANDO SUS PROPIEDADES Y LOS HIJOS VALIDOS Y DEVUELVE UN NODO VIRTUAL
    }

    return { tipo, propiedades: props, hijos: hijosValidos }; // CONSTRUYE Y RETORNA UN NODO VIRTUAL ESTANDAR (OBJETO JAVASCRIPT).
}

// FUNCION PARA VERIFICAR SI EL PARAMETRO ES EVENTO O ATRIBUTO
function esEvento(nombre) {
    return /^on[A-Z]/.test(nombre); // DEVUELVE TRUE O FALSE SI ES QUE EL PARAMETRO COMIENZA CON "on" Y LE SIGUE UNA LETRA MAYUSCULA DESDE A HASTA LA Z
}

// FUNCION PARA CONVERTIR EL NOMBRE DEL EVENTO A UNO VALIDO QUE ENTIENDA EL DOM DEL NAVEGADOR
function nombreEvento(nombre) {
    return nombre.slice(2).toLowerCase(); // QUITA LAS DOS PRIMERAS LETRAS DEL NOMBRE ("on") Y LO CONVIERTE EN MINUSCULA
}

// FUNCION QUE SE ENCARGA DE ACTUALIZAR EL ESTILO CSS
// NODO = ES EL NODO REAL DEL DOM AL QUE SE APLICARAN LOS CAMBIOS
// VIEJO = OBJETO QUE CONTIENE LAS REGLAS DE ESTILOS ANTERIORES (POR DEFECTO ES VACIO SI NO TENIA ESTILOS ANTES)
// NUEVO = OBJETO QUE CONTIENE LAS REGLAS DE ESTILOS QUE DEBE TENER EL ELEMENTO
function actualizarEstilo(nodo, viejo = {}, nuevo = {}) {
    // RECORRE LAS PROPIEDADES QUE VIENEN EN "VIEJO"
    for (const regla in viejo) {
        // COMPRUEBA SI ESA REGLA YA NO EXISTE EN NUEVO
        if (!(regla in nuevo)) {
            nodo.style[regla] = ""; // ASIGNA UN STRING VACIO PARA ELIMINAR EL ESTILO VIEJO
        }
    }

    // RECORRE LAS PROPIEDADES QUE VIENEN EN "NUEVO"
    for (const regla in nuevo) {
        if (viejo[regla] !== nuevo[regla]) { // SI EL VALOR DEL ESTILO VIEJO ES DIFERENTE AL DEL ESTILO NUEVO
            nodo.style[regla] = nuevo[regla]; // APLICA EL NUEVO VALOR DE ESTILO A LA PROPIEDAD STYLE DEL NODO REAL DEL DOM
        }
    }
}

// FUNCION PARA ELIMINAR UNA PROPIEDAD O ATRIBUTO DEL NODO REAL DEL DOM
// NODO = ES EL NODO REAL DEL DOM AL QUE SE VA A QUITAR LA PROPIEDAD
// NOMBRE = ES EL NOMBRE DE LA PROPIEDAD A ELIMINAR
// VALORVIEJO = ES EL VALOR ANTERIOR QUE TENIA ESA PROPIEDAD
function quitarPropiedad(nodo, nombre, valorViejo) {
    // SI EL PARAMETRO RECIBIDO ES UN EVENTO
    if (esEvento(nombre)) {
        nodo.removeEventListener(nombreEvento(nombre), valorViejo); // SE REMUEVE EL EVENTO PASANDOLE EL NOMBRE LIMPIO Y EL VALOR DEL EVENTO QUE ES LA FUNCION MANEJADORA
    // SI EL PARAMETRO RECIBIDO ES EL ATRIBUTO STYLE
    } else if (nombre === "style") {
        nodo.style.cssText = ""; // ELIMINA TODOS LOS ESTILOS ASIGNANDO UN STRING VACIO
    // VERIFICA SI LA PROPIEDAD EXISTE EN EL NODO DEL OBJETO DEL DOM
    } else if (nombre in nodo) {
        nodo[nombre] = typeof nodo[nombre] === "boolean" ? false : ""; // SE LE ASIGNA FALSE PARA BLOQUEARLA O UN STRING VACIO PARA ELIMINARLA LIMPIAMENTE
    // SI NO ES NINGUN CASO ANTERIOR
    } else {
        nodo.removeAttribute(nombre); // ELIMINA EL ATRIBUTO REAL DEL HTML POR COMPLETO
    }
}

// FUNCION QUE SE ENCARGA DE ASIGNAR UNA PROPIEDAD EN EL NODO REAL DEL DOM
// NODO = ES EL NODO REAL DEL DOM AL QUE SE LE VA A ASIGNAR UNA PROPIEDAD
// NOMBRE = ES EL NOMBRE DE LA PROPIEDAD A ASIGNAR
// VALORVIEJO = ES EL VALOE ANTERIOR QUE TENIA ESA PROPIEDAD
// VALORNUEVO = ES EL VALOR NUEVO A ASIGNAR A ESA PROPIEDAD
function ponerPropiedad(nodo, nombre, valorViejo, valorNuevo) {
    // VERIFICA QUE EL NOMBRE RECIBIDO SEA UN EVENTO
    if (esEvento(nombre)) {
        if (valorViejo) {
            nodo.removeEventListener(nombreEvento(nombre), valorViejo); // ELIMINA EL EVENTO PASANDOLE EL NOMBRE LIMPIO Y EL VALOR DEL EVENTO QUE ES LA FUNCION MANEJADORA
        }
        nodo.addEventListener(nombreEvento(nombre), valorNuevo); // AGREGA AL NODO REAL DEL DOM EL EVENTO CON EL MISMO NOMBRE PERO CON EL VALOR NUEVO
    // VERIFICA SI LA PROPIEDAD EXISTE EN EL NODO DEL OBJETO DEL DOM
    } else if (nombre in nodo) {
        nodo[nombre] = valorNuevo; // ASIGNA EL VALOR NUEVO A LA PROPIEDAD DENTRO DEL NODO
    // SI NO ES NINGUN CASO ANTERIOR
    } else {
        nodo.setAttribute(nombre, valorNuevo); // ASIGNA EL ATRIBUTO REAL DEL HTML POR EL VALOR NUEVO
    }
}

// FUNCION PARA COMPARAR LAS PROPS VIEJAS Y NUEVAS Y ACTUALIZAR SOLO LO NECESARIO - ALGORITMO DIFFING
// NODO = ES EL ELEMENTO REAL DEL DOM CUYAS PROPIEDADES VAN A SER ACTUALIZADAS
// VIEJAS = ES EL OBJETO CON LAS PROPS ANTERIORES QUE TENIA EL NODO EN EL CICLO ANTERIOR
// NUEVAS = ES EL OBJETO CON LAS PROPS QUE CONTIENE EL NODO EN EL CICLO ACTUAL
function actualizarPropiedades(nodo, viejas, nuevas) {
    // RECORRE TODAS LAS PROPIEDADES QUE HABIAN ANTES
    for (const nombre in viejas) {
        // VERIFICA SI UNA PROP YA NO EXISTE ENTRE LAS NUEVAS
        if (!(nombre in nuevas)) {
            quitarPropiedad(nodo, nombre, viejas[nombre]); // LLAMA A LA FUNCION PARA ELIMINAR ESA PROPIEDAD
        }
    }

    // RECORRE TODAS LAS PROPIEDADES NUEVAS
    for (const nombre in nuevas) {
        // SI EXISTE UNA PROP NUEVA DE ATRIBUTO STYLE
        if (nombre === "style") {
            actualizarEstilo(nodo, viejas.style, nuevas.style); // LLAMA A LA FUNCION PARA ACTUALIZAR EL ESTILO
            continue;
        }

        const cambio = viejas[nombre] !== nuevas[nombre]; // COMPARA SI LA PROP CAMBIO DE UN CICLO A OTRO
        const formularioDesfasado =
            (nombre === "value" || nombre === "checked") && nodo[nombre] !== nuevas[nombre]; // DETECTA SI HAY UN DESFASE ENTRE EL DOM Y LAS PROPS NUEVAS

        // SI ALGUNO ES TRUE 
        if (cambio || formularioDesfasado) {
            ponerPropiedad(nodo, nombre, viejas[nombre], nuevas[nombre]); // LLAMA A LA FUNCION PARA APLICAR LAS NUEVAS PROPIEDADES
        }
    }
}

// FUNCION PARA CREAR UN NODO REAL EN EL DOM
// NODOVIRTUAL = PUEDE SER UN OBJETO QUE REPRESENTA UN ELEMENTO HTML O UN TEXTO PLANO
function crearNodoDom(nodoVirtual) {
    // VERIFICA SI EL PARAMETRO RECIBIDO ES UN STRING
    if (typeof nodoVirtual === "string") {
        return document.createTextNode(nodoVirtual); // UTILIZA EL METODO NATICO DEL NAVEGADOR PARA CREAR UN NODO DE TEXTO REAL Y LO RETORNA
    }
    
    const nodo = document.createElement(nodoVirtual.tipo); // SI ES UNA ETIQUETA HTML ENTONCES CREA EL ELEMENTO EN EL DOM CON EL TIPO DE LA PROP
    actualizarPropiedades(nodo, {}, nodoVirtual.propiedades); // LLAMA A LA FUNCION PARA INYECTAR LAS PROPS AL NUEVO NODO, COMO ES NUEVO, NO CONTIENE VIEJAS
    // RECORRE TODOS LOS NODOS HIJOS DEL NODO RECIBIDO Y LLAMA RECURSIVAMENTE PARA INYECTAR A TODOS LOS HIJOS AL DOM Y FINALMENTE LO ANADE CON APPENDCHILD 
    nodoVirtual.hijos.forEach((hijo) => nodo.appendChild(crearNodoDom(hijo)));

    // RETORNA EL NODO CON TODOS SUS HIJOS ANIDADOS LISTO PARA MONTARLO EN LA PAGINA WEB
    return nodo;
}

// FUNCION PARA 
// PADRE = ES EL ELEMENTO CONTENEDOR REAL DEL DOM
// NODOREAL = ES EL NODO EXACTO REAL DENTRO DEL DOM QUE ESTAREMOS EVALUANDO
// VIEJO = ES EL NODO VIRTUAL ANTERIOR
// NUEVO = ES EL NODO VIRTUAL ACTUAL
function patch(padre, nodoReal, viejo, nuevo) {
    // IDENTIFICA CON BOOLEANOS SI LOS NODOS VIEJO Y NUEVO SON STRINGS
    const viejoEsTexto = typeof viejo === "string";
    const nuevoEsTexto = typeof nuevo === "string";

    // SI AMBOS SON TRUE
    if (viejoEsTexto && nuevoEsTexto) {
        if (viejo !== nuevo) { // Y SI SON DIFERENTES
            nodoReal.nodeValue = nuevo; // ACTUALIZA DIRECTAMENTE LA PROPIEDAD NODEVALUE DEL NODO REAL SIN NECESIDAD DE DESTRUIR EL ELEMENTO
        }
        return; // SALE DE LA FUNCION
    }

    // COMPRUEBA SI UNO ES TEXTO U OTRO ES ETIQUETA HTML O SI LOS TIPOS SON DIFERENTES
    if (viejoEsTexto || nuevoEsTexto || viejo.tipo !== nuevo.tipo) {
        padre.replaceChild(crearNodoDom(nuevo), nodoReal); // CREA UN NUEVO NODO NUEVO A PARTIR DEL NODO VIRTUAL ACTUALIZADO (CREARNODODOM()) Y LO REEMPLAZA AL NODO DEL PADRE
        return; // SALE DE LA FUNCION
    }

    actualizarPropiedades(nodoReal, viejo.propiedades, nuevo.propiedades); // LLAMA A LA FUNCION PARA ACTUALIZAR LAS PROPIEDADES
    patchHijos(nodoReal, viejo.hijos, nuevo.hijos); // LLAMA A LA FUNCION PARA RECONCILIAR A TODOS LOS HIJOS DE ESTE NODO
}

// FUNCION PARA LA RECONCILIACION DE NODOS HIJOS
// PADRE = ES EL ELEMENTO REAL DEL DOM CONTENEDOR CUYOS HIJOS VAN A SER RECONCILIADOS
// VIEJOS = ARRAY QUE CONTIENE NODOS HIJOS QUE ESTABAN RENDERIZADOS ANTERIORMENTE
// NUEVOS = ARRAY QUE CONTIENE NODOS HIJOS QUE DEBEN MOSTRARSE AHORA
function patchHijos(padre, viejos, nuevos) {
    // RECORRE LOS ARRAYS DE FIN AL PRINCIPIO 
    for (let i = viejos.length - 1; i >= nuevos.length; i--) {
        padre.removeChild(padre.childNodes[i]); // ELIMINA LOS ELEMENTOS SOBRANTES
    }

    // ITERA SOBRE LOS NODOS NUEVOS OBTENIENDO SU ELEMENTO E INDICE
    nuevos.forEach((nuevo, i) => {
        // COMPRUEBA SI EN ESA MISMA POSICION YA EXISTIA UN HIJO, SI ES ASI, SIGNIFICA QUE EL NODO YA EXISTE
        if (i < viejos.length) {
            patch(padre, padre.childNodes[i], viejos[i], nuevo); // LLAMA A LA FUNCION PATCH PARA ACTUALIZAR SUS PROPS PARA NO DESTRUIRLO
        // SI NO EXISTE
        } else {
            padre.appendChild(crearNodoDom(nuevo)); // CREA UN NODO TOTALMENTE NUEVO Y LO ANADE AL FINAL DEL CONTENEDOR
        }
    });
}

// FUNCION PARA MANEJAR LOS RENDERIZADOS
// NODOVIRTUAL = ES EL ARBOL DE NODOS VIRTUALES RAIZ (GENERADO POR JSX O COMPONENTE)
// CONTENEDOR = ELEMENTO REAL DEL DOM EN DONDE SE MOSTRARA LA APP
function renderizar(nodoVirtual, contenedor) {
    // REVISA QUE EL CONTENEDOR TENGA UNA PROP PERSONALIZADA LLAMADA ARBOLANTERIOR, SI TIENE, ESTE NO ES EL ESTADO INICIAL
    if (contenedor.arbolAnterior) {
        patch(contenedor, contenedor.firstChild, contenedor.arbolAnterior, nodoVirtual); // LLAMA A LA FUNCION PARA ACTUALIZAR CAMBIOS
    // SINO, ES EL PRIMER RENDERIZADO
    } else {
        contenedor.innerHTML = ""; // LIMPIA CUALQUIER CONTENIDO ANTERIOR
        contenedor.appendChild(crearNodoDom(nodoVirtual)); // CONVIERTE A UN NODO REAL DEL DOM DENTRO DEL CONTENEDOR
    }

    contenedor.arbolAnterior = nodoVirtual; // ACTUALIZA LA PROPIEDAD DEL CONTENEDOR PARA SABER QUE NO ES LA PRIMERA VEZ
}

// FUNCION QUE CREA EL ALMACEN DE DATOS (STORE)
// REDUCER = UNA FUNCION QUE DETERMINA COMO DEBE CAMBIAR EL ESTADO ANTE UNA DETERMINADA ACCION
// ESTADOINICIAL = EL VALOR INICIAL DE LA APP AL ARRANCAR
function crearAlmacen(reducer, estadoInicial) {
    let estado = estadoInicial; // DECLARA UNA VARIABLE PRIVADA, SOLO ES MODIFICADA A TRAVES DEL FLUJO OFICIAL DE STORE
    const oyentes = new Set(); // SE CREA UN SET DE LOS LISTENERS O FUNCIONES QUE SE EJECUTARAN CADA QUE EL ESTADO CAMBIA

    return {
        getState: () => estado, // EXPONE UNA FUNCION PUBLICA QUE DEVUELVE EL VALOR ACTUAL DE LA VARIABLE ESTADO
        // UNICO METODO POSIBLE PARA CAMBIAR EL ESTADO - RECIBE UN PARAMETRO DE ACCION PARA SABER QUE PASO
        dispatch: (accion) => {
            const nuevoEstado = reducer(estado, accion); // SE EJECUTA LA FUNCION REDUCER PASANDOLE ES ESTADO Y LA ACCION RECIBIDA - DEVUELVE EL NUEVO ESTADO

            // SI EL ESTADO NO CAMBIO
            if (nuevoEstado === estado) {
                return; // SE DETIENE LA FUNCION
            }

            estado = nuevoEstado; // SE ACTUALIZA EL ESTADO CON EL NUEVO
            oyentes.forEach((oyente) => oyente(estado)); // RECORRE EL SET DE OYENTES Y EJECUTA CADA UNO PASANDOLE EL NUEVO ESTADO PARA AVISAR A LA INTERFAZ QUE DEBE ACTUALIZARSE
        },
        // PERMITE A OTROS COMPONENTES ESCUCHAR LOS CAMBIOS DEL ALMACEN
        subscribe: (oyente) => {
            oyentes.add(oyente); // ANADE LA FUNCION OYENTE AL SET
            return () => oyentes.delete(oyente); // RETORNA UNA FUNCION PARA ELIMINAR EL OYENTE CUANDO UN COMPONENTE YA NO SE NECESITA
        },
    };
}

// FUNCION PARA LA INICIALIZACION DE LA APP
// COMPONENTE = ES EL COMPONENTE RAIZ DE LA APP
// CONTENEDOR = EL ELEMENTO REAL DEL DOM EN DONDE SE MONTARA LA APP
// ALMACEN = ES EL OBJETO STORE CREADO PREVIAMENTE QUE CONTIENE EL ESTADO GLOBAL Y LOS METODOS PARA GESTIONARLO
function crearAplicacion(componente, contenedor, almacen) {
    // FUNCION INTERNA
    function dibujar() {
        // LLAMA A RENDERIZAR QUE A SU VEZ LLAMA A LA FUNCION DEL COMPONENTE RAIZ PASANDOLE EL VALOR DEL ESTADO ACTUAL Y LA FUNCION DISPATCH PARA QUE PUEDA ENVIAR ACCIONES Y EL CONTENEDOR
        renderizar(
            componente({ estado: almacen.getState(), dispatch: almacen.dispatch }),
            contenedor
        );
    }

    almacen.subscribe(dibujar); // INSCRIBE A LA FUNCION DIBUJAR COMO LISTENER PARA QUE LLAME A DIBUJAR CADA VEZ QUE OCURRA UN CAMBIO 
    dibujar(); // EJECUTA LA FUNCION POR PRIMERA VEZ MANUALMENTE
}
// EXPORTA LAS FUNCIONES NECESARIAS
export { crearElemento, renderizar, crearAlmacen, crearAplicacion };