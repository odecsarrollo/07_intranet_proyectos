import React, {Component, Fragment} from 'react';
import {fechaHoraFormatoUno, fechaFormatoUno} from "../../../../00_utilities/common";
import FormTarea from "./forms/tarea_form";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Tarea = (props) => {
    const {tarea, eliminarSeguimiento, actualizarSeguimiento, cotizacion} = props;
    const mi_cuenta = JSON.parse(localStorage.getItem('mi_cuenta'));
    const es_usuario_que_creo = mi_cuenta.id === tarea.creado_por;
    const es_responsable = cotizacion.responsable === mi_cuenta.id;
    const puede_cambiar_estado_tarea = es_usuario_que_creo || es_responsable;
    return (
        <div className="card mt-2">
            <div className="card-heading p-2"
                 style={{
                     backgroundColor: `${tarea.tarea_terminada ? 'lightgray' : 'red'}`,
                     color: `${tarea.tarea_terminada ? 'black' : 'white'}`,
                 }}
            >
                <div className="row">
                    <div className='col-11'>
                        <strong>{tarea.nombre_tarea} </strong>
                    </div>
                    <div className='col-1 text-right'>
                        {es_usuario_que_creo &&
                        <span className='puntero' onClick={() => eliminarSeguimiento(tarea.id)}>x</span>}
                    </div>
                </div>
            </div>
            <div className="card-body p-3">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <strong>Fecha Inicio: </strong>{fechaFormatoUno(tarea.fecha_inicio_tarea)}<br/>
                    </div>
                    <div className="col-12 col-md-6">
                        {tarea.fecha_fin_tarea &&
                        <Fragment><strong>Fecha Fin: </strong>{fechaFormatoUno(tarea.fecha_fin_tarea)}<br/></Fragment>}
                    </div>
                    <div className="col-12">
                        <div className='pl-2' style={{color: 'gray'}}>
                            {tarea.observacion}
                        </div>
                    </div>
                </div>
            </div>
            <div className='card-footer' style={{fontSize: "0.8rem"}}>
                <div className="row">
                    <div className="col-12 col-md-4">
                        <strong>Creado por: </strong>{tarea.creado_por_username}
                    </div>
                    <div className="col-12 col-md-4">
                        <strong>Hora creación: </strong>{fechaHoraFormatoUno(tarea.created)}
                    </div>
                    <div className="col-12 col-md-4 text-right">
                        <strong>Completada: </strong>
                        {
                            puede_cambiar_estado_tarea ?
                                <i
                                    className={`${tarea.tarea_terminada ? 'fas' : 'far'} fa${tarea.tarea_terminada ? '-check' : ''}-square puntero`}
                                    onClick={() => actualizarSeguimiento({
                                        ...tarea,
                                        tarea_terminada: !tarea.tarea_terminada
                                    })}
                                >
                                </i> :
                                <i className={`${tarea.tarea_terminada ? 'fas' : 'far'} fa${tarea.tarea_terminada ? '-check' : '-times'}`}>
                                </i>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default class TareasList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mostrar_formulario: false
        }
    }

    render() {
        const {seguimiento_list, guardarTarea} = this.props;
        const {mostrar_formulario} = this.state;
        const tareas_pendientes = _.map(_.pickBy(seguimiento_list, s => {
            return s.tipo_seguimiento === 2 && !s.tarea_terminada
        })).length;
        const tareas_array = _.map(_.orderBy(_.pickBy(seguimiento_list, s => s.tipo_seguimiento === 2), ['tarea_terminada', 'fecha_inicio_tarea'], ['asc', 'asc']));
        return (
            <div className="col-xs-12">
                <div className="page-header">
                    <h1 className='m-0'>Tareas</h1>
                    {
                        tareas_pendientes > 0 &&
                        <span className="badge badge-pill badge-primary">
                            {tareas_pendientes}{tareas_pendientes > 1 ? ' pendientes' : ' pendiente'}
                            </span>
                    }
                    <div>
                        <FontAwesomeIcon
                            className='puntero'
                            icon={`${mostrar_formulario ? 'minus' : 'plus'}-circle`}
                            onClick={() => {
                                this.setState((s, p) => {
                                    return {
                                        mostrar_formulario: !s.mostrar_formulario
                                    }
                                })
                            }}
                        />
                    </div>
                </div>
                {
                    mostrar_formulario &&
                    <div className="col-12">
                        <FormTarea onSubmit={(v) => {
                            guardarTarea(v);
                            this.setState({mostrar_formulario: false});
                        }}/>
                    </div>
                }
                {tareas_array.map(tarea => <Tarea key={tarea.id}
                                                  tarea={tarea}
                                                  {...this.props}/>
                )}

            </div>
        )
    }
}