import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuTerceros = (props) => (
    <ListCollapse icono='users' texto='Terceros'>
        <DrawerListItem
            size='1x'
            link='/app/admin/usuarios/list'
            texto='Usuarios'
            icono='user'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/colaboradores/dashboard'
            texto='Colaboradores'
            icono='user-hard-hat'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/clientes/clientes/dashboard'
            texto='Clientes'
            icono='suitcase'
            type='nested'
        />
        <DrawerListItem
            size='1x'
            link='/app/admin/colaboradores/costos_nomina/list'
            texto='Costos Nómina'
            icono='money-bill-alt'
            type='nested'
        />
    </ListCollapse>
);


export default MenuTerceros;