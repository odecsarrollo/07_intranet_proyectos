import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import ConfiguracionDashboard from "../10_app_ventas_componentes/configuracion/ConfiguracionDashboard";

import Menu from './00_menu/index';
import AppIndex from './index';
import CotizadorDashboard from './cotizaciones/CotizadorDashboard';
import CotizacionDetail from './cotizaciones/cotizacion/CotizacionDetail';
import ClientesList from "../03_app_admin/especificas/clientes/clientes/ClienteCRUD";
import ClienteDetail from "../03_app_admin/especificas/clientes/clientes/ClienteDetailDashboard";
import FacturaDetail from "../11_app_sistemas_informacion/facturacion/FacturaDetail";

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Ventas Componentes'>
                <Switch>
                    <Route exact path='/app/ventas_componentes/' component={AppIndex}/>
                    <Route exact path='/app/ventas_componentes/cotizaciones/list'
                           component={CotizadorDashboard}/>
                    <Route exact path='/app/ventas_componentes/configuracion/dashboard'
                           component={ConfiguracionDashboard}/>
                    <Route exact path='/app/ventas_componentes/cotizaciones/detail/:id'
                           component={CotizacionDetail}/>
                    <Route exact path='/app/ventas_componentes/clientes/detail/:id'
                           component={ClienteDetail}/>
                    <Route exact path='/app/ventas_componentes/facturas/detail/:id'
                           component={FacturaDetail}/>
                    <Route exact path='/app/ventas_componentes/clientes/list'
                           render={() => <ClientesList modulo='ventas_componentes'/>}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;