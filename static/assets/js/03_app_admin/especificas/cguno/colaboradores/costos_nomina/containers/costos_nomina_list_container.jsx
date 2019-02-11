import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {
    COLABORADORES_COSTOS_MESES as permisos_view
} from "../../../../../../00_utilities/permisos/types";
import {permisosAdapter, REGEX_SOLO_NUMEROS} from "../../../../../../00_utilities/common";
import TextField from '@material-ui/core/TextField';
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
        const {ano, mes} = this.state;
        const date_today = moment(new Date(ano, mes, 1)).add(-1, 'month');
        const today = date_today.format('YYYY-MM-DD');
        const today_manana = date_today.add(1, 'day').format('YYYY-MM-DD');
        this.consultarPorFecha(today, today_manana);
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearColaboradoresCostosMeses();
    }

    consultarPorFecha(fecha_inicial, fecha_final) {
        this.props.fetchColaboradoresCostosMesesxFechas(fecha_inicial, fecha_final);
    }

    cargarDatos() {
        const cargarCentrosCostos = () => this.props.fetchCentrosCostosColaboradores();
        const cargarConfigCostos = () => this.props.fetchConfiguracionesCostos({callback: cargarCentrosCostos})
        this.props.tengoMisPermisosxListado([permisos_view], {callback: cargarConfigCostos})
    }

    updateColaboradorCostoMes(id, item, callback = null) {
        this.props.updateColaboradorCostoMes(id, item, {callback})
    }

    buscarBusqueda(lista, busqueda) {
        return _.pickBy(lista, (item) => {
            return (
                (item.colaborador_nombres && item.colaborador_nombres.toString().toUpperCase().includes(busqueda.toUpperCase())) ||
                (item.colaborador_apellidos && item.colaborador_apellidos.toString().toUpperCase().includes(busqueda.toUpperCase())) ||
                (item.centro_costo && item.centro_costo_nombre.toString().toUpperCase().includes(busqueda.toUpperCase()))
            )
        })
    }

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    render() {
        const {
            object_list,
            mis_permisos,
            centros_costos_list,
            configuracion_costos
        } = this.props;
        const permisos_object = permisosAdapter(mis_permisos, permisos_view);
        const {ano, mes, ano_error, mes_error} = this.state;
        return (
            <ValidarPermisos can_see={permisos_object.list} nombre='Costos Colaboradores'>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <TextField
                            label="El año"
                            floatinglabeltext="Año"
                            value={ano}
                            errortext={ano_error}
                            onChange={(e) => {
                                const v = e.target.value;
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
                            label="Mes"
                            floatinglabeltext="Mes"
                            value={mes}
                            onChange={(e) => {
                                const v = e.target.value;
                                this.setState({mes: v});
                                if (!REGEX_SOLO_NUMEROS.test(v) || Number(v) > 12 || Number(v) < 1) {
                                    this.setState({mes_error: 'Debe ser un mes válido'})
                                } else {
                                    this.setState({mes_error: ''})
                                }
                            }}
                            errortext={mes_error}
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
                                    _.orderBy(object_list, ['colaborador_nombres', 'colaborador_apellidos'], ['asc', 'asc']),
                                    busqueda
                                );
                                return (
                                    <Tabla
                                        configuracion_costos={configuracion_costos}
                                        lista={lista_filtrada}
                                        updateColaboradorCostoMes={this.updateColaboradorCostoMes}
                                        permisos_object={permisos_object}
                                        centros_costos_list={centros_costos_list}
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
        configuracion_costos: _.map(state.configuracion_costos, c => c)[0],

    }
}

export default connect(mapPropsToState, actions)(List)