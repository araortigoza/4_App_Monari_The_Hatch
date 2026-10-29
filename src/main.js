import { crearAplicacion } from "./monari.js";
import { almacen } from "./almacen.js";
import { App } from "./App.jsx";
import "./estilos.css";

crearAplicacion(App, document.getElementById("app"), almacen);