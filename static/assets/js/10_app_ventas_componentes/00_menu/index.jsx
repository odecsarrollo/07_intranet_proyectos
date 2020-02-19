import React, {Fragment, useState} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_VENTAS_COMPONENTES_PERMISSIONS} from "../../permisos";
import DialogListaPrecio from "../lista_precios/DialogListaPrecios";

const Menu = () => {
    const permisos_menu = useTengoPermisos(MENU_VENTAS_COMPONENTES_PERMISSIONS);
    const [mostrar_lista_precios, setMostrarListaPrecios] = useState(false);
    const {
        menu_ventas_componentes_cotizaciones = false,
        menu_ventas_componentes_clientes = false
    } = permisos_menu;
    return (<Fragment>
        {menu_ventas_componentes_cotizaciones && <DrawerListItem
            size='lg'
            link='/app/ventas_componentes/clientes/clientes/list'
            texto='Clientes'
            icono='user'
        />}
        {menu_ventas_componentes_clientes && <DrawerListItem
            size='lg'
            link='/app/ventas_componentes/cotizaciones/list'
            texto='Cotizaciones'
            icono='book'
        />}
        <DrawerListItem
            size='lg'
            link='/app/ventas_componentes'
            texto='Principal'
            icono='home'
        />
        <DrawerListItem
            size='lg'
            onClick={() => setMostrarListaPrecios(true)}
            texto='Lista Precios'
            icono='barcode'
        />
        {mostrar_lista_precios && <DialogListaPrecio
            is_open={mostrar_lista_precios}
            handleCloseModal={() => setMostrarListaPrecios(false)}
        />}
    </Fragment>)
};

export default Menu;