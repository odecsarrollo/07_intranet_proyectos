import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuManoObra = () => (
    <ListCollapse icono='alarm-clock' texto='Mano de Obra'>
        <DrawerListItem
            size='1x'
            link='/app/proyectos/mano_obra/horas_colaborador_proyecto_inicial/list'
            texto='Iniciales Horas de Trabajo'
            type='main'
        />
        <DrawerListItem
            size='1x'
            link='/app/proyectos/mano_obra/hojas_trabajo/list'
            texto='Hojas de Trabajo'
            type='main'
        />
        <DrawerListItem
            size='1x'
            link='/app/proyectos/mano_obra/verificar_horas/list'
            texto='Verifica Horas'
            type='main'
        />
    </ListCollapse>
);

export default MenuManoObra;
