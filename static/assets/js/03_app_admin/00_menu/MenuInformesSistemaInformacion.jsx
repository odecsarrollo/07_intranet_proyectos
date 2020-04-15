import React, {memo} from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuInformesSistemaInformacion = memo(props => {
    const {permisos_menu} = props;
    const {
        menu_admin_facturas = false,
        menu_admin_sistema_informacion_reporte_venta_items = false,
    } = permisos_menu;
    return (
        (
            menu_admin_facturas ||
            menu_admin_sistema_informacion_reporte_venta_items
        ) &&
        <ListCollapse icono='receipt' texto='Info Sistema Información'>
            {
                menu_admin_facturas &&
                <DrawerListItem
                    size='1x'
                    link='/app/admin/sistemas_informacion/reportes/facturas'
                    texto='Facturas'
                    icono='receipt'
                    type='nested'
                />
            }
            {
                menu_admin_sistema_informacion_reporte_venta_items &&
                <DrawerListItem
                    size='1x'
                    link='/app/admin/sistemas_informacion/reportes/ventas_items'
                    texto='Items Vendidos'
                    icono='receipt'
                    type='nested'
                />
            }
        </ListCollapse>
    )
});


export default MenuInformesSistemaInformacion;