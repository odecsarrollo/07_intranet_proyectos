import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import FormReporte from '../components/forms/reporte_2_form'

class ReporteCosto extends Component {
    imprimirCostos(id_proyecto, valores) {
        const callback = (response) => {
            const url = window.URL.createObjectURL(new Blob([response], {type: 'application/pdf'}));
            //PrinJs(url);
            window.open(url, "_blank");
        };
        this.props.printReporteCostoDosProyecto(valores, {callback})
    }

    render() {
        return (
            <div>
                <FormReporte onSubmit={(v) => {
                    this.imprimirCostos(v.id_proyecto, v)
                }}/>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.proyectos,
        clientes_list: state.clientes,
        cotizaciones_list: state.cotizaciones
    }
}

export default connect(mapPropsToState, actions)(ReporteCosto)