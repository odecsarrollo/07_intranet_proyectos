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
            {props.listar_usuarios &&
            <MenuItem primaryText="Usuarios" containerElement={<Link to='/app/admin/usuarios/list'/>}
            />}
        </div>
    </li>
);


export default MenuTerceros;