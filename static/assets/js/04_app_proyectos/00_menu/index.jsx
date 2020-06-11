import React, {Fragment} from 'react';
import MenuConsultas from './consultas';
import MenuManoObra from './manoObra';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {MENU_PROYECTOS_PERMISSIONS} from "../../permisos";

const Menu = () => {
    const permisos_menu = useTengoPermisos(MENU_PROYECTOS_PERMISSIONS);
    const {
        menu_proyectos_fases = false,
        menu_proyectos_proyectos = false,
    } = permisos_menu;
    return (<Fragment>
        <DrawerListItem
            size='lg'
            link='/app/proyectos'
            texto='Principal'
            icono='home'
        />
        <MenuManoObra permisos_menu={permisos_menu}/>
        <MenuConsultas permisos_menu={permisos_menu}/>
        {/*{menu_proyectos_proyectos && <DrawerListItem*/}
        {/*    size='lg'*/}
        {/*    link='/app/proyectos/proyectos/list'*/}
        {/*    texto='Proyectos'*/}
        {/*    icono='wrench'*/}
        {/*/>}*/}
        {menu_proyectos_fases && <DrawerListItem
            size='lg'
            link='/app/proyectos/fases/list'
            texto='Fases Proyecto'
            icono='project-diagram'
        />}
    </Fragment>)
};

export default Menu;