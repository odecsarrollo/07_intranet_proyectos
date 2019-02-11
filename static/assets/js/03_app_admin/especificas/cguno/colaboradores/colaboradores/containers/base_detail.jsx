import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import {
    COLABORADORES as permisos_view
} from "../../../../../../00_utilities/permisos/types";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradores()
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarColaborador = () => this.props.fetchColaborador(id);
        this.props.tengoMisPermisosxListado([permisos_view],{callback: cargarColaborador});

    }

    render() {
        const {object, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de colaborador'>
                <Titulo>Detalle {object.nombres} {object.apellidos}</Titulo>
                <div className="row">
                    LOS COMPONENTES
                </div>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        object: state.colaboradores[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)