import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'


const MenuTerceros = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <FontIcon className="fas fa-alarm-clock"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <MenuItem primaryText="Iniciales Horas de Trabajo"
                      containerElement={<Link to='/app/proyectos/mano_obra/horas_colaborador_proyecto_inicial/list'/>}
            />
            <MenuItem primaryText="Hojas de Trabajo"
                      containerElement={<Link to='/app/proyectos/mano_obra/hojas_trabajo/list'/>}
            />

            <MenuItem primaryText="Verifica Horas"
                      containerElement={<Link to='/app/proyectos/mano_obra/verificar_horas/list'/>}
            />

        </div>
    </li>
);


export default MenuTerceros;