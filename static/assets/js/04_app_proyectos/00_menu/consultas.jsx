import React from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuConsultas = () => (
    <ListCollapse icono='search' texto='Consultas'>
        <DrawerListItem
            size='1x'
            link='/app/proyectos/items/list'
            texto='Items CGUno'
            type='main'
        />
        <DrawerListItem
            size='1x'
            link='/app/proyectos/consecutivo/list'
            texto='Consecutivo Proyectos'
            type='main'
        />
        <DrawerListItem
            size='1x'
            link='/app/proyectos/proyectos/reporte_costos'
            texto='Reporte Costos Proyectos 1'
            type='main'
        />
        <DrawerListItem
            size='1x'
            link='/app/proyectos/proyectos/reporte_dos'
            texto='Reporte Costos Proyectos 2'
            type='main'
        />
        <DrawerListItem
            size='1x'
            link='/app/proyectos/proyectos/reporte_tres'
            texto='Reporte Costos Proyectos 3'
            type='main'
        />

    </ListCollapse>
);


export default MenuConsultas;