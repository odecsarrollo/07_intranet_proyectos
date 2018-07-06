import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {Link} from 'react-router-dom'


const MenuConsultas = (props) => (
    <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
           aria-haspopup="true" aria-expanded="false">
            <FontIcon className="fas fa-search"/>
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <MenuItem primaryText="Items" containerElement={<Link to='/app/proyectos/items/list'/>}/>
            <MenuItem primaryText="Consecutivo Proyectos" containerElement={<Link to='/app/proyectos/consecutivo/list'/>}/>
            <MenuItem primaryText="Literales no sincronizados" containerElement={<Link to='/app/proyectos/literales_sin_sincronizar/list'/>}/>
            <MenuItem primaryText="Reporte Costos Proyecto 1" containerElement={<Link to='/app/proyectos/proyectos/reporte_costos'/>}/>
            <MenuItem primaryText="Reporte Costos Proyecto 2" containerElement={<Link to='/app/proyectos/proyectos/reporte_dos'/>}/>
            <MenuItem primaryText="Reporte Costos Proyecto 3" containerElement={<Link to='/app/proyectos/proyectos/reporte_tres'/>}/>
        </div>
    </li>
);


export default MenuConsultas;