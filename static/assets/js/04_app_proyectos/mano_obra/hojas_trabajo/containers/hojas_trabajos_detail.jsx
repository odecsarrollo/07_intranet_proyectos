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
        const cargarHojaTrabajo = () => this.props.fetchHojaTrabajo(id);
        const cargarMiCuenta = () => this.props.fetchMiCuenta({callback: cargarHojaTrabajo});
        const cargarConfigCostos = () => this.props.fetchConfiguracionesCostos({callback:cargarMiCuenta});
        this.props.fetchMisPermisos({callback: cargarConfigCostos});

    }

    render() {
        const {object, mis_permisos, configuracion_costos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_horas = permisosAdapter(mis_permisos, permisos_view_horas);

        const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;
        const fecha_registro = object ? object.fecha : null;
        const puede_modificar = fecha_cierre && fecha_registro ? object.fecha > fecha_cierre : true;


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
                    permisos_object={{
                        ...permisos_horas,
                        add: permisos_horas.add && puede_modificar,
                        delete: permisos_horas.delete && puede_modificar
                    }}
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
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0],
    }
}

export default connect(mapPropsToState, actions)(Detail)