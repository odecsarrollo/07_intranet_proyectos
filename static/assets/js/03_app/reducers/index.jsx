import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import permisosReducer from '../../02_reducers/permissionsReducer';
import proyectosReducer from '../../02_reducers/00_maestras/proyectos/proyectosReducer';
import literalesReducer from '../../02_reducers/00_maestras/proyectos/literalesReducer';
import itemsLiteralesReducer from '../../02_reducers/00_maestras/proyectos/itemsliteralesReducer';
import tasasHorasHombresReducer from '../../02_reducers/00_maestras/mano_obra/tasasHoraHombreReducer';
import colaboradoresReducer from '../../02_reducers/00_maestras/cguno/colaboradoresReducer';
import hojasTrabajosDiariosReducer from '../../02_reducers/01_mano_obra/hoja_trabajo_diario/hojasTrabajoDiarioReducer';
import horasHojaTrabajoReducer from '../../02_reducers/01_mano_obra/hoja_trabajo_diario/horasHojaTrabajoReducer';
import itemsCgunoReducer from '../../02_reducers/00_maestras/cguno/itemsBiableReducer';
import loadingReducer from '../../02_reducers/loadingReducer';

const rootReducer = combineReducers({
    literales: literalesReducer,
    proyectos: proyectosReducer,
    colaboradores: colaboradoresReducer,
    items_literales: itemsLiteralesReducer,
    mis_permisos: permisosReducer,
    tasas_horas_hombres: tasasHorasHombresReducer,
    hojas_trabajos_diarios: hojasTrabajosDiariosReducer,
    horas_hoja_trabajo: horasHojaTrabajoReducer,
    items_cguno: itemsCgunoReducer,
    esta_cargando: loadingReducer,
    notifications: NotifyReducer,
    form: formReducer
});

export default rootReducer;