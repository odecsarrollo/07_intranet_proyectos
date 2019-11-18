import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/index';
import AppIndex from './index';
import CotizadorDashboard from './cotizaciones/CotizadorDashboard';
import CotizacionDetail from './cotizaciones/cotizacion/CotizacionDetail';

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Ventas Componentes'>
                <Switch>
                    <Route exact path='/app/ventas_componentes/' component={AppIndex}/>
                    <Route exact path='/app/ventas_componentes/cotizaciones/list' component={CotizadorDashboard}/>
                    <Route exact path='/app/ventas_componentes/cotizaciones/detail/:id' component={CotizacionDetail}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;