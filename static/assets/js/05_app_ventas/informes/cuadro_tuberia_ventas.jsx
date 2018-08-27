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
        const cargarCotizaciones = () => this.props.fetchCotizacionesTuberiaVentasResumen(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCotizaciones, notificarErrorAjaxAction)

    }

    render() {
        const orden_estados = {
            'Cita/Generación Interés': {id: 1, nombre: 'Cita/Generación Interés'},
            'Configurando Propuesta': {id: 2, nombre: 'Configurando Propuesta'},
            'Cotización Enviada': {id: 3, nombre: 'Cotización Enviada'},
            'Evaluación Técnica y Económica': {id: 4, nombre: 'Evaluación Técnica y Económica'},
            'Aceptación de Terminos y Condiciones': {id: 5, nombre: 'Aceptación de Terminos y Condiciones'},
            'Cierre (Aprobado)': {id: 6, nombre: 'Cierre (Aprobado)'},
        };
        const cotizaciones = _.map(this.props.object_list, e => {
            return {...e, orden: orden_estados[e.estado] ? orden_estados[e.estado].id : 0}
        });
        const responsables = _.uniq(_.map(this.props.object_list, e => e.responsable_actual));
        const cotizaciones_por_responsable = _.map(responsables, e => {
            const por_responsable = _.pickBy(cotizaciones, s => s.responsable_actual === e);
            return {responsable: e, cotizaciones: _.countBy(por_responsable, 'orden')}
        });
        return (
            <Fragment>
                <div>Informe</div>
                <table className='table table-responsive'>
                    <thead>
                    <tr>
                        <th>Responsable</th>
                        {_.map(orden_estados, e => <th key={e.id}>{e.nombre}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(cotizaciones_por_responsable, c => {
                        return <tr key={c.responsable}>
                            <td>{c.responsable}</td>
                            <td>{c.cotizaciones[1]}</td>
                            <td>{c.cotizaciones[2]}</td>
                            <td>{c.cotizaciones[3]}</td>
                            <td>{c.cotizaciones[4]}</td>
                            <td>{c.cotizaciones[5]}</td>
                            <td>{c.cotizaciones[6]}</td>
                        </tr>
                    })}
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
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