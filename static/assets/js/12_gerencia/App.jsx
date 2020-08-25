import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import InformeVentaFacturacion from './informes/InformeVentaFacturacion';
import InformeAcuerdoPagoProyecto from './informes/InformeAcuerdoPagoProyecto';

import Menu from './00_menu/Menu';

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Gerencia'>
                <Switch>
                    <Route exact path='/app/gerencia/' component={InformeVentaFacturacion}/>
                    <Route exact path='/app/gerencia/ventas/' component={InformeVentaFacturacion}/>
                    <Route exact path='/app/gerencia/acuerdos_pagos/' component={InformeAcuerdoPagoProyecto}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;