import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import misPermisosReducer from './generales/permisos/misPermisosReducer';
import otroUsuarioPermisosReducer from './generales/permisos/otroUsarioPermisosReducer';
import gruposPermisosReducer from './generales/permisos/gruposPermisosReducer';
import permisosReducer from './generales/permisos/permisosReducer';
import usuariosReducer from './generales/usuariosReducer';
import loadingReducer from './generales/loadingReducer';
import miCuentaReducer from './generales/miCuentaReducer';

import proyectosReducer from '../02_reducers/especificas/cguno/proyectosReducer';
import literalesReducer from "./especificas/cguno/literalesReducer";
import itemsLiteralesReducer from "./especificas/cguno/itemsliteralesReducer";
import colaboradoresReducer from "./especificas/cguno/colaboradoresReducer";
import centrosCostosColaboradoresReducer from "./especificas/cguno/centrosCostosColaboradoresReducer";
import itemsCgunoReducer from "./especificas/cguno/itemsBiableReducer";

import colaboradoresCostosMesesReducer from "./especificas/cguno/colaboradoresCostosMesesReducer";
import hojasTrabajosDiariosReducer from "./especificas/mano_obra/hojaTrabajoDiarioReducer";
import horasHojasTrabajosDiariosReducer from "./especificas/mano_obra/horasHojaTrabajoDiarioReducer";
import horasColaboradoresProyectosInicialesReducer
    from "./especificas/mano_obra/HorasColaboradoresProyectosInicialesReducer";

import clientesReducer from "./especificas/clientes/clientesReducer";

import cotizacionesReducer from "./especificas/cotizaciones/cotizacionesReducer";
import cotizacionesSeguimientosReducer from "./especificas/cotizaciones/cotizacionesSeguimientosReducer";

const rootReducer = combineReducers({
    mis_permisos: misPermisosReducer,
    permisos: permisosReducer,
    permisos_otro_usuario: otroUsuarioPermisosReducer,
    grupos_permisos: gruposPermisosReducer,
    mi_cuenta: miCuentaReducer,
    usuarios: usuariosReducer,
    esta_cargando: loadingReducer,
    notifications: NotifyReducer,
    form: formReducer,
    proyectos: proyectosReducer,
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
    cotizaciones: cotizacionesReducer,
    cotizaciones_seguimientos: cotizacionesSeguimientosReducer,
});

export default rootReducer;