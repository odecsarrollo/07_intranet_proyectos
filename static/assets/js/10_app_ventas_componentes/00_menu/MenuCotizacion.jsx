import React, {memo} from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';


const MenuPermisos = memo(props => {
    return (
        <ListCollapse icono='coins' texto='Cotizaciones'>
            <DrawerListItem
                size='1x'
                link='/app/ventas_componentes/cotizaciones/cotizador'
                texto='Cotizaciones'
                type='main'
            />
            <DrawerListItem
                size='1x'
                link='/app/ventas_componentes/cotizaciones/list'
                texto='Cotizador'
                type='main'
            />
        </ListCollapse>
    )
});
export default MenuPermisos;
