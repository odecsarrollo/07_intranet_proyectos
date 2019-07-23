import React, {Fragment, memo} from 'react';
import MenuTerceros from './MenuTerceros';
import MenuPermisos from './MenuPermisos';
import MenuConfiguraciones from './MenuConfiguraciones';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_ADMIN_PERMISSIONS} from "../../permisos";

const MenuAdmin = memo(props => {
    const permisos_menu = useTengoPermisos(MENU_ADMIN_PERMISSIONS);
    return (
        <Fragment>
            <MenuTerceros permisos_menu={permisos_menu}/>
            <MenuPermisos permisos_menu={permisos_menu}/>
            <MenuConfiguraciones permisos_menu={permisos_menu}/>
            <DrawerListItem
                size='lg'
                link='/app/admin/sistemas_informacion/list'
                texto='Sistemas de Informacion'
                icono='desktop'
            />
            <DrawerListItem
                size='lg'
                link='/app/admin/importaciones/dashboard'
                texto='Importaciones'
                icono='exchange-alt'
            />
            <DrawerListItem
                size='lg'
                link='/app/admin/items/dashboard'
                texto='Items'
                icono='conveyor-belt'
            />
            <DrawerListItem
                size='lg'
                link='/app/admin/geografia/list'
                texto='Geografia'
                icono='map'
            />
            <DrawerListItem
                size='lg'
                link='/app/admin/listas_precios/dashboard'
                texto='Listas Precios'
                icono='map'
            />
        </Fragment>
    )
});
export default MenuAdmin;