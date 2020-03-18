import React, {Fragment, Component, Suspense, useEffect} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './02_reducers/index';
import {connect} from "react-redux";
import {hot} from 'react-hot-loader';
import StylesContextProvider from './00_utilities/contexts/StylesContextProvider';
import Notification from './00_utilities/components/system/Notifications';
import {ProvideAuth, useAuth} from "./00_utilities/hooks";

import * as actions from "./01_actions/01_index";

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
    faCodeMerge,
    faEyeSlash,
    faBarcode,
    faReceipt,
    faAddressBook,
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
    faTimesCircle,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faConveyorBelt,
    faComments,
    faSuitcaseRolling,
    faCoins,
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInboxOut,
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
} from '@fortawesome/pro-solid-svg-icons';

library.add(
    faEyeSlash,
    faBarcode,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faSuitcaseRolling,
    faPuzzlePiece,
    faSignOut,
    faSpinnerThird,
    faComments,
    faBars,
    faCoins,
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
    faReceipt,
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
    faTimesCircle,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faConveyorBelt,
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInboxOut,
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    faCodeMerge
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
import AppVentasProyectos from './05_app_ventas_proyectos/App';
import AppVentasComponentes from './10_app_ventas_componentes/App';
import AppBandas from './06_app_bandas/App';
import AppMedios from './07_app_medios/App';
import AppContabilidad from './08_app_contabilidad/App';
import AppSistemas from './09_app_sistemas/App';
import Login from './authentication/login/containers/login';

let ContainerRoot = () => {
    const authentication = useAuth();
    const {auth: {isAuthenticated, isLoading}} = authentication;
    if (isLoading) {
        return <div>Esta cargando...</div>
    }
    return (
        <Fragment>
            <Notification/>
            {!isAuthenticated && <Login/>}
            {isAuthenticated && <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route path='/app/admin' component={AppAdmin}/>
                    <Route path='/app/proyectos' component={AppProyectos}/>
                    <Route path='/app/ventas_proyectos' component={AppVentasProyectos}/>
                    <Route path='/app/ventas_componentes' component={AppVentasComponentes}/>
                    <Route path='/app/bandas' component={AppBandas}/>
                    <Route path='/app/medios' component={AppMedios}/>
                    <Route path='/app/contabilidad' component={AppContabilidad}/>
                    <Route path='/app/sistemas' component={AppSistemas}/>
                    <Route path='/app' component={AppIndex}/>
                    <Route path='/' component={AppIndex}/>
                </Switch>
            </Suspense>}
        </Fragment>
    )
};

ContainerRoot = hot(module)(ContainerRoot);

const App = () => {
    return (
        <Provider store={store}>
            <ProvideAuth>
                <MuiThemeProvider theme={theme}>
                    <StylesContextProvider>
                        <BrowserRouter>
                            <ContainerRoot/>
                        </BrowserRouter>
                    </StylesContextProvider>
                </MuiThemeProvider>
            </ProvideAuth>
        </Provider>
    )
};

export default App;