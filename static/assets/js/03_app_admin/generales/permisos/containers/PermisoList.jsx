import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import Typography from '@material-ui/core/Typography';
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {permisosAdapterDos} from "../../../../00_utilities/common";
import {
    PERMISSION as permisos_view
} from '../../../../permisos';


import {Tabla} from '../components/PermisoTabla';

class PermisosList extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.updatePermiso = this.updatePermiso.bind(this);
        this.notificar = this.notificar.bind(this);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearPermisos()
    }

    cargarDatos() {
        this.props.fetchPermisos();
    }

    updatePermiso(permiso) {
        const callback = () => {
            this.notificar(`Se ha actualizado con éxito el permiso ${permiso.codename}`)
        };
        this.props.updatePermiso(permiso.id, permiso, {callback})
    }


    render() {
        const {permisos, mis_permisos} = this.props;
        const permisos_this_view = permisosAdapterDos(mis_permisos, permisos_view);

        return (
            <ValidarPermisos
                can_see={permisos_this_view.list}
                nombre='listas de permisos'
            >
                <Typography variant="h5" gutterBottom color="primary">
                    Lista de Permisos
                </Typography>
                <Tabla
                    permisos={permisos}
                    updatePermiso={this.updatePermiso}
                    can_change={permisos_this_view.change_plus}/>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        permisos: state.permisos
    }
}

export default connect(mapPropsToState, actions)(PermisosList)