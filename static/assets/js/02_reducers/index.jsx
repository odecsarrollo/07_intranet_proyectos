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
import tercerosReducer from './especificas/tercerosReducer';
import literalesReducer from "./especificas/cguno/literalesReducer";
import itemsLiteralesReducer from "./especificas/cguno/itemsliteralesReducer";
import colaboradoresReducer from "./especificas/cguno/colaboradoresReducer";
import centrosCostosColaboradoresReducer from "./especificas/cguno/centrosCostosColaboradoresReducer";
import itemsCgunoReducer from "./especificas/cguno/itemsBiableReducer";

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
    terceros: tercerosReducer,
    proyectos: proyectosReducer,
    literales: literalesReducer,
    items_literales: itemsLiteralesReducer,
    colaboradores: colaboradoresReducer,
    items_cguno: itemsCgunoReducer,
    centros_costos_colaboradores: centrosCostosColaboradoresReducer,
});

export default rootReducer;