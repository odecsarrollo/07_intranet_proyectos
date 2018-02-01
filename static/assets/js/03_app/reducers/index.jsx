import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import NotifyReducer from 'react-redux-notify';
import proyectosReducer from '../../02_reducers/00_maestras/proyectos/proyectosReducer';

const rootReducer = combineReducers({
    proyectos: proyectosReducer,
    notifications: NotifyReducer,
    form: formReducer
});

export default rootReducer;