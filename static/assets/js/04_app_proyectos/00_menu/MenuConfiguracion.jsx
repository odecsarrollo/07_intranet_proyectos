import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuManoObra = ({permisos_menu}) => {
    const {
        menu_proyectos_configuracion_tipos_equipos = false
    } = permisos_menu;
    return (
        (menu_proyectos_configuracion_tipos_equipos) && <ListCollapse icono='cogs' texto='Configuración'>
            {menu_proyectos_configuracion_tipos_equipos && <DrawerListItem
                size='1x'
                link='/app/proyectos/configuracion/tipos_equipos'
                texto='Tipos Equipos'
                type='main'
            />}
        </ListCollapse>
    )

};

export default MenuManoObra;
