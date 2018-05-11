import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import {fechaFormatoUno} from "../../../../00_utilities/common";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

import {Link} from 'react-router-dom'

const Tarea = (props) => {
    const {tarea} = props;
    const ahora = moment(new Date());
    const fecha_tarea = moment(tarea.fecha_inicio_tarea);
    const diferencia = fecha_tarea.diff(ahora, "days");
    let diferencia_texto = 'Hoy';
    let style = {color: 'black'};
    if (diferencia === 0) {
        style = {backgroundColor: 'green', color: 'white'};
    } else if (diferencia > 0) {
        diferencia_texto = `En ${diferencia} días`;
    } else {
        diferencia_texto = `Hace ${diferencia * -1} días`;
    }
    return (
        <Link to={`/app/proyectos/cotizaciones/cotizaciones/detail/${tarea.cotizacion}`}>
            <li className="list-group-item" style={style}>
                {fechaFormatoUno(tarea.fecha_inicio_tarea)} - <strong>{tarea.nombre_tarea} </strong> ({diferencia_texto})
            </li>
        </Link>
    )
};

class SeguimientoTareasCotizacionesList extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentWillUnmount() {
        this.props.clearSeguimientosCotizaciones();
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.fetchSeguimientosCotizacionesTareasPendientes(() => noCargando(), notificarErrorAjaxAction);
    }

    componentDidMount() {
        this.cargarDatos()
    }

    render() {
        return (
            <div>
                <h1>Tareas Cotizaciones</h1>
                <ul className="list-group">
                    {_.map(_.orderBy(this.props.tareas_list, ['fecha_inicio_tarea'], ['asc']), t => <Tarea key={t.id}
                                                                                                           tarea={t}/>)}
                </ul>
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </div>
        )
    }

}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        tareas_list: state.cotizaciones_seguimientos,
    }
}

export default connect(mapPropsToState, actions)(SeguimientoTareasCotizacionesList)