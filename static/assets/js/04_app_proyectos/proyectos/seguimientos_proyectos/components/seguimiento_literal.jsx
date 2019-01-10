import React, {Component, Fragment} from 'react';
import FormAddFase from './forms/add_fase_form';
import FaseLiteral from './seguimiento_literal_fase';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {permisosAdapter} from "../../../../00_utilities/common";
import {
    COTIZACIONES as cotizaciones_permisos_view,
    PROYECTOS as proyectos_permisos_view,
} from "../../../../00_utilities/permisos/types";

import MiembroLiteral from './adicionar_miembro';
import {noCargando} from "../../../../01_actions/generales/utiles/loadingAction";

import moment from 'moment-timezone';
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
            fase_seleccionada_id: null,
            distancia_separadores: 4,
        };
        this.adicionarQuitarFaseLiteral = this.adicionarQuitarFaseLiteral.bind(this);
        this.onSeleccionarFase = this.onSeleccionarFase.bind(this);
        this.adicionarMiembro = this.adicionarMiembro.bind(this);
        this.actualizarTarea = this.actualizarTarea.bind(this);
        this.quitarMiembro = this.quitarMiembro.bind(this);
        this.editarMiembro = this.editarMiembro.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onClickPlusZoom = this.onClickPlusZoom.bind(this);
        this.onClickMinusZoom = this.onClickMinusZoom.bind(this);
    }

    componentWillUnmount() {
        this.limpiarDatos();
    }

    limpiarDatos() {
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
            this.limpiarDatos();
            this.cargarDatos(nextProps.id_literal);
        }
    }

    cargarDatos(id_literal) {
        const {
            notificarErrorAjaxAction,
            fetchFases,
            fetchMiCuenta,
            fetchFasesLiterales_x_literal,
            fetchMiembrosLiterales_x_literal,
            noCargando,
            cargando,
            fetchUsuarios,
        } = this.props;
        cargando();
        const cargarMiCuenta = () => fetchMiCuenta(() => noCargando(), notificarErrorAjaxAction);
        const cargarUsuarios = () => fetchUsuarios(cargarMiCuenta, notificarErrorAjaxAction);
        const cargarMiembros = () => fetchMiembrosLiterales_x_literal(id_literal, cargarUsuarios, notificarErrorAjaxAction);
        const cargarFasesxLiteral = () => fetchFasesLiterales_x_literal(id_literal, cargarMiembros, notificarErrorAjaxAction);
        const cargarFases = () => fetchFases(cargarFasesxLiteral, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarFases, notificarErrorAjaxAction);
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
        const {cargando, noCargando, fetchFaseLiteral, notificarErrorAjaxAction, fetchTareasFases_x_literal} = this.props;
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
            const cargarTareas = () => fetchTareasFases_x_literal(fase_literal_id, success_callback);
            fetchFaseLiteral(fase_literal_id, cargarTareas, notificarErrorAjaxAction)
        }
    }

    actualizarTarea(tarea_id, datos) {
        const {
            cargando,
            noCargando,
            updateTareaFase,
            notificarErrorAjaxAction,
            fetchTareaFase,
            fetchFaseLiteral,
            callBackSeguimiento = null
        } = this.props;
        cargando();
        const success_callback = () => {
            if (callBackSeguimiento) {
                callBackSeguimiento();
            }
            else {
                noCargando();
            }
        };
        const cargarFaseLiteral = (tarea) => fetchFaseLiteral(tarea.fase_literal, success_callback, notificarErrorAjaxAction);
        const actualizarTarea = (tarea) => {
            updateTareaFase(
                tarea_id,
                {...tarea, ...datos},
                cargarFaseLiteral,
                notificarErrorAjaxAction
            )
        };

        fetchTareaFase(tarea_id, actualizarTarea, notificarErrorAjaxAction)
    }

    onClickPlusZoom() {
        this.setState(s => {
            let nueva_distancia_separadores = 15;
            if (s.distancia_separadores === 4) {
                nueva_distancia_separadores = 15;
            }
            if (s.distancia_separadores === 2) {
                nueva_distancia_separadores = 4;
            }
            if (s.distancia_separadores === 1) {
                nueva_distancia_separadores = 2;
            }
            return {distancia_separadores: nueva_distancia_separadores}
        })
    }

    onClickMinusZoom() {
        this.setState(s => {
            let nueva_distancia_separadores = 1;
            if (s.distancia_separadores === 15) {
                nueva_distancia_separadores = 4;
            }
            if (s.distancia_separadores === 4) {
                nueva_distancia_separadores = 2;
            }
            if (s.distancia_separadores === 2) {
                nueva_distancia_separadores = 1;
            }
            return {distancia_separadores: nueva_distancia_separadores}
        })
    }

    render() {
        const {
            fases_literales_list,
            miembros_literales_list,
            usuarios,
            mi_cuenta,
            mis_permisos,
        } = this.props;
        let miembro = _.head(_.map(_.pickBy(miembros_literales_list, e => e.usuario === mi_cuenta.id), e => e));
        miembro = miembro ? miembro : null;
        const {fase_seleccionada_id} = this.state;

        const fecha_minima = moment(_.min(_.map(fases_literales_list, e => e.fecha_inicial)));

        const fecha_max = moment(_.max(_.map(fases_literales_list, e => e.fecha_limite)));

        const total_dias = parseInt(fecha_max.diff(fecha_minima, "days"));

        const getRangeOfDates = (start, end, key, arr = [start.startOf(key)]) => {
            if (start.isAfter(end)) throw new Error('start must precede end');
            const next = moment(start).add(1, key).startOf(key);
            if (next.isAfter(end, key)) return arr;
            return getRangeOfDates(next, end, key, arr.concat(next));
        };

        const dates = getRangeOfDates(fecha_minima, fecha_max, 'day');
        const years = _.uniq(dates.map(e => e.toDate().getFullYear()));

        const fechas = years.map(e => {
            const months = _.uniq(dates.filter(f => f.toDate().getFullYear() === e).map(m => m.toDate().getMonth()));
            const fecha_min_ano = _.min(dates.filter(f => f.toDate().getFullYear() === e));
            const fecha_max_ano = _.max(dates.filter(f => f.toDate().getFullYear() === e));
            const nro_dias_ano = fecha_max_ano.diff(fecha_min_ano, 'days') + 1;
            const meses = months.map(m => {
                const fecha_min_mes = _.min(dates.filter(f => f.toDate().getFullYear() === e).filter(f => f.toDate().getMonth() === m));
                const fecha_max_mes = _.max(dates.filter(f => f.toDate().getFullYear() === e).filter(f => f.toDate().getMonth() === m));
                const nro_dias_mes = fecha_max_mes.diff(fecha_min_mes, 'days') + 1;
                return (
                    {
                        mes: m,
                        dias: dates.filter(f => f.toDate().getMonth() === m).filter(f => f.toDate().getFullYear() === e).map(d => d.toDate()),
                        nro_dias_mes
                    }
                )
            });
            return {
                ano: e,
                meses,
                nro_dias_ano
            }
        });

        const proyecto_permisos = permisosAdapter(mis_permisos, proyectos_permisos_view);

        const puede_administrar_miembros = (miembro && miembro.puede_administrar_miembros) || proyecto_permisos.admin_proyect_manager;
        const puede_administrar_fases = (miembro && miembro.puede_administrar_fases) || proyecto_permisos.admin_proyect_manager;
        const puede_adicionar_tareas = (miembro && miembro.puede_adicionar_tareas) || proyecto_permisos.admin_proyect_manager;
        const puede_eliminar_tareas = (miembro && miembro.puede_eliminar_tareas) || proyecto_permisos.admin_proyect_manager;
        const puede_editar_tareas = (miembro && miembro.puede_editar_tareas) || proyecto_permisos.admin_proyect_manager;

        const {distancia_separadores} = this.state;

        const ancho_total = distancia_separadores * total_dias > 0 ? distancia_separadores * total_dias : 700;

        return (
            <div>
                <Tabs>
                    <TabList>
                        <Tab>Tareas</Tab>
                        <Tab>Miembros</Tab>
                        <Tab>Fases</Tab>
                    </TabList>

                    <TabPanel>
                        <div style={{width: `100%`, overflowX: 'scroll'}}>
                            {
                                distancia_separadores * total_dias > 0 &&
                                <div>
                                    <i className='fas fa-minus-circle puntero'
                                       onClick={() => this.onClickMinusZoom()}></i>
                                    <i className='fas fa-plus-circle puntero'
                                       onClick={() => this.onClickPlusZoom()}></i>
                                </div>
                            }
                            <div
                                style={{
                                    width: `${ancho_total + 50}px`,
                                    border: '1px solid transparent',
                                    clear: 'both',
                                    fontSize: '9px',
                                }}
                            >
                                {
                                    distancia_separadores * total_dias > 0 &&
                                    fechas.map(
                                        f => <div key={f.ano} style={{float: 'left'}}
                                                  className='text-center'
                                        >
                                            <div style={{
                                                borderRight: '1px solid black',
                                                borderBottom: '1px solid black'
                                            }}><strong>{f.ano}</strong></div>
                                            <div className='text-center'>
                                                {
                                                    f.meses.map(m =>
                                                        <div key={`${f.ano}-${m.mes}`} style={{
                                                            float: 'left'
                                                        }}
                                                             className='text-center'
                                                        >
                                                            <div
                                                                style={{borderRight: '1px solid black'}}>{moment().month(m.mes).format('MMM').toString()}</div>
                                                            <div
                                                                className={`text-left${distancia_separadores > 4 ? ' mb-4' : ''}`}>
                                                                {
                                                                    m.dias.map(d =>
                                                                        <div
                                                                            key={`${f.ano}-${m.mes}-${d.getDate()}`}
                                                                            style={{
                                                                                float: 'left',
                                                                                borderTop: 'solid 1px black',
                                                                                borderRight: 'solid 1px black',
                                                                                width: `${distancia_separadores}px`,
                                                                            }}>
                                                                            {
                                                                                distancia_separadores > 4 &&
                                                                                <div
                                                                                    style={{
                                                                                        position: 'relative',
                                                                                        left: '-5px',
                                                                                        bottom: '-10px'
                                                                                    }}
                                                                                >
                                                                                    {d.getDate()}
                                                                                </div>
                                                                            }
                                                                        </div>)
                                                                }
                                                            </div>
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                            <div
                                style={{width: `${ancho_total}px`, border: '1px solid transparent', clear: 'both'}}
                                className='mb-5'
                            >
                                {_.map(fases_literales_list, e => {
                                    const dias_fase = moment(e.fecha_limite).diff(e.fecha_inicial, 'days');
                                    return (
                                        <div key={e.id}>
                                            <FaseLiteral
                                                {...this.props}
                                                fecha_minima={fecha_minima}
                                                distancia_separadores={distancia_separadores}
                                                actualizarTarea={this.actualizarTarea}
                                                miembros_literales_list={miembros_literales_list}
                                                table_style={table_style}
                                                total_dias={total_dias}
                                                dias_fase={dias_fase}
                                                fase_seleccionada_id={fase_seleccionada_id}
                                                onSeleccionarFase={this.onSeleccionarFase}
                                                fase={e}
                                                puede_adicionar_tareas={puede_adicionar_tareas}
                                                puede_editar_tareas={puede_editar_tareas}
                                                puede_eliminar_tareas={puede_eliminar_tareas}
                                                administra_proyectos={proyecto_permisos.admin_proyect_manager}
                                                soy_responsable={mi_cuenta.id === e.responsable}
                                                mi_id_usuario={mi_cuenta.id}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <MiembroLiteral
                            table_style={table_style}
                            usuarios={usuarios}
                            adicionarMiembro={this.adicionarMiembro}
                            editarMiembro={this.editarMiembro}
                            quitarMiembro={this.quitarMiembro}
                            miembros_literales_list={miembros_literales_list}
                            puede_administrar={puede_administrar_miembros}
                        />
                    </TabPanel>
                    <TabPanel>
                        <FormAddFase
                            fases={this.props.fases_list}
                            fases_en_literal={fases_literales_list}
                            adicionarQuitarFaseLiteral={this.adicionarQuitarFaseLiteral}
                            puede_administrar={puede_administrar_fases}
                        />
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        mi_cuenta: state.mi_cuenta,
        fases_list: state.fases,
        fases_literales_list: state.fases_literales,
        fases_tareas: state.fases_tareas,
        usuarios: state.usuarios,
        miembros_literales_list: state.miembros_literales
    }
}

export default connect(mapPropsToState, actions)(SeguimientoLiteral)