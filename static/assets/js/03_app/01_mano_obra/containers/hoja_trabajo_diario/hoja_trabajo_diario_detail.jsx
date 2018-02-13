import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import CargarDatos from '../../../components/cargar_datos';
import {tengoPermiso} from './../../../../01_actions/00_general_fuctions';
import {pesosColombianos, fechaFormatoUno} from "../../../components/utilidades/common";

import HorasHojaTrabajoDiarioTabla from './../../components/hoja_trabajo_diario/hoja_trabajo_diario_horas_tabla';
import HoraTrabajoDiarioForm from './../../components/hoja_trabajo_diario/hora_hoja_trabajo_diario_form';

import {SinPermisos} from '../../../components/utiles';

class HojaTrabajoDiarioDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false,
            cargando: false
        });
        this.onSubmit = this.onSubmit.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.error_callback = this.error_callback.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearHorasHojasTrabajos()
    }

    onSubmit(values) {
        const {id} = values;
        const callback = (response) => {
            this.props.fetchHoraHojaTrabajo(response.id, () => {
                this.props.fetchHojaTrabajoDiario(this.props.objeto.id, null, this.error_callback);
                this.props.notificarAction(`El registro del tiempo de la op ${response.literal_descripcion}`);
            });
            this.setState({mostrar_form: false, item_seleccionado: null});
        };
        if (id) {
            this.props.updateHoraHojaTrabajo(
                id,
                values,
                callback,
                this.error_callback
            )
        } else {
            this.props.createHoraHojaTrabajo({...values, hoja: this.props.objeto.id}, callback, this.error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        const {item_seleccionado} = this.state;
        const {deleteHoraHojaTrabajo} = this.props;
        deleteHoraHojaTrabajo(id, () => {
                this.props.fetchHojaTrabajoDiario(this.props.objeto.id, null, this.error_callback);
                this.props.notificarAction(`Se ha eliminado el tiempo de la op ${item_seleccionado.literal_descripcion}!`);
            }, this.error_callback
        );
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onSelectItem(item_seleccionado) {
        this.props.fetchHoraHojaTrabajo(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true})
            },
            this.error_callback
        );
    }


    cargarDatos() {
        this.setState({cargando: true});
        const {match: {params: {id}}} = this.props;
        this.props.fetchMisPermisos(
            () => {
                this.props.fetchHojaTrabajoDiario(id,
                    (response) => {
                        this.props.fetchHorasHojasTrabajosxHoja(
                            response.id,
                            () => {
                                this.props.fetchLiteralesAbiertos(
                                    this.setState({cargando: false}),
                                    this.error_callback
                                );
                            },
                            this.error_callback
                        )
                    }
                    , this.error_callback
                );
            },
            this.error_callback
        );

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

        if (!objeto) {
            return (<div>Cargando ...</div>)
        }
        return (
            <SinPermisos
                nombre='detalle de Hoja de Trabajo'
                cargando={this.state.cargando}
                mis_permisos={mis_permisos}
                can_see={tengoPermiso(mis_permisos, 'detail_hojatrabajodiario')}
            >
                <div className="row">
                    <div className="col-12">
                        <h3 className="h3-responsive">Hoja Trabajo Diario: <small>{id}</small></h3>
                    </div>

                    <div className="col-12">
                        <h5 className='h5-response'>{objeto.colaborador_nombre}</h5>
                    </div>
                    <div className="col-12">
                        <h6 className='h6-response'>Fecha: <small>{fechaFormatoUno(objeto.fecha)}</small>
                        </h6>
                    </div>
                    {
                        tengoPermiso(mis_permisos, 'costos_hojatrabajodiario') &&
                        <div className="col-12">
                            <h6 className='h6-response'>Costo
                                Total: <small>{pesosColombianos(objeto.costo_total)}</small>
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
                                        onSubmit={this.onSubmit}
                                        literales_lista={literales}
                                        item_seleccionado={item_seleccionado}
                                        onCancel={this.onCancel}
                                        onDelete={this.onDelete}
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
                                        onSelectItem={this.onSelectItem}
                                        total_minutos={objeto.cantidad_minutos}
                                        costo_total={objeto.costo_total}
                                        tasa_valor={objeto.tasa_valor}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                    <CargarDatos cargarDatos={this.cargarDatos}/>
                </div>
            </SinPermisos>
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