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
        const {
            fetchConfiguracionesCostos,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchConfiguracionesCostos(() => noCargando(), notificarErrorAjaxAction)
    }

    onSubmit(values) {
        const {
            updateConfiguracionCosto,
            createConfiguracionCosto,
            configuracion_costos,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        if (configuracion_costos) {
            updateConfiguracionCosto(configuracion_costos.id, values, () => noCargando(), notificarErrorAjaxAction)
        } else {
            createConfiguracionCosto(values, () => noCargando(), notificarErrorAjaxAction)
        }
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
    return {
        mis_permisos: state.mis_permisos,
        contactos: state.clientes_contactos,
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0]
    }
}

export default connect(mapPropsToState, actions)(ConfiguracionCostosDashboard)