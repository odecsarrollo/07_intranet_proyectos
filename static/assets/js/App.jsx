import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {hot} from 'react-hot-loader';
import StylesContextProvider from './00_utilities/contexts/StylesContextProvider';
import {ProvideAuth} from "./00_utilities/hooks";
import RootContainer from './00_utilities/components/system/RootContainer';
import {MuiThemeProvider} from '@material-ui/core/styles';

import theme from './app_theme';
import store from './store';
import AppIndex from './IndexApp';
import AppAdmin from './03_app_admin/App';
import AppProyectos from './04_app_proyectos/App';
import AppVentasProyectos from './05_app_ventas_proyectos/App';
import AppVentasComponentes from './10_app_ventas_componentes/App';
import AppBandas from './06_app_bandas/App';
import AppMedios from './07_app_medios/App';
import AppContabilidad from './08_app_contabilidad/App';
import AppSistemas from './09_app_sistemas/App';
import AppCuenta from './authentication/mi_cuenta/Dashboard';

let App = () => {
    return (
        <Provider store={store}>
            <ProvideAuth>
                <MuiThemeProvider theme={theme}>
                    <StylesContextProvider>
                        <BrowserRouter>
                            <RootContainer>
                                <Switch>
                                    <Route path='/app/admin' component={AppAdmin}/>
                                    <Route path='/app/proyectos' component={AppProyectos}/>
                                    <Route path='/app/ventas_proyectos' component={AppVentasProyectos}/>
                                    <Route path='/app/ventas_componentes' component={AppVentasComponentes}/>
                                    <Route path='/app/bandas' component={AppBandas}/>
                                    <Route path='/app/medios' component={AppMedios}/>
                                    <Route path='/app/contabilidad' component={AppContabilidad}/>
                                    <Route path='/app/sistemas' component={AppSistemas}/>
                                    <Route path='/app/cuenta' component={AppCuenta}/>
                                    <Route path='/app' component={AppIndex}/>
                                    <Route path='/' component={AppIndex}/>
                                </Switch>
                            </RootContainer>
                        </BrowserRouter>
                    </StylesContextProvider>
                </MuiThemeProvider>
            </ProvideAuth>
        </Provider>
    )
};

App = hot(module)(App);
export default App;