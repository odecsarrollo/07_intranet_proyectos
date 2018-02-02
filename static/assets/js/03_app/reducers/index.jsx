import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import proyectosReducer from '../../02_reducers/00_maestras/proyectos/proyectosReducer';
import literalesReducer from '../../02_reducers/00_maestras/proyectos/literalesReducer';
import itemsLiteralesReducer from '../../02_reducers/00_maestras/proyectos/itemsliteralesReducer';

const rootReducer = combineReducers({
    literales: literalesReducer,
    proyectos: proyectosReducer,
    items_literales: itemsLiteralesReducer,
    notifications: NotifyReducer,
    form: formReducer
});

export default rootReducer;