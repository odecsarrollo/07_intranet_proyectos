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

    render() {
        const {object_list, mis_permisos} = this.props;
        const bloque_1_list = permisosAdapter(mis_permisos, permisos_view);
        const {ano, mes, ano_error, mes_error} = this.state;
        console.log(object_list)
        return (
            <Fragment>
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
                        <span
                            className='btn btn-primary'
                            onClick={() => {
                                const fecha_inicial = moment(new Date(ano, mes, 1)).format('YYYY-MM-DD');
                                const fecha_final = moment(new Date(ano, mes, 2)).format('YYYY-MM-DD');
                                this.consultarPorFecha(fecha_inicial, fecha_final);
                            }}
                        >
                            Consultar
                        </span>
                    </div>
                </div>
                <div className="col-12">
                    <Tabla
                        lista={object_list}
                        updateColaboradorCostoMes={this.updateColaboradorCostoMes}
                    />
                </div>
                {/*<ListCrud*/}
                {/*object_list={object_list}*/}
                {/*permisos_object={bloque_1_list}*/}
                {/*{...this.props}*/}
                {/*/>*/}
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
        object_list: state.colaboradores_costos_nomina,
        centros_costos_list: state.centros_costos_colaboradores,
    }
}

export default connect(mapPropsToState, actions)(List)