import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

const MenuMaestras = () => (
    <IconMenu iconButtonElement={<IconButton><FontIcon className="fas fa-puzzle-piece"/></IconButton>
    }>
        <MenuItem primaryText="Proyectos" containerElement={<Link to="/app/maestras/proyectos/proyectos/list"/>}/>
    </IconMenu>
);

export default MenuMaestras;