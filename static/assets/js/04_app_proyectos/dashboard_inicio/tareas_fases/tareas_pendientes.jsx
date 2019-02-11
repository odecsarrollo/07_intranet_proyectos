import React, {Component, Fragment} from 'react';
import TareasAsignadasPanel from './tareas_listados';
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {fechaFormatoDos} from "../../../00_utilities/common";
import TdCambiarEstadoTarea from '../../proyectos/seguimientos_proyectos/components/cambiar_estado_tarea';

class TareaListItem extends Component {
    render() {
        const {
            fila,
            table_style,
            actualizarTarea,
            modo,
        } = this.props;
        return (
            <tr style={{color: fila.vencido ? 'red' : ''}}
            >
                <td style={table_style.td}>{fila.literal_id_literal}</td>
                <td style={table_style.td}>{fila.descripcion}</td>
                <TdCambiarEstadoTarea
                    puede_cambiar_estado={true}
                    fila={fila}
                    actualizarTarea={actualizarTarea}
                    table_style={table_style}
                />
                {
                    modo === 2 &&
                    <td style={table_style.td}>{fila.asignado_a_nombre}</td>
                }
                <td style={table_style.td}>{fechaFormatoDos(fila.fecha_limite)}</td>
            </tr>
        )
    }
}


class TareasPendientesList extends Component {
    constructor(props) {
        super(props);
        this.cambiarFiltroPendientes = this.cambiarFiltroPendientes.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.actualizarTarea = this.actualizarTarea.bind(this);
        this.cargarTareasPendientes = this.cargarTareasPendientes.bind(this);
        this.state = {
            estado: null,
            literal: null
        }
    }

    actualizarTarea(tarea_id, datos) {
        const actualizarTarea = (tarea) => {
            this.props.updateTareaFase(
                tarea_id,
                {...tarea, ...datos},
                {callback: () => this.cargarTareasPendientes()}
            )
        };
        this.props.fetchTareaFase(tarea_id, {callback: actualizarTarea})
    }

    cargarDatos() {
        this.cargarTareasPendientes();
    }

    cargarTareasPendientes() {
        this.props.fetchMisPendientesTareasFases();
    }

    cambiarFiltroPendientes(filtro) {
        this.setState(filtro);
    }

    obtenerListaTareas(tareas) {
        const {estado, literal} = this.state;
        let lista = tareas;
        if (literal !== null) {
            lista = _.pickBy(lista, t => t.literal === literal);
        }
        if (estado !== null) {
            lista = _.pickBy(lista, t => t.estado === estado);
        }
        return lista;
    }

    componentWillUnmount() {
        this.props.clearTareasFases();
    }


    componentDidMount() {
        this.cargarDatos();
        this.setState({
            estado: null,
            literal: null
        });
    }

    render() {
        const {
            table_style,
            fases_tareas,
            modo = 1,
            cargarDatos
        } = this.props;
        const {estado, literal} = this.state;

        let tareas = _.pickBy(fases_tareas, e => e.soy_asignado);
        if (modo === 2) {
            tareas = _.pickBy(fases_tareas, e => e.soy_responsable && !e.soy_asignado);
        }

        const lista_tareas_actual = this.obtenerListaTareas(tareas);

        return (
            <Fragment>
                <div className="col-12 text-center">
                    <h3>{modo === 1 ? 'Mis Tareas' : 'Para Supervisar'}</h3>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                    <TareasAsignadasPanel
                        estado={estado}
                        literal={literal}
                        tareas_asignadas={tareas}
                        cambiarFiltroPendientes={this.cambiarFiltroPendientes}
                        table_style={table_style}
                    />
                </div>
                <div className="col-12 col-md-8 col-lg-9">
                    <table style={table_style.table} className='table table-responsive table-striped'>
                        <thead>
                        <tr>
                            <th style={table_style.th}>Literal</th>
                            <th style={table_style.th}>Descripción</th>
                            <th style={table_style.th}>Estado</th>
                            {
                                modo === 2 &&
                                <th style={table_style.th}>Asignado</th>
                            }
                            <th style={table_style.th}>Fecha Límite</th>
                        </tr>
                        </thead>
                        <tbody>
                        {_.map(
                            _.orderBy(
                                lista_tareas_actual,
                                ['fecha_limite'],
                                ['asc']
                            ), e => {
                                return (
                                    <TareaListItem
                                        modo={modo}
                                        fila={e}
                                        table_style={table_style}
                                        key={e.id}
                                        actualizarTarea={this.actualizarTarea}
                                    />
                                )
                            })}
                        </tbody>
                        <tfoot>

                        </tfoot>
                    </table>
                </div>
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
        mi_cuenta: state.mi_cuenta,
        fases_tareas: state.fases_tareas,
    }
}

export default connect(mapPropsToState, actions)(TareasPendientesList)
