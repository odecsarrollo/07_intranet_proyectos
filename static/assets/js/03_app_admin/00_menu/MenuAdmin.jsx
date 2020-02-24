import React, {Fragment, memo} from 'react';
import MenuTerceros from './MenuTerceros';
import MenuPermisos from './MenuPermisos';
import MenuConfiguraciones from './MenuConfiguraciones';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_ADMIN_PERMISSIONS} from "../../permisos";

const MenuAdmin = memo(props => {
    const permisos_menu = useTengoPermisos(MENU_ADMIN_PERMISSIONS);
    const {
        menu_admin_sistemas_informacion = false,
        menu_admin_importaciones = false,
        menu_admin_geografia = false,
        menu_admin_listas_precios = false,
        menu_admin_items = false,
        menu_admin_seguimientos_cargues = false,
    } = permisos_menu;
    return (
        <Fragment>
            <MenuTerceros permisos_menu={permisos_menu}/>
            <MenuPermisos permisos_menu={permisos_menu}/>
            <MenuConfiguraciones permisos_menu={permisos_menu}/>
            {menu_admin_sistemas_informacion && <DrawerListItem
                size='lg'
                link='/app/admin/sistemas_informacion/list'
                texto='Sistemas de Informacion'
                icono='desktop'
            />}
            {menu_admin_importaciones && <DrawerListItem
                size='lg'
                link='/app/admin/importaciones/dashboard'
                texto='Importaciones'
                icono='exchange-alt'
            />}
            {menu_admin_items && <DrawerListItem
                size='lg'
                link='/app/admin/items/dashboard'
                texto='Items'
                icono='conveyor-belt'
            />}
            {menu_admin_geografia && <DrawerListItem
                size='lg'
                link='/app/admin/geografia/list'
                texto='Geografia'
                icono='map'
            />}
            {menu_admin_listas_precios && <DrawerListItem
                size='lg'
                link='/app/admin/listas_precios/dashboard'
                texto='Listas Precios'
                icono='map'
            />}
            {menu_admin_seguimientos_cargues && <DrawerListItem
                size='lg'
                link='/app/admin/seguimientos_cargues/list'
                texto='Seguimiento Cargues'
                icono='search'
            />}
            <DrawerListItem
                size='lg'
                link='/app/admin/sistemas_informacion/facturas/list'
                texto='Facturas'
                icono='search'
            />
        </Fragment>
    )
});
export default MenuAdmin;