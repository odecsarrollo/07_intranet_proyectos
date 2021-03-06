import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/LoadingOverlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/Menu';
import AppIndex from './index';
import BandaEurobeltDetail from './bandas_eurobelt/bandas/BandaEurobeltDetail';

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Bandas Eurobelt'>
                <Switch>
                    <Route exact path='/app/bandas/' component={AppIndex}/>
                    <Route exact path='/app/bandas/banda/:id' component={BandaEurobeltDetail}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;