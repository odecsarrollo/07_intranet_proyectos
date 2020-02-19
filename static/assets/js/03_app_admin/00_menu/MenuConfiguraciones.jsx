import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuConfiguraciones = (props) => {
    const {permisos_menu} = props;
    const {
        menu_admin_configuracion_costos
    } = permisos_menu;

    return (
        menu_admin_configuracion_costos && <ListCollapse icono='cogs' texto='Configuraciones'>
            <DrawerListItem
                size='1x'
                link='/app/admin/configuraciones/costos/dashboard'
                texto='Cerrar Costos'
                icono='lock'
                type='nested'
            />
        </ListCollapse>
    )

};

export default MenuConfiguraciones;