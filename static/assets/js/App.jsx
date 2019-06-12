import React, {Fragment, Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';
import reducers from './02_reducers/index';
import {connect} from "react-redux";
import {hot} from 'react-hot-loader';
import Notification from './00_utilities/components/system/Notifications';

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
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faConveyorBelt,
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
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faConveyorBelt,
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
import AppMedios from './07_app_medios/App';
import AppContabilidad from './08_app_contabilidad/App';
import Login from './authentication/login/containers/login';


class RootContainerComponent extends Component {
    componentDidMount() {
        this.props.loadUser();
    }

    PrivateRoute = ({component: ChildComponent, ...rest}) => {
        return <Route {...rest} render={props => {
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            } else if (!this.props.auth.isAuthenticated) {
                return <Redirect to="/app/login"/>;
            } else {
                return <ChildComponent {...props} />
            }
        }}/>
    };

    render() {
        let {PrivateRoute} = this;
        return (
            <BrowserRouter>
                <Fragment>
                    <Notification/>
                    <Switch>
                        <PrivateRoute exact path='/' component={AppIndex}/>
                        <PrivateRoute exact path='/app' component={AppIndex}/>
                        <Route path='/app/login' component={Login}/>
                        <PrivateRoute path='/app/admin' component={AppAdmin}/>
                        <PrivateRoute path='/app/proyectos' component={AppProyectos}/>
                        <PrivateRoute path='/app/ventas' component={AppVentas}/>
                        <PrivateRoute path='/app/bandas' component={AppBandas}/>
                        <PrivateRoute path='/app/medios' component={AppMedios}/>
                        <PrivateRoute path='/app/contabilidad' component={AppContabilidad}/>
                    </Switch>
                </Fragment>
            </BrowserRouter>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        auth: state.auth,
    }
}

let RootContainer = hot(module)(connect(mapPropsToState, actions)(RootContainerComponent));

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <RootContainer/>
                </MuiThemeProvider>
            </Provider>
        )
    }
}