import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import ConfiguracionCostosForm from '../components/forms/CostoDashboardForm'


class ConfiguracionCostosDashboard extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchConfiguracionesCostos()
    }

    onSubmit(values) {
        const {
            configuracion_costos
        } = this.props;
        if (configuracion_costos) {
            this.props.updateConfiguracionCosto(configuracion_costos.id, values)
        } else {
            this.props.createConfiguracionCosto(values)
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