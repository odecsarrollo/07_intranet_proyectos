import React, {Component, Fragment} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import {fechaFormatoUno} from "../../../../00_utilities/common";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

import {
    CLIENTES as permisos_view,
    COTIZACIONES as permisos_cotizaciones_view
} from "../../../../00_utilities/permisos/types";
import {permisosAdapter} from "../../../../00_utilities/common";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {Link} from 'react-router-dom'

const Tarea = (props) => {
    const {fecha, nombre, link_to, cliente_nombre, icono} = props;
    const ahora = moment(new Date());
    const fecha_tarea = moment(fecha);
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
    style = {...style, padding: '1rem', margin: 0, fontSize: '0.8rem'};
    return (
        <Link to={link_to}>
            <li className="list-group-item" style={style}>
                <FontAwesomeIcon
                    icon={icono}
                /><strong>{nombre}</strong><br/>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <small>Fecha: <strong>{fechaFormatoUno(fecha)} ({diferencia_texto})</strong></small>
                    </div>
                    {
                        cliente_nombre &&
                        <div className="col-12 col-md-6">
                            <small>Cliente: <strong>{cliente_nombre}</strong></small>
                        </div>
                    }
                </div>
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
        this.props.clearCotizaciones();
    }

    cargarDatos() {
        const cargarCotizacionesAgendadas = () => this.props.fetchCotizacionesAgendadas();
        this.props.fetchSeguimientosCotizacionesTareasPendientes({callback: cargarCotizacionesAgendadas});
    }

    componentDidMount() {
        this.cargarDatos()
    }

    render() {
        const {tareas_list, cotizaciones_agendas_list, mis_permisos} = this.props;
        const permisos_cotizaciones = permisosAdapter(permisos_cotizaciones_view);

        const listado_tareas = _.map(tareas_list, t => {
            return {
                fecha: t.fecha_inicio_tarea,
                nombre: t.nombre_tarea,
                cotizacion: t.cotizacion,
                cliente_nombre: t.cliente_nombre,
                icono: 'tasks',
                key: `t-${t.cotizacion}-${t.id}`
            }
        });

        const listado_cotizaciones_agendadas = _.map(cotizaciones_agendas_list, c => {
            return {
                fecha: c.fecha_entrega_pactada_cotizacion,
                nombre: c.descripcion_cotizacion,
                cotizacion: c.id,
                cliente_nombre: c.cliente_nombre,
                icono: 'money-bill-alt',
                key: `c-${c.id}`
            }
        });
        const listado_completo = _.orderBy([...listado_tareas, ...listado_cotizaciones_agendadas], ['fecha'], ['asc']);
        return (
            <div>
                {
                    listado_completo.length > 0 &&
                    permisos_cotizaciones.gestionar_cotizacion &&
                    <Fragment>
                        <h1>Tareas Cotizaciones</h1>
                        <ul className="list-group">
                            {listado_completo.map(t => {
                                return (
                                    <Tarea
                                        key={t.key}
                                        fecha={t.fecha}
                                        nombre={t.nombre}
                                        icono={t.icono}
                                        cliente_nombre={t.cliente_nombre}
                                        link_to={`/app/proyectos/cotizaciones/cotizaciones/detail/${t.cotizacion}`}
                                    />
                                )
                            })}
                        </ul>
                    </Fragment>

                }
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
        cotizaciones_agendas_list: state.cotizaciones,
    }
}

export default connect(mapPropsToState, actions)(SeguimientoTareasCotizacionesList)