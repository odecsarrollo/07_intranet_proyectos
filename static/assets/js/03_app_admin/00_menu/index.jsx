import React, {Fragment} from 'react';
import MenuTerceros from './terceros';
import MenuPermisos from './permisos';
import MenuConfiguraciones from './configuraciones';

const Menu = () => <Fragment>
    <MenuTerceros/>
    <MenuPermisos/>
    <MenuConfiguraciones/>
</Fragment>;
export default Menu;