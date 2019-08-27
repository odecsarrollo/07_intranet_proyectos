import React, {Fragment, memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';

const Menu = memo(props => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/ventas_componentes'
        texto='Principal'
        icono='home'
    />
    <DrawerListItem
        size='lg'
        link='/app/ventas_componentes/cotizaciones/list'
        texto='Cotizaciones'
        icono='coins'
    />
</Fragment>);

export default Menu;