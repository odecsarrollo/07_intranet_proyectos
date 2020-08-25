import React, {memo} from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuConsulta = memo(props => {
    const {permisos_menu} = props;
    const {
        menu_gerencia_informe_ventas = false,
        menu_gerencia_informe_acuerdo_pagos_valores = false,
    } = permisos_menu;
    return (
        (
            menu_gerencia_informe_ventas ||
            menu_gerencia_informe_acuerdo_pagos_valores
        ) &&
        <ListCollapse icono='receipt' texto='Info Sistema Información'>
            {menu_gerencia_informe_ventas &&
                <DrawerListItem
                    size='1x'
                    link='/app/gerencia/ventas'
                    texto='Informe Ventas'
                    icono='receipt'
                    type='nested'
                />
            }
            {menu_gerencia_informe_acuerdo_pagos_valores &&
                <DrawerListItem
                    size='1x'
                    link='/app/gerencia/acuerdos_pagos'
                    texto='Informe Acuerdos de Pago'
                    icono='receipt'
                    type='nested'
                />
            }
        </ListCollapse>
    )
});


export default MenuConsulta;