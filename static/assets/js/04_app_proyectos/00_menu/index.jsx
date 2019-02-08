import React, {Fragment} from 'react';
import Consultas from './consultas';
import HojasTrabajo from './hojasTrabajos';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = () => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/proyectos'
        texto='Principal'
        icono='home'
    />
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