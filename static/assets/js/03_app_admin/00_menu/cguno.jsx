import React, {Fragment} from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'


const MenuCguno = (props) => (

    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <FontIcon className="fas fa-wrench"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <MenuItem
                primaryText="Proyectos"
                containerElement={<Link to='/app/admin/cguno/proyectos/list'/>}
            />
        </div>
    </li>

);
export default MenuCguno;
