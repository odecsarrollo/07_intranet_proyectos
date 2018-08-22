import React, {Component, Fragment} from 'react';
import * as actions from "../../01_actions/01_index";
import {connect} from "react-redux";
import CargarDatos from "../../00_utilities/components/system/cargar_datos";

class InformeTunelVentas extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearCotizaciones();
    }


    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarCotizaciones = () => this.props.fetchCotizacionesTuberiaVentas(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCotizaciones, notificarErrorAjaxAction)

    }

    render() {
        console.log(this.props.object_list);
        return (
            <Fragment>
                <div>Informe</div>
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.cotizaciones,
    }
}

export default connect(mapPropsToState, actions)(InformeTunelVentas)