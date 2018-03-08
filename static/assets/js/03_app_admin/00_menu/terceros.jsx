import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'


const MenuTerceros = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <FontIcon className="fas fa-users"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <MenuItem primaryText="Usuarios" containerElement={<Link to='/app/admin/usuarios/list'/>}
            />

            <MenuItem primaryText="Colaboradores" containerElement={<Link to='/app/admin/colaboradores/dashboard'/>}
            />

        </div>
    </li>
);


export default MenuTerceros;