import React, {Component, Fragment} from 'react';
import FormAddFase from './forms/add_fase_form';
import FaseLiteral from './seguimiento_literal_fase';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {permisosAdapterDos} from "../../../../00_utilities/common";
import {
    PROYECTOS as proyectos_permisos_view,
} from "../../../../00_utilities/permisos/types";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import MiembroLiteral from './adicionar_miembro';

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
        this.onSelectTabClick = this.onSelectTabClick.bind(this);
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
        this.props.fetchMisPermisosxListado(
            [
                proyectos_permisos_view
            ], {callback: () => this.cargarDatos(id_literal)}
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id_literal !== nextProps.id_literal) {
            this.limpiarDatos();
            this.cargarDatos(nextProps.id_literal);
        }
    }

    cargarDatos(id_literal) {
        const cargarMiCuenta = () => this.props.fetchMiCuenta();
        this.props.fetchFasesLiterales_x_literal(id_literal, {callback: cargarMiCuenta});
    }

    adicionarMiembro(usuario_id) {
        const {id_literal} = this.props;
        this.props.adicionarMiembroLiteral(id_literal, usuario_id, {callback: () => this.onSelectTabClick(2)});
    }

    quitarMiembro(usuario_id) {
        const {id_literal} = this.props;
        this.props.quitarMiembroLiteral(id_literal, usuario_id, {callback: () => this.onSelectTabClick(2)});
    }

    editarMiembro(miembro, cambios) {
        const actualizarMiembro = (response) => this.props.updateMiembroLiteral(miembro.id, {...response, ...cambios});
        this.props.fetchMiembroLiteral(miembro.id, {callback: actualizarMiembro})
    }

    adicionarQuitarFaseLiteral(id_fase) {
        const {id_literal} = this.props;
        this.props.adicionarQuitarFaseLiteral(id_literal, id_fase, {callback: () => this.onSelectTabClick(3)})
    }

    onSeleccionarFase(fase_literal_id) {
        const {fase_seleccionada_id} = this.state;
        const {id_literal} = this.props;
        if (fase_seleccionada_id === fase_literal_id) {
            this.setState({fase_seleccionada_id: null});
        } else {
            const success_callback = () => {
                this.setState({fase_seleccionada_id: fase_literal_id});
            };
            const cargarMiembros = () => this.props.fetchMiembrosLiterales_x_literal(id_literal, {callback: success_callback});
            const cargarTareas = () => this.props.fetchTareasFases_x_literal(fase_literal_id, {callback: cargarMiembros});
            this.props.fetchFaseLiteral(fase_literal_id, {callback: cargarTareas})
        }
    }

    actualizarTarea(tarea_id, datos, callback = null) {
        const {callBackSeguimiento = null} = this.props;
        const success_callback = () => {
            if (callback) {
                callback();
            }
            if (callBackSeguimiento) {
                callBackSeguimiento();
            }
        };
        const cargarFaseLiteral = (tarea) => this.props.fetchFaseLiteral(tarea.fase_literal, {callback: success_callback});
        const actualizarTarea = (tarea) => this.props.updateTareaFase(tarea_id, {...tarea, ...datos}, {callback: cargarFaseLiteral});
        this.props.fetchTareaFase(tarea_id, {callback: actualizarTarea})
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

    onSelectTabClick(index) {
        const {id_literal} = this.props;
        if (index === 1) {
            const cargarFasesxLiterales = () => this.props.fetchFasesLiterales_x_literal(id_literal);
            this.props.fetchMiembrosLiterales_x_literal(id_literal, {callback: () => cargarFasesxLiterales});
        }
        if (index === 2) {
            this.props.fetchMiembrosLiterales_x_literal(id_literal, {callback: () => this.props.fetchUsuarios()});
        }
        if (index === 3) {
            const cargarFasesxLiteral = () => this.props.fetchFasesLiterales_x_literal(id_literal);
            this.props.fetchFases({callback: cargarFasesxLiteral});
        }
    }

    render() {
        const {
            mis_permisos,
            fases_literales_list,
            miembros_literales_list,
            usuarios
        } = this.props;
        const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
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

        const proyecto_permisos = permisosAdapterDos(mis_permisos, proyectos_permisos_view);

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
                        <Tab onClick={() => this.onSelectTabClick(1)}>Tareas</Tab>
                        <Tab onClick={() => this.onSelectTabClick(2)}>Miembros</Tab>
                        <Tab onClick={() => this.onSelectTabClick(3)}>Fases</Tab>
                    </TabList>

                    <TabPanel>
                        <div style={{width: `100%`, overflowX: 'scroll'}}>
                            {
                                distancia_separadores * total_dias > 0 &&
                                <div>
                                    <FontAwesomeIcon
                                        className='puntero'
                                        icon='minus-circle'
                                        onClick={() => this.onClickMinusZoom()}
                                    />
                                    <FontAwesomeIcon
                                        className='puntero'
                                        icon='plus-circle'
                                        onClick={() => this.onClickPlusZoom()}
                                    />
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
                                className='mb-3'
                            >
                                {_.map(_.pickBy(_.orderBy(fases_literales_list, ['fase_orden'], ['asc']), e => e.nro_tareas > 0), e => {
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
                            {
                                _.size(_.pickBy(fases_literales_list, e => e.nro_tareas === 0)) > 0 &&
                                <h4>Sin tareas</h4>
                            }
                            {
                                _.map(_.pickBy(fases_literales_list, e => e.nro_tareas === 0), e => {
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
                                })
                            }
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
        fases_list: state.fases,
        fases_literales_list: state.fases_literales,
        fases_tareas: state.fases_tareas,
        usuarios: state.usuarios,
        miembros_literales_list: state.miembros_literales
    }
}

export default connect(mapPropsToState, actions)(SeguimientoLiteral)