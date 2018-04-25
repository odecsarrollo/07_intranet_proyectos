import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter, fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import {
    MANOS_OBRAS_HOJAS_TRABAJOS as permisos_view,
    MANOS_OBRAS_HORAS_HOJAS_TRABAJOS as permisos_view_horas
} from "../../../../00_utilities/permisos/types";

import HorasHojasTrabajoList from '../components/horas_hoja_trabajo_list';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearHojasTrabajos();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarHojaTrabajo = () => this.props.fetchHojaTrabajo(id, () => noCargando(), notificarErrorAjaxAction);
        const cargarMiCuenta = () => this.props.fetchMiCuenta(cargarHojaTrabajo, this.error_callback);
        this.props.fetchMisPermisos(cargarMiCuenta, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos, mi_cuenta} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_horas = permisosAdapter(mis_permisos, permisos_view_horas);


        if (!object) {
            return <SinObjeto/>
        }

        const {
            colaborador_nombre,
            fecha,
            tasa_valor_hora,
            costo_total,
            mis_horas_trabajadas,
        } = object;

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de hoja de trabajo'>
                <Titulo>Detalle {object.username}</Titulo>
                <div className="row">
                    <div className="col-md-6">
                        <strong>Colaborador: </strong>{colaborador_nombre}
                    </div>
                    <div className="col-md-6">
                        <strong>Fecha: </strong>{fechaFormatoUno(fecha)}
                    </div>
                    {
                        permisos.costos &&
                        <Fragment>
                            <div className="col-md-6">
                                <strong>Valor Hora: </strong>{pesosColombianos(tasa_valor_hora)}
                            </div>
                            < div className="col-md-6">
                                <strong>Costo Total: </strong>{pesosColombianos(costo_total)}
                            </div>
                        </Fragment>
                    }
                </div>
                <HorasHojasTrabajoList
                    object_list={mis_horas_trabajadas}
                    permisos_object={permisos_horas}
                    permisos_hoja={permisos}
                    hoja_trabajo={object}
                    {...this.props}
                />
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        proyectos_list: state.proyectos,
        mi_cuenta: state.mi_cuenta,
        object: state.hojas_trabajos_diarios[id],
        literales_list: state.literales,
    }
}

export default connect(mapPropsToState, actions)(Detail)