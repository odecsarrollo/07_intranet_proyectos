import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/index';
import CotizacionesList from './cotizaciones/cotizaciones/CotizacionCRUD';
import CotizacionesDetail from './cotizaciones/cotizaciones/CotizacionDetail';
import InformeTunelVentas from './informes/tuberia_ventas/CuadroTuberiaVentas';
import ClientesList from "../03_app_admin/especificas/clientes/clientes/ClienteCRUD";
import ClienteDetail from "../03_app_admin/especificas/clientes/clientes/ClienteDetailDashboard";
import ConfiguracionDashboard from "./configuracion/ConfiguracionDashboard";
import TuberiaVentas from './cotizaciones/tuberia_ventas/TuberiaVentasCRUD';
const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Ventas Proyectos'>
                <Switch>
                    <Route exact path='/app/ventas_proyectos/' component={TuberiaVentas}/>
                    <Route exact path='/app/ventas_proyectos/clientes/list' component={ClientesList}/>
                    <Route exact path='/app/ventas_proyectos/configuracion/dashboard'
                           component={ConfiguracionDashboard}/>
                    <Route exact path='/app/ventas_proyectos/clientes/detail/:id' component={ClienteDetail}/>
                    <Route exact path='/app/ventas_proyectos/cotizaciones/cotizaciones/list'
                           component={CotizacionesList}/>
                    <Route exact path='/app/ventas_proyectos/cotizaciones/cotizaciones/detail/:id'
                           component={CotizacionesDetail}/>
                    <Route exact path='/app/ventas_proyectos/informes/cuadro_tuberia_ventas'
                           component={InformeTunelVentas}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;