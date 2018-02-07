import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

const MenuMaestras = (props) => {
    const {can_list_productos} = props;
    return (
        <IconMenu iconButtonElement={<IconButton><FontIcon className="fas fa-wrench"/></IconButton>
        }>
            <MenuItem primaryText="Hojas de Trabajo"
                      containerElement={<Link to="/app/mano_obra/hojas_trabajo/list"/>}/>
        </IconMenu>
    )
};

export default MenuMaestras;