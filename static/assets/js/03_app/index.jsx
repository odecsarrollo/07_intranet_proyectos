import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import {Notify} from 'react-redux-notify';

import Menu from './components/menu/menu';

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

import TasasHorasHombresList from './00_maestras/containers/mano_obra/tasas_hora_hombre_list';
import HojaTrabajoDiarioList from './01_mano_obra/containers/hoja_trabajo_diario/hojas_trabajos_diarios_list';
import HojaTrabajoDiarioDetail from './01_mano_obra/containers/hoja_trabajo_diario/hoja_trabajo_diario_detail';
import ProyectosList from './00_maestras/containers/proyectos/proyectos/proyectos_list';
import ProyectosDetail from './00_maestras/containers/proyectos/proyectos/proyectos_detail';


ReactDOM.render(
    < Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
            <BrowserRouter>
                <div>
                    <Notify/>
                    <div id="react-no-print">
                        <Menu/>
                    </div>
                    <Switch>
                        <Route path='/app/maestras/proyectos/proyectos/list' component={ProyectosList}/>

                        <Route path='/app/mano_obra/hojas_trabajo/list' component={HojaTrabajoDiarioList}/>
                        <Route path='/app/mano_obra/hojas_trabajo/detail/:id' component={HojaTrabajoDiarioDetail}/>

                        <Route path='/app/maestras/mano_obra/tasas/list' component={TasasHorasHombresList}/>
                        <Route path='/app/maestras/proyectos/proyectos/detail/:id' component={ProyectosDetail}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>
    , document.querySelector('.react_app')
);