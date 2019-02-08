import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/index';
import AppIndex from './index';
import CotizacionesList from './cotizaciones/cotizaciones/containers/cotizaciones_list_container';
import CotizacionesDetail from './cotizaciones/cotizaciones/containers/cotizacion_detail';
import InformeTunelVentas from './informes/tuberia_ventas/cuadro_tuberia_ventas';
import ClientesList from "../03_app_admin/especificas/clientes/clientes/containers/clientes_container";
import ClienteDetail from "../03_app_admin/especificas/clientes/clientes/containers/cliente_detail";

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Ventas'>
                <Switch>
                    <Route exact path='/app/ventas/' component={AppIndex}/>
                    <Route exact path='/app/ventas/clientes/clientes/list' component={ClientesList}/>
                    <Route exact path='/app/ventas/clientes/clientes/detail/:id' component={ClienteDetail}/>
                    <Route exact path='/app/ventas/cotizaciones/cotizaciones/list'
                           component={CotizacionesList}/>
                    <Route exact path='/app/ventas/cotizaciones/cotizaciones/detail/:id'
                           component={CotizacionesDetail}/>
                    <Route exact path='/app/ventas/informes/cuadro_tuberia_ventas'
                           component={InformeTunelVentas}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;