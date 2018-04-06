import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES_COSTOS_MESES as permisos_view
} from "../../../../../../00_utilities/permisos/types";
import {permisosAdapter, REGEX_SOLO_NUMEROS} from "../../../../../../00_utilities/common";
import TextField from 'material-ui/TextField';
import moment from 'moment';

import Tabla from '../components/costos_nomina_tabla';
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {ListaBusqueda} from '../../../../../../00_utilities/utiles';

class List extends Component {
    constructor(props) {
        super(props);
        const date = new Date();
        this.state = ({
            ano: date.getFullYear(),
            ano_error: '',
            mes: date.getMonth() + 1,
            mes_error: ''
        });
        this.cargarDatos = this.cargarDatos.bind(this);
        this.consultarPorFecha = this.consultarPorFecha.bind(this);
        this.updateColaboradorCostoMes = this.updateColaboradorCostoMes.bind(this);
    }

    componentDidMount() {
        const today = moment().format('YYYY-MM-DD');
        const today_manana = moment().add(1, 'day').format('YYYY-MM-DD');
        this.consultarPorFecha(today, today_manana);
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradoresCostosMeses();
    }

    consultarPorFecha(fecha_inicial, fecha_final) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.fetchColaboradoresCostosMesesxFechas(fecha_inicial, fecha_final, () => noCargando(), notificarErrorAjaxAction);
    }

    cargarDatos() {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarCentrosCostos = () => this.props.fetchCentrosCostosColaboradores(() => noCargando(), notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarCentrosCostos, notificarErrorAjaxAction)
    }

    updateColaboradorCostoMes(id, item, callback = null) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
            if (callback) {
                callback();
            }
        };
        this.props.updateColaboradorCostoMes(
            id,
            item,
            success_callback,
            notificarErrorAjaxAction
        )
    }

    buscarBusqueda(lista, busqueda) {
        return _.pickBy(lista, (permiso) => {
            return (
                permiso.colaborador_nombres.toString().toUpperCase().includes(busqueda.toUpperCase()) ||
                permiso.colaborador_apellidos.toString().toUpperCase().includes(busqueda.toUpperCase()) ||
                permiso.centro_costo_nombre.toString().toUpperCase().includes(busqueda.toUpperCase())
            )
        })
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        const {ano, mes, ano_error, mes_error} = this.state;
        return (
            <ValidarPermisos can_see={permisos_object.list} nombre='Costos Colaboradores'>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <TextField
                            hintText="El año"
                            floatingLabelText="Año"
                            value={ano}
                            errorText={ano_error}
                            onChange={(e, v) => {
                                this.setState({ano: v});
                                if (!REGEX_SOLO_NUMEROS.test(v) || v.length !== 4 || Number(v) < 0) {
                                    this.setState({ano_error: 'Debe ser un año válido'})
                                } else {
                                    this.setState({ano_error: ''})
                                }
                            }}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <TextField
                            hintText="Mes"
                            floatingLabelText="Mes"
                            value={mes}
                            onChange={(e, v) => {
                                this.setState({mes: v});
                                if (!REGEX_SOLO_NUMEROS.test(v) || Number(v) > 12 || Number(v) < 1) {
                                    this.setState({mes_error: 'Debe ser un mes válido'})
                                } else {
                                    this.setState({mes_error: ''})
                                }
                            }}
                            errorText={mes_error}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        {
                            mes_error === '' && ano_error === '' &&
                            <span
                                className='btn btn-primary'
                                onClick={() => {
                                    const fecha_inicial = moment(new Date(ano, (Number(mes) - 1), 1)).format('YYYY-MM-DD');
                                    const fecha_final = moment(new Date(ano, (Number(mes) - 1), 2)).format('YYYY-MM-DD');
                                    this.consultarPorFecha(fecha_inicial, fecha_final);
                                }}
                            >
                            Consultar
                        </span>
                        }
                    </div>
                </div>
                <div className="col-12">
                    <ListaBusqueda>
                        {
                            busqueda => {
                                const lista_filtrada = this.buscarBusqueda(
                                    _.orderBy(object_list, ['colaborador_nombres', 'colaborador_apellidos'],['asc','asc']),
                                    busqueda
                                );
                                return (
                                    <Tabla
                                        lista={lista_filtrada}
                                        updateColaboradorCostoMes={this.updateColaboradorCostoMes}
                                        permisos_object={permisos_object}
                                    />
                                )
                            }}
                    </ListaBusqueda>
                </div>
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.colaboradores_costos_nomina,
        centros_costos_list: state.centros_costos_colaboradores,
    }
}

export default connect(mapPropsToState, actions)(List)