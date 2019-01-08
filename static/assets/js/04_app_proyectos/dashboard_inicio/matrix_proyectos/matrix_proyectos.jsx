import React, {Component, Fragment} from 'react';
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";

import moment from 'moment-timezone';

moment.tz.setDefault("America/Bogota");
moment.locale('es');

class LiteralesSeguimiento extends Component {
    constructor(props) {
        super(props);
        this.state = {
            distancia_separadores: 15,
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
            fases_tareas
        } = this.props;
        const {distancia_separadores} = this.state;
        let literales = [];
        _.mapKeys(_.groupBy(fases_tareas, 'literal_id_literal'), (v, k) => literales = [...literales, {
            literal: k,
            tareas: v
        }]);
        literales = _.mapKeys(literales, 'literal');
        _.map(literales, l => {
            let fases = [];
            _.mapKeys(_.groupBy(l.tareas, 'fase_literal_nombre'), (v, k) => {
                const fecha_ini = moment(_.min(_.map(v, f => f.fecha_inicial)));
                const fecha_fin = moment(_.max(_.map(v, f => f.fecha_limite)));
                fases = [...fases, {fase: k, tareas: v, total_dias: parseInt(fecha_fin.diff(fecha_ini, "days"))}]
            });
            fases = _.mapKeys(fases, 'fase');
            literales[l.literal] = {...l, fases};
        });

        const fecha_ini = moment(_.min(_.map(fases_tareas, f => f.fecha_inicial)));
        const fecha_fin = moment(_.max(_.map(fases_tareas, f => f.fecha_limite)));

        const total_dias = parseInt(fecha_fin.diff(fecha_ini, "days"));
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

        console.log(literales)
        return (
            <Fragment>
                {
                    distancia_separadores * total_dias > 0 &&
                    <div className="col-12">
                        <i className='fas fa-minus-circle puntero'
                           onClick={() => this.onClickMinusZoom()}></i>
                        <i className='fas fa-plus-circle puntero'
                           onClick={() => this.onClickPlusZoom()}></i>
                    </div>
                }

                <div className="col-12">
                    <div className="row">
                        <div className="col-2">
                            <div className="col-2" style={{height: '50px'}}>
                            </div>
                            {_.map(literales, l =>
                                <div className="col-12"
                                     key={`iz-${l.literal}`}
                                     style={{
                                         height: `${_.size(l.fases) * 15}px`,
                                         border: '1px black solid',
                                     }}>
                                    {l.literal}
                                </div>
                            )}
                        </div>
                        <div className="col-10" style={{width: `100%`, overflowX: 'scroll'}}>
                            <div className="col-10" style={{height: '50px'}}>
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
                            </div>
                            {_.map(literales, l =>
                                <div className="col-12"
                                     key={`der-${l.literal}`}
                                     style={{
                                         height: `${_.size(l.fases) * 15}px`,
                                         border: '1px black solid',
                                         width: `${ancho_total + 50}px`,
                                     }}>

                                </div>
                            )}
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
