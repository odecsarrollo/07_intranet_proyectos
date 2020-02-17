import React, {memo} from 'react';
import DrawerListItem from './../../00_utilities/components/ui/drawer/drawer_list_item';
import ListCollapse from './../../00_utilities/components/ui/drawer/drawer_list_collapse';

const MenuTerceros = memo(props => {
    const {permisos_menu} = props;
    const {
        admin_terceros_usuarios,
        admin_terceros_costos_nomina,
        admin_terceros_clientes,
        admin_terceros_colaboradores,
    } = permisos_menu;
    return (
        (
            admin_terceros_usuarios ||
            admin_terceros_costos_nomina ||
            admin_terceros_clientes ||
            admin_terceros_colaboradores
        ) &&
        <ListCollapse icono='users' texto='Terceros'>
            {admin_terceros_usuarios &&
            <DrawerListItem
                size='1x'
                link='/app/admin/usuarios/list'
                texto='Usuarios'
                icono='user'
                type='nested'
            />}
            {admin_terceros_colaboradores &&
            <DrawerListItem
                size='1x'
                link='/app/admin/colaboradores/dashboard'
                texto='Colaboradores'
                icono='user-hard-hat'
                type='nested'
            />}
            {admin_terceros_clientes &&
            <DrawerListItem
                size='1x'
                link='/app/admin/clientes/clientes/dashboard'
                texto='Clientes'
                icono='suitcase'
                type='nested'
            />}
            {admin_terceros_costos_nomina &&
            <DrawerListItem
                size='1x'
                link='/app/admin/colaboradores/costos_nomina/list'
                texto='Costos Nómina'
                icono='money-bill-alt'
                type='nested'
            />}
            {admin_terceros_usuarios &&
            <DrawerListItem
                size='1x'
                link='/app/admin/colaboradoresn/dashboard'
                texto='Pruebas'
                icono='user'
                type='nested'
            />}
        </ListCollapse>
    )
});


export default MenuTerceros;