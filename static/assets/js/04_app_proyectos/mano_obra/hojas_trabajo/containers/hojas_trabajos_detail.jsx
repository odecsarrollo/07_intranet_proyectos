import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapterDos, fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import {
    MANOS_OBRAS_HOJAS_TRABAJOS as permisos_view,
    MANOS_OBRAS_HORAS_HOJAS_TRABAJOS as permisos_view_horas
} from "../../../../00_utilities/permisos/types";
import CreateForm from '../components/forms/hora_hoja_trabajo_form';
import Tabla from '../components/horas_hojas_trabajos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';

const CRUDHorasHojasTrabajoList = crudHOC(CreateForm, Tabla);

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.createHoraTrabajo = this.createHoraTrabajo.bind(this);
        this.updateHoraTrabajo = this.updateHoraTrabajo.bind(this);
        this.deleteHoraTrabajo = this.deleteHoraTrabajo.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view,
                permisos_view_horas
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearHojasTrabajos();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarHojaTrabajo = () => this.props.fetchHojaTrabajo(id);
        const cargarMiCuenta = () => this.props.fetchMiCuenta({callback: cargarHojaTrabajo});
        this.props.fetchConfiguracionesCostos({callback: cargarMiCuenta});

    }

    createHoraTrabajo(item) {
        const cargarHojaTrabajo = (r) => this.props.fetchHojaTrabajo(r.hoja);
        this.props.createHoraHojaTrabajo(item, {callback: cargarHojaTrabajo});
    }

    updateHoraTrabajo(item) {
        const cargarHojaTrabajo = (r) => this.props.fetchHojaTrabajo(r.hoja);
        this.props.updateHoraHojaTrabajo(item.id, item, {callback: cargarHojaTrabajo});
    }

    deleteHoraTrabajo(item) {
        const {id} = this.props.match.params;
        const cargarHojaTrabajo = () => this.props.fetchHojaTrabajo(id);
        this.props.deleteHoraHojaTrabajo(item, {callback: cargarHojaTrabajo});
    }

    render() {
        const {object, configuracion_costos, mis_permisos} = this.props;
        const permisos = permisosAdapterDos(mis_permisos, permisos_view);
        const permisos_horas = permisosAdapterDos(mis_permisos, permisos_view_horas);

        const fecha_cierre = configuracion_costos ? configuracion_costos.fecha_cierre : null;
        const fecha_registro = object ? object.fecha : null;
        const puede_modificar = fecha_cierre && fecha_registro ? object.fecha > fecha_cierre : true;
        const {id} = this.props.match.params;

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

        const horas_trabajo_crud_method_pool = {
            fetchObjectMethod: this.props.fetchHoraHojaTrabajo,
            deleteObjectMethod: this.props.deleteHoraHojaTrabajo,
            createObjectMethod: this.props.createHoraHojaTrabajo,
            updateObjectMethod: this.props.updateHoraHojaTrabajo
        };

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
                <CRUDHorasHojasTrabajoList
                    posCreateMethod={(r) => this.props.fetchHojaTrabajo(r.hoja)}
                    posUpdateMethod={(r) => this.props.fetchHojaTrabajo(r.hoja)}
                    posDeleteMethod={() => this.props.fetchHojaTrabajo(id)}
                    method_pool={horas_trabajo_crud_method_pool}
                    list={_.mapKeys(mis_horas_trabajadas,'id')}
                    permisos_object={{
                        ...permisos_horas,
                        add: permisos_horas.add && puede_modificar,
                        delete: permisos_horas.delete && puede_modificar
                    }}
                    permisos_hoja={permisos}
                    hoja_trabajo={object}
                    plural_name='Horas Hojas de Trabajo'
                    singular_name='Hora Hoja de Trabajo'
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
        object: state.hojas_trabajos_diarios[id],
        literales_list: state.literales,
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0],
    }
}

export default connect(mapPropsToState, actions)(Detail)