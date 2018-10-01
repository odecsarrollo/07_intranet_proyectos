import React, {Component} from 'react';
import FormAddFase from './forms/add_fase_form';
import FaseLiteral from './seguimiento_literal_fase';
import moment from 'moment-timezone';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";

import MiembroLiteral from './adicionar_miembro';

moment.tz.setDefault("America/Bogota");
moment.locale('es');

const table_style = {
    th: {
        padding: 0,
        margin: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
    },
    td: {
        padding: 0,
        margin: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
    },
    table: {
        fontSize: '12px'
    }
};


class SeguimientoLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fase_seleccionada_id: null
        };
        this.adicionarQuitarFaseLiteral = this.adicionarQuitarFaseLiteral.bind(this);
        this.onSeleccionarFase = this.onSeleccionarFase.bind(this);
        this.adicionarMiembro = this.adicionarMiembro.bind(this);
        this.quitarMiembro = this.quitarMiembro.bind(this);
        this.editarMiembro = this.editarMiembro.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentWillUnmount() {
        this.props.clearFases();
        this.props.clearFasesLiterales();
        this.props.clearMiembrosLiterales();
    }

    componentDidMount() {
        const {id_literal} = this.props;
        this.cargarDatos(id_literal);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id_literal !== nextProps.id_literal) {
            this.cargarDatos(nextProps.id_literal);
        }
    }

    cargarDatos(id_literal) {
        const {
            notificarErrorAjaxAction,
            fetchFases,
            fetchFasesLiterales_x_literal,
            fetchMiembrosLiterales_x_literal,
            noCargando,
            fetchUsuarios,
        } = this.props;
        const cargarUsuarios = () => fetchUsuarios(() => noCargando(), notificarErrorAjaxAction);
        const cargarMiembros = () => fetchMiembrosLiterales_x_literal(id_literal, cargarUsuarios, notificarErrorAjaxAction);
        const cargarFasesxLiteral = () => fetchFasesLiterales_x_literal(id_literal, cargarMiembros, notificarErrorAjaxAction);
        fetchFases(cargarFasesxLiteral, notificarErrorAjaxAction);
    }

    adicionarMiembro(usuario_id) {
        const {
            adicionarMiembroLiteral,
            id_literal,
            notificarErrorAjaxAction,
        } = this.props;
        adicionarMiembroLiteral(id_literal, usuario_id, () => this.cargarDatos(id_literal), notificarErrorAjaxAction);
    }

    quitarMiembro(usuario_id) {
        const {
            quitarMiembroLiteral,
            id_literal,
            notificarErrorAjaxAction,
        } = this.props;
        quitarMiembroLiteral(id_literal, usuario_id, () => this.cargarDatos(id_literal), notificarErrorAjaxAction);
    }

    editarMiembro(miembro, cambios) {
        const {
            noCargando,
            cargando,
            fetchMiembroLiteral,
            updateMiembroLiteral,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        const actualizarMiembro = (response) => updateMiembroLiteral(miembro.id, {...response, ...cambios}, () => noCargando(), notificarErrorAjaxAction);
        fetchMiembroLiteral(miembro.id, actualizarMiembro, notificarErrorAjaxAction)
    }

    adicionarQuitarFaseLiteral(id_fase) {
        const {
            notificarErrorAjaxAction,
            adicionarQuitarFaseLiteral,
            cargando,
            id_literal,
        } = this.props;
        cargando();
        adicionarQuitarFaseLiteral(id_literal, id_fase, () => this.cargarDatos(id_literal), notificarErrorAjaxAction)
    }

    onSeleccionarFase(fase_literal_id) {
        const {cargando, noCargando, fetchFaseLiteral, notificarErrorAjaxAction} = this.props;
        const {fase_seleccionada_id} = this.state;
        cargando();
        if (fase_seleccionada_id === fase_literal_id) {
            this.setState({fase_seleccionada_id: null});
            noCargando();
        } else {
            const success_callback = () => {
                this.setState({fase_seleccionada_id: fase_literal_id});
                noCargando();
            };
            const cargarTareas = () => this.props.fetchTareasFases_x_literal(fase_literal_id, success_callback);
            fetchFaseLiteral(fase_literal_id, cargarTareas, notificarErrorAjaxAction)
        }
    }

    render() {
        const {
            fases_literales_list,
            miembros_literales_list,
            usuarios
        } = this.props;
        const {fase_seleccionada_id} = this.state;
        const fecha_minima = moment(_.min(_.map(fases_literales_list, e => e.fecha_limite)));
        const fecha_max = moment(_.max(_.map(fases_literales_list, e => e.fecha_limite)));
        const total_dias = parseInt(fecha_max.diff(fecha_minima, "days"));
        const dias_diez_porciento = parseInt((total_dias * 0.1).toFixed(0));
        return (
            <div>
                <FormAddFase
                    fases={this.props.fases_list}
                    fases_en_literal={fases_literales_list}
                    adicionarQuitarFaseLiteral={this.adicionarQuitarFaseLiteral}
                />
                <MiembroLiteral
                    table_style={table_style}
                    usuarios={usuarios}
                    adicionarMiembro={this.adicionarMiembro}
                    editarMiembro={this.editarMiembro}
                    quitarMiembro={this.quitarMiembro}
                    miembros_literales_list={miembros_literales_list}
                />
                Fases
                <div className="row">
                    {_.map(fases_literales_list, e => {
                        const dias_fase = moment(e.fecha_limite).diff(fecha_minima, 'days') + dias_diez_porciento;
                        return (
                            <div className="col-12" key={e.id}>
                                <FaseLiteral
                                    {...this.props}
                                    miembros_literales_list={miembros_literales_list}
                                    table_style={table_style}
                                    total_dias={total_dias + dias_diez_porciento}
                                    dias_fase={dias_fase}
                                    fase_seleccionada_id={fase_seleccionada_id}
                                    onSeleccionarFase={this.onSeleccionarFase}
                                    fase={e}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        fases_list: state.fases,
        fases_literales_list: state.fases_literales,
        fases_tareas: state.fases_tareas,
        usuarios: state.usuarios,
        miembros_literales_list: state.miembros_literales
    }
}

export default connect(mapPropsToState, actions)(SeguimientoLiteral)