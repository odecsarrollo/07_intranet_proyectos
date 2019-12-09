import React, {Fragment} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_VENTAS_PROYECTOS_PERMISSIONS} from "../../permisos";

const Menu = () => {
    const permisos_menu = useTengoPermisos(MENU_VENTAS_PROYECTOS_PERMISSIONS);
    const {
        menu_ventas_proyectos_configuraciones = false,
        menu_ventas_proyectos_resumen_tuberia_ventas = false,
        menu_ventas_proyectos_cotizaciones = false,
        menu_ventas_proyectos_clientes = false,
    } = permisos_menu;
    return (<Fragment>
        <DrawerListItem
            size='l g'
            link='/app/ventas_proyectos'
            texto='Principal'
            icono='home'
        />
        {menu_ventas_proyectos_clientes && <DrawerListItem
            size='lg'
            link='/app/ventas_proyectos/clientes/clientes/list'
            texto='Clientes'
            icono='user'
        />}
        {menu_ventas_proyectos_cotizaciones && <DrawerListItem
            size='lg'
            link='/app/ventas_proyectos/cotizaciones/cotizaciones/list'
            texto='Cotizaciones'
            icono='book'
        />}
        {menu_ventas_proyectos_resumen_tuberia_ventas && <DrawerListItem
            size='lg'
            link='/app/ventas_proyectos/informes/cuadro_tuberia_ventas'
            texto='Tubería de Ventas'
            icono='file'
        />}
        {menu_ventas_proyectos_configuraciones && <DrawerListItem
            size='lg'
            link='/app/ventas_proyectos/configuracion/dashboard'
            texto='Configuraciones'
            icono='wrench'
        />}
    </Fragment>)
};

export default Menu;