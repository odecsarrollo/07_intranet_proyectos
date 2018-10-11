import React, {Component, Fragment} from 'react';
import SeguimientoLiteral from '../../proyectos/seguimientos_proyectos/components/seguimiento_literal';
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";

class LiteralesSeguimiento extends Component {
    constructor(props) {
        super(props);
        this.state = {id_literal: null};
        this.cargarLiteralesConSeguimiento = this.cargarLiteralesConSeguimiento.bind(this);
    }

    componentDidMount() {
        this.cargarLiteralesConSeguimiento();
    }

    componentWillUnmount() {
        this.props.clearLiterales();
    }

    cargarLiteralesConSeguimiento() {
        const {cargando, noCargando, notificarErrorAjaxAction, fetchLiteralesConSeguimiento} = this.props;
        cargando();
        fetchLiteralesConSeguimiento(() => noCargando(), notificarErrorAjaxAction);
    }

    render() {
        const {
            literales,
            table_style
        } = this.props;
        const {id_literal} = this.state;
        return (
            <Fragment>
                <div className="col-12 col-md-5 col-xl-4">
                    <table className='table table-striped table-responsive' style={table_style.table}>
                        <thead>
                        <tr>
                            <th style={table_style.th}>Proy.</th>
                            <th style={table_style.th}>Lite.</th>
                            <th style={table_style.th}>Venc.</th>
                            <th style={table_style.th}>Nuev.</th>
                            <th style={table_style.th}>Pend.</th>
                            <th style={table_style.th}>Proc.</th>
                            <th style={table_style.th}>Term.</th>
                            <th style={table_style.th}>Tot.</th>
                            <th style={table_style.th}>%Cum.</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            _.map(_.orderBy(literales, ['id_proyecto', 'id_literal'], ['desc', 'asc']), e => {
                                const seleccionado = id_literal ? e.id === id_literal : false;
                                return (
                                    <tr
                                        key={e.id}
                                        onClick={() => this.setState({id_literal: e.id})}
                                        className={`puntero`}
                                        style={{
                                            backgroundColor: seleccionado ? ' black' : '',
                                            color: seleccionado ? ' white' : '',
                                        }}
                                    >
                                        <td style={table_style.td}>{e.id_proyecto}</td>
                                        <td style={table_style.td}>{e.id_literal}</td>
                                        <td
                                            className='text-center'
                                            style={{
                                                ...table_style.td,
                                                color: e.cantidad_tareas_vencidas > 0 ? 'red' : ''
                                            }}
                                        >
                                            {e.cantidad_tareas_vencidas > 0 && e.cantidad_tareas_vencidas}
                                        </td>
                                        <td
                                            style={table_style.td}
                                            className='text-center'
                                        >
                                            {e.cantidad_tareas_nuevas > 0 && e.cantidad_tareas_nuevas}
                                        </td>
                                        <td
                                            style={table_style.td}
                                            className='text-center'
                                        >
                                            {e.cantidad_tareas_pendientes > 0 && e.cantidad_tareas_pendientes}
                                        </td>
                                        <td
                                            style={table_style.td}
                                            className='text-center'
                                        >
                                            {e.cantidad_tareas_en_proceso > 0 && e.cantidad_tareas_en_proceso}
                                        </td>
                                        <td
                                            style={table_style.td}
                                            className='text-center'
                                        >
                                            {e.cantidad_tareas_terminadas > 0 && e.cantidad_tareas_terminadas}
                                        </td>
                                        <td
                                            style={table_style.td}
                                            className='text-center'
                                        >
                                            {e.cantidad_tareas_totales > 0 && e.cantidad_tareas_totales}
                                        </td>
                                        <td
                                            style={table_style.td}
                                            className='text-center'
                                        >
                                            {
                                                e.cantidad_tareas_totales > 0 &&
                                                <Fragment>
                                                    {((e.cantidad_tareas_terminadas / e.cantidad_tareas_totales) * 100).toFixed(1)}%
                                                </Fragment>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
                <div className="col-12 col-md-7 col-xl-8">
                    {
                        id_literal &&
                        <Fragment>
                            <h5><strong>Literal: </strong> {literales[id_literal].id_literal}</h5>
                            <h5><strong>Descripción: </strong> {literales[id_literal].descripcion}</h5>
                            <SeguimientoLiteral
                                id_literal={id_literal}
                                callBackSeguimiento={this.cargarLiteralesConSeguimiento}
                            />
                        </Fragment>
                    }
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
        literales: state.literales
    }
}

export default connect(mapPropsToState, actions)(LiteralesSeguimiento)
