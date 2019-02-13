import React, {Component} from 'react';
import FormAddTarea from './forms/add_tarea_form';
import {fechaFormatoDos} from "../../../../00_utilities/common";
import CargueTareas from './cargue_tareas';
import ResponsableFaseLiteral from './adicionar_responsable';
import TareasFase from './tareas_fase_table';
import moment from "moment-timezone";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class FaseLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrar_add_tareas: false,
            tarea_seleccionada: null,
            selecciono_todas: false,
            tareas_seleccionadas: [],
            distancia_separadores: 10,
        };
        this.addTarea = this.addTarea.bind(this);
        this.deleteTarea = this.deleteTarea.bind(this);
        this.cargarTareasFase = this.cargarTareasFase.bind(this);
        this.seleccionarTodasTareas = this.seleccionarTodasTareas.bind(this);
        this.adicionarQuitarTareasSeleccionadas = this.adicionarQuitarTareasSeleccionadas.bind(this);
        this.cambiarResponsable = this.cambiarResponsable.bind(this);
        this.cambiarAsignadoTarea = this.cambiarAsignadoTarea.bind(this);
        this.eliminarTareasSelecionadas = this.eliminarTareasSelecionadas.bind(this);
    }

    eliminarTareasSelecionadas() {
        const {fase} = this.props;
        this.props.deleteListaTareasFaseLitera(
            fase.id,
            this.state.tareas_seleccionadas,
            {
                callback:
                    () => {
                        this.cargarTareasFase();
                        this.setState({selecciono_todas: false, tareas_seleccionadas: []})
                    }
            }
        );
    }

    seleccionarTodasTareas() {
        const {fases_tareas} = this.props;
        let tareas_seleccionadas = [];
        this.setState({tareas_seleccionadas});
        this.setState(s => {
            if (!s.selecciono_todas) {
                _.map(fases_tareas, e => {
                    tareas_seleccionadas = [...tareas_seleccionadas, e.id];
                })
            }
            return {selecciono_todas: !s.selecciono_todas, tareas_seleccionadas}
        });
    }

    adicionarQuitarTareasSeleccionadas(tarea_id) {
        let tareas_seleccionadas = this.state.tareas_seleccionadas;
        if (this.state.tareas_seleccionadas.includes(tarea_id)) {
            tareas_seleccionadas = tareas_seleccionadas.filter(e => e !== tarea_id);
        } else {
            tareas_seleccionadas = [...tareas_seleccionadas, tarea_id];
        }
        this.setState({tareas_seleccionadas, selecciono_todas: false});
    }

    seleccionarTodas(tarea_id) {
        let tareas_seleccionadas = this.state.tareas_seleccionadas;
        if (this.state.tareas_seleccionadas.includes(tarea_id)) {
            tareas_seleccionadas = tareas_seleccionadas.filter(e => e !== tarea_id);
        } else {
            tareas_seleccionadas = [...tareas_seleccionadas, tarea_id];
        }
        this.setState({tareas_seleccionadas});
    }

    addTarea(tarea) {
        const {fase} = this.props;
        if (tarea.id) {
            this.props.updateTareaFase(tarea.id, tarea, {callback: () => this.cargarTareasFase()});
        } else {
            const nueva_tarea = {...tarea, fase_literal: fase.id};
            this.props.createTareaFase(nueva_tarea, {callback: () => this.cargarTareasFase()});
        }
    }

    cargarTareasFase() {
        const {fase} = this.props;
        this.setState({mostrar_add_tareas: false});
        const cargarTareas = () => this.props.fetchTareasFases_x_literal(fase.id);
        this.props.fetchFaseLiteral(fase.id, {callback: cargarTareas})
    }

    deleteTarea(tarea_id) {
        this.props.deleteTareaFase(tarea_id, {callback: () => this.cargarTareasFase()});
    }

    cambiarResponsable(responsable, callback) {
        const {fase} = this.props;
        const actualizarFaseLiteral = () => this.props.updateFaseLiteral(fase.id, {...fase, responsable}, {callback});
        this.props.fetchFaseLiteral(fase.id, {callback: actualizarFaseLiteral});
    }

    cambiarAsignadoTarea(tarea, asignado_a, callback = null) {
        const actualizarTareaFase = (response) => this.props.pdateTareaFase(tarea.id, {
            ...response,
            asignado_a
        }, {callback});
        this.props.fetchTareaFase(tarea.id, {callback: actualizarTareaFase});
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
            actualizarTarea,
            fecha_minima
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
        const fecha_inicial_fase = moment(fase.fecha_inicial);
        const dias_a_correr = parseInt(fecha_inicial_fase.diff(fecha_minima, "days"));
        const porcentaje_a_correr = ((dias_a_correr / total_dias) * 100).toFixed(0);
        const tiene_tareas_seleccionadas = _.size(this.state.tareas_seleccionadas) > 0;

        const color = fase.fase_color;
        const color_letra = fase.fase_color_letra;
        const color_letra_borde = color_letra === 'black' ? 'white' : 'black';


        return (
            <div className='mt-1 mb-1' style={{borderRadius: '2px'}}>
                <div
                    style={{
                        width: `${porcentaje}%`,
                        height: '100%',
                        position: 'relative',
                        backgroundColor: color,
                        borderRadius: '2px',
                        marginLeft: `${porcentaje_a_correr}%`,
                    }}
                    className='puntero'
                    onClick={onClick}>
                    <div
                        style={{
                            background: color,
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            padding: '10px'
                        }}
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
                        <div className='pl-2' style={{
                            whiteSpace: 'nowrap',
                            fontSize: '12px',
                            color: color_letra,
                            textShadow: `-1px 0 ${color_letra_borde}, 0 1px ${color_letra_borde}, 1px 0 ${color_letra_borde}, 0 -1px ${color_letra_borde}`
                        }}>
                            <strong>{fase.fase_nombre}</strong>
                            <span
                                className='pl-2'
                                style={{
                                    fontSize: '10px'
                                }}
                            >
                            {porcentaje_completado.toFixed(0)}% <small>({fase.nro_tareas_terminadas}/{fase.nro_tareas})</small>
                        </span>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        width: `${porcentaje}%`,
                        height: '3px',
                        position: 'relative',
                        backgroundColor: 'lightgray',
                        marginLeft: `${porcentaje_a_correr}%`
                    }}
                >
                    <div
                        style={{
                            background: `linear-gradient(to right, ${tiene_vencidas ? 'red' : 'green'} ${porcentaje_completado}%,lightgray ${1 - porcentaje}%)`,
                            borderRadius: '2px',
                            transition: 'all .2s ease-out',
                            border: `${tiene_vencidas ? '1px solid red' : ''}`,
                            height: '100%'
                        }}
                    >
                        {/*<span>{fase.fase_nombre} ({fase.nro_tareas}) {fechaFormatoUno(fase.fecha_limite)} {fase.nro_tareas_terminadas} {porcentaje_completado}%*/}
                        {/*</span>*/}
                    </div>
                    <div
                        className='pl-2'
                        style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '-53px',
                            fontSize: '9px',
                        }}
                    >
                        {fase.fecha_limite && fechaFormatoDos(fase.fecha_limite)}
                    </div>
                </div>
                <div style={{marginLeft: `${porcentaje_a_correr}%`}}>
                    {
                        mostrar_add_tareas &&
                        mostrar_tareas &&
                        (
                            puede_adicionar_tareas ||
                            puede_editar_tareas
                        ) &&
                        <div className='pl-2 pt-1' style={{width: '600px'}}>
                            <CargueTareas
                                {...this.props}
                                cargarTareasFase={this.cargarTareasFase}
                            />
                            <FormAddTarea
                                miembros_literales_list={miembros_literales_list}
                                onSubmit={this.addTarea}
                                item_seleccionado={this.state.tarea_seleccionada}
                                onCancel={() => this.setState({tarea_seleccionada: null, mostrar_add_tareas: false})}
                            />
                        </div>
                    }
                    {
                        mostrar_tareas &&
                        <div className='m-3' style={{width: '1000px'}}>
                            <ResponsableFaseLiteral
                                cambiarResponsable={this.cambiarResponsable}
                                miembros_literales_list={miembros_literales_list}
                                fase={fase}
                                administra_proyectos={administra_proyectos}
                            />
                            {
                                puede_adicionar_tareas &&
                                <FontAwesomeIcon
                                    className='puntero'
                                    icon={`${mostrar_add_tareas ? 'minus' : 'plus'}-circle`}
                                    onClick={onClickAddTarea}
                                />
                            }
                            <TareasFase
                                seleccionarTodasTareas={this.seleccionarTodasTareas}
                                selecciono_todas={this.state.selecciono_todas}
                                adicionarQuitarTareasSeleccionadas={this.adicionarQuitarTareasSeleccionadas}
                                tareas_seleccionadas={this.state.tareas_seleccionadas}
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
                    {
                        tiene_tareas_seleccionadas &&
                        mostrar_tareas &&
                        <div className='text-right'>
                            <FontAwesomeIcon
                                icon={'trash'}
                                className='puntero'
                                onClick={() => this.eliminarTareasSelecionadas()}
                            />
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default FaseLiteral;