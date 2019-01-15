import React, {Component, Fragment} from 'react';
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import Combobox from 'react-widgets/lib/Combobox';
import {Link} from 'react-router-dom'

import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
moment.locale('es');

class LiteralesSeguimiento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distancia_separadores: 10,
            filtro_miembro: null,
            filtro_fase: null,
        };
        this.cargarLiteralesConSeguimiento = this.cargarLiteralesConSeguimiento.bind(this);
        this.onClickPlusZoom = this.onClickPlusZoom.bind(this);
        this.onClickMinusZoom = this.onClickMinusZoom.bind(this);
    }

    componentDidMount() {
        this.cargarLiteralesConSeguimiento();
    }

    componentWillUnmount() {
        this.props.clearLiterales();
    }

    cargarLiteralesConSeguimiento() {
        const {cargando, noCargando, notificarErrorAjaxAction, fetchPendientesTareasFases} = this.props;
        cargando();
        fetchPendientesTareasFases(() => noCargando(), notificarErrorAjaxAction);
    }

    onClickPlusZoom() {
        this.setState(s => {
            let nueva_distancia_separadores = 15;
            if (s.distancia_separadores === 10) {
                nueva_distancia_separadores = 15;
            }
            if (s.distancia_separadores === 4) {
                nueva_distancia_separadores = 10;
            }
            if (s.distancia_separadores === 2) {
                nueva_distancia_separadores = 4;
            }
            return {distancia_separadores: nueva_distancia_separadores}
        })
    }

    onClickMinusZoom() {
        this.setState(s => {
            let nueva_distancia_separadores = 2;
            if (s.distancia_separadores === 15) {
                nueva_distancia_separadores = 10;
            }
            if (s.distancia_separadores === 10) {
                nueva_distancia_separadores = 4;
            }
            if (s.distancia_separadores === 4) {
                nueva_distancia_separadores = 2;
            }
            return {distancia_separadores: nueva_distancia_separadores}
        })
    }

    render() {
        const {
            fases_tareas
        } = this.props;
        const {distancia_separadores, filtro_miembro, filtro_fase} = this.state;
        let literales = [];

        let colores_x_fase = _.map(fases_tareas, f => {
            return {
                fase: f.fase_literal_nombre,
                color: f.fase_literal_color,
                letra: f.fase_literal_color_letra,
            }
        });

        colores_x_fase = _.mapKeys(colores_x_fase, 'fase');

        let miembros_proyectos = _.uniq(_.map(_.orderBy(fases_tareas, 'asignado_a_nombre'), e => e.asignado_a_nombre));
        miembros_proyectos = ['TODOS', ...miembros_proyectos];

        let fases_proyectos = _.uniq(_.map(_.orderBy(fases_tareas, 'fase_literal_nombre'), e => e.fase_literal_nombre));
        fases_proyectos = ['TODAS', ...fases_proyectos];

        let data = filtro_miembro ? _.pickBy(fases_tareas, e => e.asignado_a_nombre === filtro_miembro) : fases_tareas;
        data = filtro_fase ? _.pickBy(data, e => e.fase_literal_nombre === filtro_fase) : data;

        _.mapKeys(_.groupBy(data, 'literal_id_literal'), (v, k) => literales = [...literales, {
            literal: k,
            tareas: v
        }]);
        literales = _.mapKeys(literales, 'literal');

        const proyecto_x_literal = _.mapKeys(_.map(data, e => {
            return {literal: e.literal_id_literal, proyecto: e.proyecto}
        }), 'literal');

        _.map(literales, l => {
            let fases = [];
            _.mapKeys(_.groupBy(l.tareas, 'fase_literal_nombre'), (v, k) => {
                const fecha_ini = moment(_.min(_.map(v, f => f.fecha_inicial)));
                const fecha_fin = moment(_.max(_.map(v, f => f.fecha_limite)));
                fases = [
                    ...fases,
                    {
                        fase: k,
                        tareas: v,
                        total_dias: parseInt(fecha_fin.diff(fecha_ini, "days")),
                        fecha_ini,
                        fecha_fin
                    }
                ]
            });
            fases = _.mapKeys(fases, 'fase');
            literales[l.literal] = {...l, fases};
        });

        const fecha_hoy = moment(new Date())
        const fecha_ini = moment(_.min(_.map(data, f => f.fecha_inicial)));
        const fecha_fin = moment(_.max(_.map(data, f => f.fecha_limite)));

        const total_dias = parseInt(fecha_fin.diff(fecha_ini, "days"));
        let total_dias_hoy = parseInt(fecha_hoy.diff(fecha_ini, "days")) + 1;
        total_dias_hoy = (total_dias_hoy < 1 || total_dias < total_dias_hoy) ? -15 : total_dias_hoy;

        const ancho_total = distancia_separadores * total_dias > 0 ? distancia_separadores * total_dias : 700;

        const getRangeOfDates = (start, end, key, arr = [start.startOf(key)]) => {
            if (start.isAfter(end)) throw new Error('start must precede end');
            const next = moment(start).add(1, key).startOf(key);
            if (next.isAfter(end, key)) return arr;
            return getRangeOfDates(next, end, key, arr.concat(next));
        };

        const dates = getRangeOfDates(fecha_ini, fecha_fin, 'day');
        const years = _.uniq(dates.map(e => e.toDate().getFullYear()));

        const fechas = years.map(e => {
            const months = _.uniq(dates.filter(f => f.toDate().getFullYear() === e).map(m => m.toDate().getMonth()));
            const fecha_min_ano = _.min(dates.filter(f => f.toDate().getFullYear() === e));
            const fecha_max_ano = _.max(dates.filter(f => f.toDate().getFullYear() === e));
            const nro_dias_ano = fecha_max_ano.diff(fecha_min_ano, 'days') + 1;
            const meses = months.map(m => {
                const fecha_min_mes = _.min(dates.filter(f => f.toDate().getFullYear() === e).filter(f => f.toDate().getMonth() === m));
                const fecha_max_mes = _.max(dates.filter(f => f.toDate().getFullYear() === e).filter(f => f.toDate().getMonth() === m));
                const nro_dias_mes = fecha_max_mes.diff(fecha_min_mes, 'days');
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
        const numero_fases = _.reduce(_.map(literales, l => _.size(l.fases)), (sum, n) => sum + n);
        return (
            <Fragment>
                <div className="col-12" style={{fontSize: '11px'}}>
                    <Combobox data={miembros_proyectos}
                              onChange={e => {
                                  this.setState({filtro_miembro: e === 'TODOS' ? null : e})
                              }}
                              placeholder='Filtro por miembro de proyecto'
                              defaultValue='TODOS'
                    />
                </div>
                <div className="col-12" style={{fontSize: '11px'}}>
                    <Combobox data={fases_proyectos}
                              onChange={e => {
                                  this.setState({filtro_fase: e === 'TODAS' ? null : e})
                              }}
                              placeholder='Filtro por fases'
                              defaultValue='TODAS'
                    />
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-2 col-xl-1 p-0">
                            <div style={{height: '50px', width: '100%'}}>
                                {
                                    distancia_separadores * total_dias > 0 &&
                                    <div className="col-12">
                                        <i className='fas fa-minus-circle puntero'
                                           onClick={() => this.onClickMinusZoom()}></i>
                                        <i className='fas fa-plus-circle puntero'
                                           onClick={() => this.onClickPlusZoom()}></i>
                                    </div>
                                }
                            </div>
                            {_.map(literales, l => {
                                    return (
                                        <div key={`iz-${l.literal}`}
                                             style={{
                                                 height: `${_.size(l.fases) * 20}px`,
                                                 borderTop: '1px red dashed',
                                                 paddingTop: `${((_.size(l.fases) * 20) / 2) - 14}px`,
                                                 fontSize: '14px'
                                             }}>
                                            <Link
                                                to={`/app/proyectos/proyectos/detail/${proyecto_x_literal[l.literal].proyecto}`}>
                                                {l.literal}
                                            </Link>
                                        </div>
                                    )
                                }
                            )}
                        </div>
                        <div className="col-10 col-xl-11 p-0" style={{overflowX: 'scroll'}}>
                            <div style={{width: `${ancho_total + 20}px`, paddingBottom: '20px'}}>
                                <div style={{height: '50px'}}>
                                    <div
                                        style={{
                                            width: `${ancho_total + 20}px`,
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
                                                    }}>
                                                        <strong>{f.nro_dias_ano > 5 ? f.ano : f.ano.toString().substring(2, 4)}</strong>
                                                    </div>
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
                                                                                                left: '8px',
                                                                                                bottom: '-10px'
                                                                                            }}
                                                                                        >
                                                                                            <span
                                                                                                style={{fontSize: distancia_separadores === 10 ? '6px' : '8px'}}>{d.getDate()}
                                                                                                </span>
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
                                </div>
                                <div
                                    style={{
                                        borderLeft: '1px red dotted',
                                        height: `${numero_fases * 20}px`,
                                        position: 'relative',
                                        left: `${total_dias_hoy * distancia_separadores}px`,
                                        float: 'left',
                                        color: 'transparent'
                                    }}>
                                    H
                                </div>
                                {_.map(literales, l =>
                                    <div key={`der-${l.literal}`}
                                         style={{
                                             height: `${_.size(l.fases) * 20}px`,
                                             borderTop: '1px red dashed',
                                             fontSize: '9px'
                                         }}
                                    >
                                        {
                                            _.map(l.fases, f => {
                                                const tamano = f.total_dias * distancia_separadores;
                                                const dias_a_correr = f.fecha_ini.diff(fecha_ini, "days") + 1;
                                                const tamano_a_correr = dias_a_correr * distancia_separadores;
                                                const color_letra = colores_x_fase[f.fase].letra;
                                                const color_letra_borde = color_letra === 'black' ? 'white' : 'black';
                                                return (
                                                    <div
                                                        key={`${l.literal}-${f.fase}`}
                                                        style={{
                                                            width: `${tamano}px`,
                                                            height: `20px`,
                                                            position: 'relative',
                                                            marginLeft: `${tamano_a_correr}px`
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                height: '14px',
                                                                backgroundColor: `${colores_x_fase[f.fase].color}`,
                                                                borderRadius: '2px',
                                                                color: `${color_letra}`,
                                                                textShadow: `-1px 0 ${color_letra_borde}, 0 1px ${color_letra_borde}, 1px 0 ${color_letra_borde}, 0 -1px ${color_letra_borde}`
                                                            }}
                                                        >
                                                            <span className='pl-1'>{f.fase}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <CargarDatos
                    cargarDatos={this.cargarLiteralesConSeguimiento}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        fases_tareas: state.fases_tareas
    }
}

export default connect(mapPropsToState, actions)(LiteralesSeguimiento)
