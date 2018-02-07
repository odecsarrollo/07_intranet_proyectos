import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {tengoPermiso} from './../../../01_actions/00_general_fuctions';

import MenuMaestras from './00_maestras';
import MenuManoObra from './01_mano_obra';
import * as actions from "../../../01_actions/01_index";
import {connect} from "react-redux";

const style = {
    display: 'inline-block',
    margin: '16px 32px 16px 0',
};


class Menu extends Component {
    componentDidMount() {
        console.log('entro a cargar el menu')
        this.props.fetchMisPermisos();
    }

    render() {
        return (
            <Toolbar>
                <ToolbarGroup firstChild={true}>
                    <Paper style={style}>
                        <MenuMaestras
                            can_list_productos={tengoPermiso(this.props.mis_permisos, 'list_proyecto')}
                        />
                        <MenuManoObra/>
                    </Paper>
                </ToolbarGroup>
            </Toolbar>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(Menu);