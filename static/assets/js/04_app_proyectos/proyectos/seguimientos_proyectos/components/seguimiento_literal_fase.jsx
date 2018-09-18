import React, {Component} from 'react';
import FormAddTarea from './forms/add_tarea_form';
import {fechaFormatoUno} from "../../../../00_utilities/common";

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
        this.state = {mostrar_add_tareas: false};
        this.addTarea = this.addTarea.bind(this);
    }

    addTarea(tarea) {
        const {fase} = this.props;
        const nueva_tarea = {...tarea, fase_literal: fase.id};
        this.props.createTareaFase(nueva_tarea);
    }

    render() {
        const {fase, onSeleccionarFase, fase_seleccionada_id, fases_tareas} = this.props;
        const {mostrar_add_tareas} = this.state;
        const mostrar_tareas = fase_seleccionada_id === fase.id;
        const onClick = () => {
            onSeleccionarFase(fase.id);
        };
        const onClickAddTarea = () => {
            this.setState(s => {
                return {mostrar_add_tareas: !s.mostrar_add_tareas}
            })
        };
        return (
            <div className='col-12'>
                <span onClick={onClick} className='puntero'>{fase.fase_nombre}</span>
                {
                    mostrar_add_tareas &&
                    <FormAddTarea onSubmit={this.addTarea}/>
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
                            </tr>
                            </thead>
                            <tbody>
                            {
                                _.map(fases_tareas, e => {
                                    return (
                                        <tr key={e.id}>
                                            <td style={table_style.td}>{e.descripcion}</td>
                                            <td style={table_style.td}>{fechaFormatoUno(e.fecha_limite)}</td>
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