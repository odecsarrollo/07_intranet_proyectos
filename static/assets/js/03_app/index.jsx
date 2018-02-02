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
                        <Route path='/app/maestras/proyectos/proyectos/detail/:id' component={ProyectosDetail}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>
    , document.querySelector('.react_app')
);