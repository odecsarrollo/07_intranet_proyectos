import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuManoObra = ({permisos_menu}) => {
    const {
        menu_proyectos_mano_obra_verificar_horas = false,
        menu_proyectos_mano_obra_hojas_trabajo = false,
        menu_proyectos_mano_obra_horas_hojas_trabajo = false,
    } = permisos_menu;
    return (
        (menu_proyectos_mano_obra_verificar_horas ||
            menu_proyectos_mano_obra_hojas_trabajo ||
            menu_proyectos_mano_obra_horas_hojas_trabajo) &&
        <ListCollapse icono='alarm-clock' texto='Mano de Obra'>
            {menu_proyectos_mano_obra_horas_hojas_trabajo && <DrawerListItem
                size='1x'
                link='/app/proyectos/mano_obra/horas_hojas_trabajo/list'
                texto='Horas Hojas de Trabajo'
                type='main'
            />}
            {menu_proyectos_mano_obra_hojas_trabajo && <DrawerListItem
                size='1x'
                link='/app/proyectos/mano_obra/hojas_trabajo/list'
                texto='Hojas de Trabajo'
                type='main'
            />}
            {menu_proyectos_mano_obra_verificar_horas && <DrawerListItem
                size='1x'
                link='/app/proyectos/mano_obra/verificar_horas/list'
                texto='Verifica Horas'
                type='main'
            />}
        </ListCollapse>
    )

};

export default MenuManoObra;
