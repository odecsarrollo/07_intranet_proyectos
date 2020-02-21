import React, {Fragment, useState} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_VENTAS_PROYECTOS_PERMISSIONS} from "../../permisos";
import DialogListaPrecio from "../../10_app_ventas_componentes/lista_precios/DialogListaPrecios";

const Menu = () => {
    const permisos_menu = useTengoPermisos(MENU_VENTAS_PROYECTOS_PERMISSIONS);
    const [mostrar_lista_precios, setMostrarListaPrecios] = useState(false);
    const {
        menu_ventas_proyectos_configuraciones = false,
        menu_ventas_proyectos_resumen_tuberia_ventas = false,
        menu_ventas_proyectos_cotizaciones = false,
        menu_ventas_proyectos_clientes = false,
    } = permisos_menu;
    return (<Fragment>
        <DrawerListItem
            size='lg'
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
        <DrawerListItem
            size='lg'
            onClick={() => setMostrarListaPrecios(true)}
            texto='Lista Precios'
            icono='barcode'
        />
        <DialogListaPrecio
            con_costos={true}
            con_precios={false}
            con_bandas={true}
            con_componentes={false}
            con_articulos_venta_catalogo={false}
            is_open={mostrar_lista_precios}
            handleCloseModal={() => setMostrarListaPrecios(false)}
        />
    </Fragment>)
};

export default Menu;