import React, {memo} from 'react';
import ListCollapse from '../../00_utilities/components/ui/drawer/drawer_list_collapse';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const MenuInformes = memo(props => {
    const {permisos_menu} = props;
    const {
        menu_ventas_componentes_informe_ventas_perdidas = false
    } = permisos_menu;
    return (
        (
            menu_ventas_componentes_informe_ventas_perdidas
        ) &&
        <ListCollapse icono='search' texto='Informes'>
            {
                menu_ventas_componentes_informe_ventas_perdidas &&
                <DrawerListItem
                    size='1x'
                    link='/app/ventas_componentes/informes/ventas_perdidas'
                    texto='Ventas Perdidas'
                    icono='receipt'
                    type='nested'
                />
            }
        </ListCollapse>
    )
});


export default MenuInformes;