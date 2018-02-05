import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import permisosReducer from '../../02_reducers/permissionsReducer';
import proyectosReducer from '../../02_reducers/00_maestras/proyectos/proyectosReducer';
import literalesReducer from '../../02_reducers/00_maestras/proyectos/literalesReducer';
import itemsLiteralesReducer from '../../02_reducers/00_maestras/proyectos/itemsliteralesReducer';
import tasasHorasHombresReducer from '../../02_reducers/00_maestras/mano_obra/tasasHoraHombreReducer';
import colaboradoresReducer from '../../02_reducers/00_maestras/cguno/colaboradoresReducer';

const rootReducer = combineReducers({
    literales: literalesReducer,
    proyectos: proyectosReducer,
    colaboradores: colaboradoresReducer,
    items_literales: itemsLiteralesReducer,
    mis_permisos: permisosReducer,
    tasas_horas_hombres: tasasHorasHombresReducer,
    notifications: NotifyReducer,
    form: formReducer
});

export default rootReducer;