import React, {Fragment} from 'react';
import {tengoPermiso} from '../../00_utilities/common';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import {
    PERMISO_LIST_USER,
    PERMISO_LIST_PERMISSION,
    PERMISO_LIST_GROUP
} from '../../00_utilities/permisos/types';
import MenuTerceros from './00_maestras';
import MenuPermisos from './01_mano_obra';

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                const listar_usuarios = tengoPermiso(mis_permisos, [PERMISO_LIST_USER]);
                const menu_terceros = listar_usuarios;
                const listar_permisos = tengoPermiso(mis_permisos, [PERMISO_LIST_PERMISSION]);
                const listar_groups = tengoPermiso(mis_permisos, [PERMISO_LIST_GROUP]);
                const menu_permisos = listar_permisos || listar_groups;
                return (
                    <Fragment>
                        {
                            menu_terceros &&
                            <li className="nav-item">
                                <MenuTerceros listar_usuarios={listar_usuarios}/>
                            </li>
                        }
                        {
                            menu_permisos &&
                            <li className="nav-item">
                                <MenuPermisos
                                    listar_permisos={listar_permisos}
                                    listar_groups={listar_groups}
                                />
                            </li>
                        }
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;