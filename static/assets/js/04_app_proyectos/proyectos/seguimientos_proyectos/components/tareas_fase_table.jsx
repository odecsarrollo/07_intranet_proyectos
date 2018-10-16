import React, {Component} from 'react';
import {fechaFormatoDos, fechaFormatoUno} from "../../../../00_utilities/common";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import AsignadoTareaFaseLiteral from './adicionar_asignado_a';
import TdCambiarEstadoTarea from './cambiar_estado_tarea';

export default class TareasFase extends Component {
    render() {
        const {
            fases_tareas,
            deleteTarea,
            table_style,
            setState,
            cambiarAsignadoTarea,
            miembros_literales_list,
            puede_editar_tarea,
            puede_eliminar_tarea,
            soy_responsable,
            administra_proyectos,
            mi_id_usuario,
            actualizarTarea,
            adicionarQuitarTareasSeleccionadas,
            tareas_seleccionadas
        } = this.props;
        return (
            <table
                className='table table-striped table-responsive'
                style={table_style.table}
            >
                <thead>
                <tr>
                    <th style={table_style.th}>Descripción</th>
                    <th style={table_style.th}>Opt1</th>
                    <th style={table_style.th}>Opt2</th>
                    <th style={table_style.th}>Opt3</th>
                    <th style={table_style.th}>F. Entrega</th>
                    <th style={table_style.th}>Estado</th>
                    <th style={table_style.th}>Terminada</th>
                    <th style={table_style.th}>Asignado</th>
                    {
                        puede_eliminar_tarea &&
                        <th style={table_style.th}>Eliminar</th>
                    }
                    {
                        puede_editar_tarea &&
                        <th style={table_style.th}>Editar</th>
                    }
                    <th style={table_style.th}>Seleccionar</th>
                </tr>
                </thead>
                <tbody>
                {
                    _.map(
                        _.orderBy(fases_tareas, ['fecha_limite', ['desc']]), e => {
                            const puede_cambiar_estado = administra_proyectos || (mi_id_usuario === e.asignado_a) || soy_responsable;
                            const esta_seleccionada = tareas_seleccionadas.includes(e.id);
                            return (
                                <tr key={e.id} style={{color: `${e.vencido ? 'red' : ''}`}}>
                                    <td style={table_style.td}>{e.descripcion}</td>
                                    <td style={table_style.td}>{e.campo_uno}</td>
                                    <td style={table_style.td}>{e.campo_dos}</td>
                                    <td style={table_style.td}>{e.campo_tres}</td>
                                    <td style={table_style.td}>{fechaFormatoDos(e.fecha_limite)}</td>
                                    <TdCambiarEstadoTarea
                                        fila={e}
                                        actualizarTarea={actualizarTarea}
                                        table_style={table_style}
                                        puede_cambiar_estado={puede_cambiar_estado}
                                    />
                                    <td style={table_style.td} className='text-center'>
                                        {
                                            e.terminado &&
                                            <i className='fas fa-check-circle'
                                               style={{color: 'green'}}></i>
                                        }
                                    </td>
                                    <td style={table_style.td} className='text-center'>
                                        <AsignadoTareaFaseLiteral
                                            administra_proyectos={administra_proyectos}
                                            soy_responsable={soy_responsable}
                                            tarea={e}
                                            miembros_literales_list={miembros_literales_list}
                                            cambiarAsignadoTarea={cambiarAsignadoTarea}
                                        />
                                    </td>
                                    {
                                        puede_eliminar_tarea &&
                                        <td style={table_style.td}>
                                            <MyDialogButtonDelete
                                                onDelete={() => {
                                                    deleteTarea(e.id)
                                                }}
                                                element_name={e.descripcion}
                                                element_type='tarea'
                                            />
                                        </td>
                                    }
                                    {
                                        puede_editar_tarea &&
                                        <td style={table_style.td}>
                                            <i
                                                className='fas fa-edit puntero'
                                                onClick={() => {
                                                    setState({
                                                        tarea_seleccionada: e,
                                                        mostrar_add_tareas: true
                                                    })
                                                }}
                                            >
                                            </i>
                                        </td>
                                    }
                                    <td style={table_style.td} className='text-center'>
                                        <i
                                            className={`far ${esta_seleccionada ? 'fa-check-square' : 'fa-square' } puntero`}
                                            onClick={() => adicionarQuitarTareasSeleccionadas(e.id)}
                                        >
                                        </i>
                                    </td>
                                </tr>
                            )
                        })
                }
                </tbody>
            </table>
        )
    }
};