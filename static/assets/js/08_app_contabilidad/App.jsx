import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/index';
import AppIndex from './index';
import CobroDetalle from './anticipos/anticipos/components/CobroDetail';
import useTengoPermisos from "../00_utilities/hooks/useTengoPermisos";
import {MODULO_PERMISSIONS} from "../permisos";


const App = () => {
    const permisos_modulos = useTengoPermisos(MODULO_PERMISSIONS);
    const {modulo_contabilidad} = permisos_modulos;
    if (!modulo_contabilidad) {
        return <div>No tiene suficientes permisos</div>
    }
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Contabilidad'>
                <Switch>
                    <Route exact path='/app/contabilidad/' component={AppIndex}/>
                    <Route exact path='/app/contabilidad/cobros/detalle/:id' component={CobroDetalle}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;