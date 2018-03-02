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
        <IconMenu iconButtonElement={<IconButton><FontIcon className="fas fa-puzzle-piece"/></IconButton>
        }>
            {
                can_list_productos &&
                <MenuItem primaryText="Proyectos"
                          containerElement={<Link to="/app/maestras/proyectos/proyectos/list"/>}/>
            }
            <MenuItem primaryText="Mano Obra"
                      containerElement={<Link to="/app/maestras/mano_obra/tasas/list"/>}/>
            <MenuItem primaryText="Consulta Item CGUNO"
                      containerElement={<Link to="/app/maestras/cguno/item_cguno/list"/>}/>
            <MenuItem primaryText="Colaboradores"
                      containerElement={<Link to="/app/maestras/cguno/colaboradores/list"/>}/>
        </IconMenu>
    )
};

export default MenuMaestras;