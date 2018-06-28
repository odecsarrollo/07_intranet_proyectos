import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import ConfiguracionCostosForm from '../components/forms/configuracion_costos_form'


class ConfiguracionCostosDashboard extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const {fetchConfiguracionesCostos} = this.props;
        fetchConfiguracionesCostos()
    }

    onSubmit(values) {
        const {
            updateConfiguracionCosto,
            configuracion_costos,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        updateConfiguracionCosto(configuracion_costos.id, values, () => noCargando(), notificarErrorAjaxAction)
    }

    render() {
        const {configuracion_costos} = this.props;
        return (
            <ConfiguracionCostosForm
                configuracion={configuracion_costos}
                onSubmit={this.onSubmit}
            />
        )
    }
}


function mapPropsToState(state, ownProps) {
    console.log(state.configuracion_costos)
    return {
        mis_permisos: state.mis_permisos,
        contactos: state.clientes_contactos,
        configuracion_costos: state.configuracion_costos[1]
    }
}

export default connect(mapPropsToState, actions)(ConfiguracionCostosDashboard)