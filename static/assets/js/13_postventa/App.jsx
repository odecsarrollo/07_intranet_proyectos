import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';
import Menu from './00_menu/Menu';
import DashboardPostventa from './Dashboard';
import EventoPostventaEquipoDetail from './eventos_postventa_equipos/EventoPostventaEquipoDetail';

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Postventa'>
                <Switch>
                    <Route exact path='/app/postventa/' component={DashboardPostventa}/>
                    <Route exact path='/app/postventa/orden/:id' component={EventoPostventaEquipoDetail}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;