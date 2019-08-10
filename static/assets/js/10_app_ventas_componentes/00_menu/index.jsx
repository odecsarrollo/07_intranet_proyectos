import React, {Fragment, memo} from 'react';
import DrawerListItem from '../../00_utilities/components/ui/drawer/drawer_list_item';
import MenuCotizacion from './MenuCotizacion';

const Menu = memo(props => <Fragment>
    <DrawerListItem
        size='lg'
        link='/app/ventas_componentes'
        texto='Principal'
        icono='home'
    />
    <MenuCotizacion/>
</Fragment>);

export default Menu;