import React from 'react';
import CambiarPasswordForm from "./seguridad/CambiarPasswordForm";
import {Route, Switch} from 'react-router-dom';
import Loading from "../../00_utilities/components/system/LoadingOverlay";
import DrawerMenu from "../../00_utilities/components/ui/drawer/drawer_menu";

const CuentaDashboard = props => {
    return (
        <Loading>
            <DrawerMenu lista_menu={null} titulo='Mi Cuenta'>
                <Switch>
                    <Route exact path='/app/cuenta/' component={CambiarPasswordForm}/>
                </Switch>
            </DrawerMenu>
        </Loading>
    )
};

export default CuentaDashboard;