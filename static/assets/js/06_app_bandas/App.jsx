import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loading from '../00_utilities/components/system/loading_overlay';
import DrawerMenu from '../00_utilities/components/ui/drawer/drawer_menu';

import Menu from './00_menu/Menu';
import AppIndex from './index';

const App = () => {
    return (
        <Loading>
            <DrawerMenu lista_menu={<Menu/>} titulo='Ventas'>
                <Switch>
                    <Route exact path='/app/bandas/' component={AppIndex}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default App;