import React, {Component, Fragment} from 'react';
import FormAddTarea from './forms/add_tarea_form';
import {fechaFormatoDos} from "../../../../00_utilities/common";
import CargueTareas from './cargue_tareas';
import ResponsableFaseLiteral from './adicionar_responsable';
import TareasFase from './tareas_fase_table';

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
        this.cambiarResponsable = this.cambiarResponsable.bind(this);
        this.cambiarAsignadoTarea = this.cambiarAsignadoTarea.bind(this);
    }

    addTarea(tarea) {
        const {
            fase,
            notificarErrorAjaxAction,
            updateTareaFase,
            createTareaFase
        } = this.props;
        if (tarea.id) {
            updateTareaFase(tarea.id, tarea, () => this.cargarTareasFase(), notificarErrorAjaxAction);
        } else {
            const nueva_tarea = {...tarea, fase_literal: fase.id};
            createTareaFase(nueva_tarea, () => this.cargarTareasFase(), notificarErrorAjaxAction);
        }
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

    cambiarResponsable(responsable, callback) {
        const {
            fase,
            cargando,
            noCargando,
            fetchFaseLiteral,
            updateFaseLiteral,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        const actualizarFaseLiteral = () => updateFaseLiteral(
            fase.id,
            {...fase, responsable},
            () => {
                callback();
                noCargando();
            },
            notificarErrorAjaxAction
        );
        fetchFaseLiteral(fase.id, actualizarFaseLiteral, notificarErrorAjaxAction);
    }

    cambiarAsignadoTarea(tarea, asignado_a, callback = null) {
        const {
            cargando,
            noCargando,
            fetchTareaFase,
            updateTareaFase,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        const actualizarTareaFase = (response) => updateTareaFase(
            tarea.id,
            {...response, asignado_a},
            () => {
                callback();
                noCargando();
            },
            notificarErrorAjaxAction
        );
        fetchTareaFase(tarea.id, actualizarTareaFase, notificarErrorAjaxAction);
    }

    render() {
        const {
            fase,
            onSeleccionarFase,
            fase_seleccionada_id,
            miembros_literales_list,
            fases_tareas,
            total_dias,
            dias_fase,
            table_style,
            puede_adicionar_tareas,
            administra_proyectos,
            puede_editar_tareas,
            puede_eliminar_tareas,
            soy_responsable,
            mi_id_usuario,
            actualizarTarea
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

        const porcentaje_completado = fase.nro_tareas > 0 ? (fase.nro_tareas_terminadas / fase.nro_tareas).toFixed(2) * 100 : 0;
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
                    (
                        puede_adicionar_tareas ||
                        puede_editar_tareas
                    ) &&
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
                        <ResponsableFaseLiteral
                            cambiarResponsable={this.cambiarResponsable}
                            miembros_literales_list={miembros_literales_list}
                            fase={fase}
                            administra_proyectos={administra_proyectos}
                        />
                        {
                            puede_adicionar_tareas &&
                            <i
                                className={`fa fa-${mostrar_add_tareas ? 'minus' : 'plus'} puntero`}
                                onClick={onClickAddTarea}>
                            </i>
                        }
                        <TareasFase
                            actualizarTarea={actualizarTarea}
                            miembros_literales_list={miembros_literales_list}
                            cambiarAsignadoTarea={this.cambiarAsignadoTarea}
                            table_style={table_style}
                            fases_tareas={fases_tareas}
                            deleteTarea={this.deleteTarea}
                            setState={this.setState.bind(this)}
                            puede_editar_tarea={puede_editar_tareas}
                            puede_eliminar_tarea={puede_eliminar_tareas}
                            soy_responsable={soy_responsable}
                            administra_proyectos={administra_proyectos}
                            mi_id_usuario={mi_id_usuario}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default FaseLiteral;