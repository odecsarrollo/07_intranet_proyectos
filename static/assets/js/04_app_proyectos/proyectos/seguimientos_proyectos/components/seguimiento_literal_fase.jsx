import React, {Component, Fragment} from 'react';
import FormAddTarea from './forms/add_tarea_form';
import {fechaFormatoDos, fechaFormatoUno} from "../../../../00_utilities/common";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import CargueTareas from './cargue_tareas';

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

class FaseLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrar_add_tareas: false,
            tarea_seleccionada: null,
        };
        this.addTarea = this.addTarea.bind(this);
        this.deleteTarea = this.deleteTarea.bind(this);
        this.cargarTareasFase = this.cargarTareasFase.bind(this);
    }

    addTarea(tarea) {
        const {fase, notificarErrorAjaxAction} = this.props;
        const nueva_tarea = {...tarea, fase_literal: fase.id};
        this.props.createTareaFase(nueva_tarea, () => this.cargarTareasFase(), notificarErrorAjaxAction);
    }

    cargarTareasFase() {
        const {fase, cargando, noCargando, fetchTareasFases_x_literal, fetchFaseLiteral, notificarErrorAjaxAction} = this.props;
        cargando();
        this.setState({mostrar_add_tareas: false});
        const cargarTareas = () => fetchTareasFases_x_literal(
            fase.id,
            () => {
                noCargando();
            },
            notificarErrorAjaxAction
        );
        fetchFaseLiteral(fase.id, cargarTareas, notificarErrorAjaxAction)
    }

    deleteTarea(tarea_id) {
        const {cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.deleteTareaFase(
            tarea_id,
            () => this.cargarTareasFase(),
            notificarErrorAjaxAction
        );
    }

    render() {
        const {
            fase,
            onSeleccionarFase,
            fase_seleccionada_id,
            fases_tareas,
            total_dias,
            dias_fase
        } = this.props;
        const {mostrar_add_tareas} = this.state;
        const mostrar_tareas = fase_seleccionada_id === fase.id;
        const onClick = () => {
            onSeleccionarFase(fase.id);
        };
        const onClickAddTarea = () => {
            this.setState(s => {
                return {mostrar_add_tareas: !s.mostrar_add_tareas, tarea_seleccionada: null}
            })
        };

        const porcentaje_completado = (fase.nro_tareas_terminadas / fase.nro_tareas).toFixed(2) * 100;
        const tiene_vencidas = fase.nro_tareas_vencidas > 0;
        const porcentaje = ((dias_fase / total_dias) * 100).toFixed(0);

        return (
            <div
                className='col-12 m-2 pr-5'
            >
                <div
                    style={{
                        width: `${porcentaje}%`,
                        height: '100%',
                        position: 'relative',
                        backgroundColor: 'lightgray',
                        borderRadius: '2px',
                    }}
                    className='puntero'
                    onClick={onClick}>
                    <div
                        style={{
                            background: `linear-gradient(to right, ${tiene_vencidas ? 'red' : 'green'} ${porcentaje_completado}%,lightgray ${1 - porcentaje}%)`,
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            border: `${tiene_vencidas ? '1px solid red' : ''}`
                        }}
                        className='p-3'
                    >
                        {/*<span>{fase.fase_nombre} ({fase.nro_tareas}) {fechaFormatoUno(fase.fecha_limite)} {fase.nro_tareas_terminadas} {porcentaje_completado}%*/}
                        {/*</span>*/}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                        }}
                    >
                        <div className='pl-2' style={{whiteSpace: 'nowrap'}}>
                            <strong>{fase.fase_nombre}</strong>
                            <span
                                className='pl-2'
                                style={{
                                    fontSize: '11px'
                                }}
                            >
                            {porcentaje_completado.toFixed(0)}% <small>({fase.nro_tareas_terminadas}/{fase.nro_tareas})</small>
                        </span>
                        </div>
                    </div>
                    <div
                        className='pl-2'
                        style={{
                            position: 'absolute',
                            bottom: '-5px',
                            right: '-65px',
                            fontSize: '11px'
                        }}
                    >
                        {fase.fecha_limite && fechaFormatoDos(fase.fecha_limite)}
                    </div>
                </div>
                {
                    mostrar_add_tareas &&
                    mostrar_tareas &&
                    <Fragment>
                        <CargueTareas
                            {...this.props}
                            cargarTareasFase={this.cargarTareasFase}
                        />
                        <FormAddTarea
                            onSubmit={this.addTarea}
                            item_seleccionado={this.state.tarea_seleccionada}
                            onCancel={() => this.setState({tarea_seleccionada: null, mostrar_add_tareas: false})}
                        />
                    </Fragment>
                }
                {
                    mostrar_tareas &&
                    <div className='m-3'>
                        <i
                            className={`fa fa-${mostrar_add_tareas ? 'minus' : 'plus'} puntero`}
                            onClick={onClickAddTarea}>
                        </i>
                        <table
                            className='table table-striped table-responsive'
                            style={table_style.table}
                        >
                            <thead>
                            <tr>
                                <th style={table_style.th}>Descripción</th>
                                <th style={table_style.th}>Fecha Entrega</th>
                                <th style={table_style.th}>Terminada</th>
                                <th style={table_style.th}>Eliminar</th>
                                <th style={table_style.th}>Editar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _.map(_.orderBy(fases_tareas, ['fecha_limite', ['desc']]), e => {
                                    return (
                                        <tr key={e.id} style={{color: `${e.vencido ? 'red' : ''}`}}>
                                            <td style={table_style.td}>{e.descripcion}</td>
                                            <td style={table_style.td}>{fechaFormatoUno(e.fecha_limite)}</td>
                                            <td style={table_style.td} className='text-center'>
                                                {
                                                    e.terminado &&
                                                    <i className='fas fa-check-circle'
                                                       style={{color: 'green'}}></i>
                                                }
                                            </td>
                                            <td style={table_style.td}>
                                                <MyDialogButtonDelete
                                                    onDelete={() => {
                                                        this.deleteTarea(e.id)
                                                    }}
                                                    element_name={e.descripcion}
                                                    element_type='tarea'
                                                />
                                            </td>
                                            <td style={table_style.td}>
                                                <i
                                                    className='fas fa-edit puntero'
                                                    onClick={() => {
                                                        this.setState({tarea_seleccionada: e, mostrar_add_tareas: true})
                                                    }}
                                                >
                                                </i>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        )
    }
}

export default FaseLiteral;