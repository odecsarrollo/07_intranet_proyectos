import React, {Fragment} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './02_reducers/index';
import {Notify} from 'react-redux-notify';

import 'react-redux-notify/dist/ReactReduxNotify.css';
import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'tether/dist/js/tether';
import 'bootstrap/dist/js/bootstrap';
import './../../css/custom.css';

import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import indigo from '@material-ui/core/colors/indigo';

//import {faSpinnerThird, faWrench} from '@fortawesome/pro-regular-svg-icons';
//import {fal} from '@fortawesome/pro-light-svg-icons';
//import {fab} from '@fortawesome/free-brands-svg-icons';

import {library} from '@fortawesome/fontawesome-svg-core'
import {
    faWrench,
    faCogs,
    faShoppingCart,
    faPuzzlePiece,
    faSignOut,
    faSpinnerThird,
    faBars,
    faHome,
    faAlarmClock,
    faAngleLeft,
    faAngleDown,
    faSearch,
    faProjectDiagram,
    faAngleUp,
    faTrash,
    faEdit,
    faEye,
    faUsers,
    faUser,
    faLock,
    faObjectGroup,
    faUserHardHat,
    faSuitcase,
    faMoneyBillAlt,
    faFile,
    faBook,
    faPlusCircle,
    faMinusCircle,
    faDownload,
    faSyncAlt,
    faTimes,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faCheckCircle,
    faTasks
} from '@fortawesome/pro-solid-svg-icons';

library.add(
    faWrench,
    faCogs,
    faShoppingCart,
    faPuzzlePiece,
    faSignOut,
    faSpinnerThird,
    faBars,
    faHome,
    faAlarmClock,
    faAngleLeft,
    faAngleDown,
    faSearch,
    faProjectDiagram,
    faAngleUp,
    faTrash,
    faEdit,
    faEye,
    faUsers,
    faUser,
    faLock,
    faObjectGroup,
    faUserHardHat,
    faSuitcase,
    faMoneyBillAlt,
    faFile,
    faBook,
    faPlusCircle,
    faMinusCircle,
    faDownload,
    faSyncAlt,
    faTimes,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faCheckCircle,
    faTasks
);

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 12,
    },
    palette: {
        primary: orange,
        secondary: indigo,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = configureStore();

function configureStore() {
    const store = createStoreWithMiddleware(reducers);
    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('./02_reducers', () => {
            const nextRootReducer = require('./02_reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
}

import AppIndex from './IndexApp';
import AppAdmin from './03_app_admin/App';
import AppProyectos from './04_app_proyectos/App';
import AppVentas from './05_app_ventas/App';
import AppBandas from './06_app_bandas/App';

const App = () => {
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <Fragment>
                        <Notify/>
                        <Switch>
                            <Route exact path='/' component={AppIndex}/>
                            <Route exact path='/app' component={AppIndex}/>
                            <Route path='/app/admin' component={AppAdmin}/>
                            <Route path='/app/proyectos' component={AppProyectos}/>
                            <Route path='/app/ventas' component={AppVentas}/>
                            <Route path='/app/bandas' component={AppBandas}/>
                        </Switch>
                    </Fragment>
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    )
};

export default App;