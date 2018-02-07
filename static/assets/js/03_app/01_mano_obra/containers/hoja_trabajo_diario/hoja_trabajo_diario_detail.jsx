import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

import CargarDatos from '../../../components/cargar_datos';

import {tengoPermiso} from './../../../../01_actions/00_general_fuctions';
import {formatMoney} from "accounting";

import HorasHojaTrabajoDiarioTabla from './../../components/hoja_trabajo_diario/hoja_trabajo_diario_horas_tabla';
import HoraTrabajoDiarioForm from './../../components/hoja_trabajo_diario/hora_hoja_trabajo_diario_form';

class HojaTrabajoDiarioDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false
        })
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearHorasHojasTrabajos()
    }

    onSubmit(values) {
        const {id} = values;
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const callback = (response) => {
            this.props.fetchHoraHojaTrabajo(response.id, () => {
                this.props.fetchHojaTrabajoDiario(this.props.objeto.id, null, error_callback);
                this.props.notificarAction(`El registro del tiempo de la op ${response.literal_descripcion}`);
            });
            this.setState({mostrar_form: false, item_seleccionado: null});
        };
        if (id) {
            this.props.updateHoraHojaTrabajo(
                id,
                values,
                callback,
                error_callback
            )
        } else {
            this.props.createHoraHojaTrabajo({...values, hoja: this.props.objeto.id}, callback, error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const {item_seleccionado} = this.state;
        const {deleteHoraHojaTrabajo} = this.props;
        deleteHoraHojaTrabajo(id, () => {
                this.props.fetchHojaTrabajoDiario(this.props.objeto.id, null, error_callback);
                this.props.notificarAction(`Se ha eliminado el tiempo de la op ${item_seleccionado.literal_descripcion}!`);
            }, error_callback
        );
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onSelectItem(item_seleccionado) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        this.props.fetchHoraHojaTrabajo(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true})
            },
            error_callback
        );
    }


    cargarDatos() {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };

        this.props.fetchMisPermisos(null, error_callback);
        this.props.fetchLiteralesAbiertos(null, error_callback);

        const {match: {params: {id}}} = this.props;

        this.props.fetchHojaTrabajoDiario(id,
            (response) => {
                this.props.fetchHorasHojasTrabajosxHoja(response.id, null, error_callback)
            }
            , error_callback);
    }

    render() {
        const {
            match: {params: {id}},
            objeto,
            horas_hoja_trabajo,
            mis_permisos,
            literales
        } = this.props;

        const {
            item_seleccionado,
            mostrar_form
        } = this.state;

        if (!tengoPermiso(mis_permisos, 'detail_hojatrabajodiario')) {
            return (<div>Sin permisos suficientes...</div>)
        }

        if (!objeto) {
            return (<div>Cargando ...</div>)
        }
        return (
            <div className="row">
                <div className="col-12">
                    <h3 className="h3-responsive">Hoja Trabajo Diario: <small>{id}</small></h3>
                </div>

                <div className="col-12">
                    <h5 className='h5-response'>{objeto.colaborador_nombre}</h5>
                </div>
                <div className="col-12">
                    <h6 className='h6-response'>Fecha: <small>{moment.tz(objeto.fecha, "America/Bogota").format('MMMM D [de] YYYY')}</small>
                    </h6>
                </div>
                {
                    tengoPermiso(mis_permisos, 'costos_hojatrabajodiario') &&
                    <div className="col-12">
                        <h6 className='h6-response'>Costo
                            Total: <small>{formatMoney(Number(objeto.costo_total), "$", 0, ".", ",")}</small>
                        </h6>
                    </div>
                }
                <div className="col-12">
                    <h6 className='h6-response'>Total
                        Horas: <small>{Number(objeto.cantidad_minutos / 60).toFixed(2)} Horas</small>
                    </h6>
                </div>
                <div className="col-12">
                    <h5 className='h5-responsive'>Horas Trabajadas</h5>
                    <div className="row">
                        <div className="col-12 pl-3">
                            {
                                tengoPermiso(mis_permisos, 'add_horahojatrabajo') &&
                                <button
                                    className="btn btn-primary"
                                    style={{cursor: "pointer"}}
                                    onClick={() => {
                                        this.setState({item_seleccionado: null, mostrar_form: true})
                                    }}
                                >
                                    <i className="fas fa-plus"
                                       aria-hidden="true"></i>
                                </button>
                            }
                        </div>
                        {
                            mostrar_form &&
                            (
                                tengoPermiso(mis_permisos, 'add_horahojatrabajo') ||
                                tengoPermiso(mis_permisos, 'change_horahojatrabajo')
                            ) &&
                            <div className="col-12 pl-3">
                                <HoraTrabajoDiarioForm
                                    onSubmit={this.onSubmit.bind(this)}
                                    literales_lista={literales}
                                    item_seleccionado={item_seleccionado}
                                    onCancel={this.onCancel.bind(this)}
                                    onDelete={this.onDelete.bind(this)}
                                    can_delete={tengoPermiso(mis_permisos, 'delete_horahojatrabajo')}
                                />
                            </div>
                        }
                        {
                            tengoPermiso(mis_permisos, 'list_horahojatrabajo') &&
                            <div className="col-12 pl-3">
                                <HorasHojaTrabajoDiarioTabla
                                    lista={horas_hoja_trabajo}
                                    can_change={tengoPermiso(mis_permisos, 'change_horahojatrabajo')}
                                    can_see_costos={tengoPermiso(mis_permisos, 'costos_hojatrabajodiario')}
                                    item_seleccionado={item_seleccionado}
                                    onSelectItem={this.onSelectItem.bind(this)}
                                    total_minutos={objeto.cantidad_minutos}
                                    costo_total={objeto.costo_total}
                                    tasa_valor={objeto.tasa_valor}
                                />
                            </div>
                        }
                    </div>
                </div>
                <CargarDatos cargarDatos={this.cargarDatos.bind(this)}/>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {match: {params: {id}}} = ownProps;
    return {
        objeto: state.hojas_trabajos_diarios[id],
        mis_permisos: state.mis_permisos,
        horas_hoja_trabajo: state.horas_hoja_trabajo,
        literales: state.literales
    }
}

export default connect(mapPropsToState, actions)(HojaTrabajoDiarioDetail);