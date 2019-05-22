import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuConfiguraciones = () => (
    <ListCollapse icono='cogs' texto='Configuraciones'>
        <DrawerListItem
            size='1x'
            link='/app/admin/configuraciones/costos/dashboard'
            texto='Cerrar Costos'
            icono='lock'
            type='nested'
        />
    </ListCollapse>
);

export default MenuConfiguraciones;