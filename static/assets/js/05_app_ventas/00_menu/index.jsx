import React, {Fragment} from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import {Link} from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon';

const iconStyles = {
    padding: 8,
};

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                return (
                    <Fragment>
                        <Link to='/app/ventas'>
                            <FontIcon className="fas fa-home" style={iconStyles}/>
                        </Link>
                        <Link to='/app/ventas/cotizaciones/cotizaciones/list'>
                            <FontIcon className="fas fa-book" style={iconStyles}/>
                        </Link>
                    </Fragment>
                )
            }}
        </MenuBase>
    )
};

export default Menu;