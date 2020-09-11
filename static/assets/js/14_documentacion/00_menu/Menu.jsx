import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";

import {MENU_GERENCIA_PERMISSIONS} from "../../permisos";

const Menu = () => {
    const permisos_menu = useTengoPermisos(MENU_GERENCIA_PERMISSIONS);
    return <Fragment>
        <DrawerListItem
            size='lg'
            link='/app/gerencia/'
            texto='Principal'
            icono='home'
        />
    </Fragment>
};

export default Menu;