import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import misPermisosReducer from './generales/permisos/misPermisosReducer';
import gruposPermisosReducer from './generales/permisos/gruposPermisosReducer';
import permisosReducer from './generales/permisos/permisosReducer';
import usuariosReducer from './generales/usuariosReducer';
import loadingReducer from './generales/loadingReducer';
import miCuentaReducer from './generales/miCuentaReducer';
import menuReducer from './generales/menuReducer';

import proyectosReducer from './especificas/proyectos/proyectosReducer';
import proyectosArchivosReducer from "./especificas/proyectos/archivosProyectosReducer";
import literalesArchivosReducer from "./especificas/proyectos/archivosLiteralesReducer";
import miembrosLiteralesReducer from './especificas/proyectos/miembrosLiteralesReducer';
import fasesReducer from './especificas/proyectos/fasesReducer';
import fasesLiteralesReducer from './especificas/proyectos/fasesLiteralesReducer';
import tareasFasesReducer from './especificas/proyectos/tareasFasesReducer';
import literalesReducer from "./especificas/proyectos/literalesReducer";
import itemsLiteralesReducer from "./especificas/proyectos/itemsliteralesReducer";
import colaboradoresReducer from "./especificas/cguno/colaboradoresReducer";
import centrosCostosColaboradoresReducer from "./especificas/cguno/centrosCostosColaboradoresReducer";
import itemsCgunoReducer from "./especificas/proyectos/itemsBiableReducer";

import colaboradoresCostosMesesReducer from "./especificas/cguno/colaboradoresCostosMesesReducer";
import hojasTrabajosDiariosReducer from "./especificas/mano_obra/hojaTrabajoDiarioReducer";
import horasHojasTrabajosDiariosReducer from "./especificas/mano_obra/horasHojaTrabajoDiarioReducer";
import horasColaboradoresProyectosInicialesReducer
    from "./especificas/mano_obra/HorasColaboradoresProyectosInicialesReducer";

import clientesReducer from "./especificas/clientes/clientesReducer";
import clientesContactosReducer from "./especificas/clientes/clientesContactosReducer";

import cotizacionesReducer from "./especificas/cotizaciones/cotizacionesReducer";
import cotizacionesSeguimientosReducer from "./especificas/cotizaciones/cotizacionesSeguimientosReducer";
import cotizacionesArchivosReducer from "./especificas/cotizaciones/archivosCotizacionesReducer";

import configuracionCostos from './especificas/configuraciones/configuracionCostosReducer';

const rootReducer = combineReducers({
    menu_status: menuReducer,
    mis_permisos: misPermisosReducer,
    permisos: permisosReducer,
    grupos_permisos: gruposPermisosReducer,
    mi_cuenta: miCuentaReducer,
    usuarios: usuariosReducer,
    esta_cargando: loadingReducer,
    notifications: NotifyReducer,
    form: formReducer,
    proyectos: proyectosReducer,
    miembros_literales: miembrosLiteralesReducer,
    fases: fasesReducer,
    fases_literales: fasesLiteralesReducer,
    fases_tareas: tareasFasesReducer,
    literales: literalesReducer,
    items_literales: itemsLiteralesReducer,
    colaboradores: colaboradoresReducer,
    items_cguno: itemsCgunoReducer,
    centros_costos_colaboradores: centrosCostosColaboradoresReducer,
    colaboradores_costos_nomina: colaboradoresCostosMesesReducer,
    hojas_trabajos_diarios: hojasTrabajosDiariosReducer,
    horas_hojas_trabajos: horasHojasTrabajosDiariosReducer,
    horas_colaboradores_proyectos_iniciales: horasColaboradoresProyectosInicialesReducer,
    clientes: clientesReducer,
    clientes_contactos: clientesContactosReducer,
    cotizaciones: cotizacionesReducer,
    cotizaciones_seguimientos: cotizacionesSeguimientosReducer,
    configuracion_costos: configuracionCostos,
    archivos_cotizaciones: cotizacionesArchivosReducer,
    archivos_literales: literalesArchivosReducer,
    archivos_proyecto: proyectosArchivosReducer,
});

export default rootReducer;