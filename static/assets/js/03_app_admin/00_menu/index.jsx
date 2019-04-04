import React, {Fragment} from 'react';
import MenuTerceros from './terceros';
import MenuPermisos from './permisos';
import MenuConfiguraciones from './configuraciones';
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
        link='/app/admin/geografia/list'
        texto='Geografia'
        icono='map'
    />
</Fragment>;
export default Menu;