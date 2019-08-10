import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/ventas_proyectos'
        texto='Principal'
        icono='home'
    />
    <DrawerListItem
        size='lg'
        link='/app/ventas_proyectos/clientes/clientes/list'
        texto='Clientes'
        icono='user'
    />
    <DrawerListItem
        size='lg'
        link='/app/ventas_proyectos/cotizaciones/cotizaciones/list'
        texto='Cotizaciones'
        icono='book'
    />
    <DrawerListItem
        size='lg'
        link='/app/ventas_proyectos/informes/cuadro_tuberia_ventas'
        texto='Tubería de Ventas'
        icono='file'
    />
</Fragment>;

export default Menu;