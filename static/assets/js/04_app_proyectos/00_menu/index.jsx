import React, {Fragment} from 'react';
import MenuConsultas from './consultas';
import MenuManoObra from './manoObra';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/proyectos'
        texto='Principal'
        icono='home'
    />
    <MenuManoObra/>
    <MenuConsultas/>
    <DrawerListItem
        size='lg'
        link='/app/proyectos/proyectos/list'
        texto='Proyectos'
        icono='wrench'
    />
    <DrawerListItem
        size='lg'
        link='/app/proyectos/fases/list'
        texto='Fases Proyecto'
        icono='project-diagram'
    />
</Fragment>;

export default Menu;