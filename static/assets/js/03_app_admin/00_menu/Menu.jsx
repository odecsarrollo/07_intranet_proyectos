import React, {Fragment} from 'react';
import MenuTerceros from './MenuTerceros';
import MenuPermisos from './MenuPermisos';
import MenuConfiguraciones from './MenuConfiguraciones';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => <Fragment>
    <MenuTerceros/>
    <MenuPermisos/>
    <MenuConfiguraciones/>
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
</Fragment>;
export default Menu;