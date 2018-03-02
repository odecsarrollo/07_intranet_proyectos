import React, {Fragment} from 'react';
import {tengoPermiso} from '../../00_utilities/common';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import MenuTerceros from './terceros';
import MenuPermisos from './permisos';
import MenuCGuno from './cguno';

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                return (
                    <Fragment>
                        <MenuTerceros/>
                        <MenuPermisos/>
                        <MenuCGuno/>
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;