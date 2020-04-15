import React, {memo} from 'react';
import {fechaHoraFormatoUno} from "../../../00_utilities/common";
import FormComentario from "./forms/CotizacionSeguimientoComentarioForm";

import moment from 'moment-timezone';
import momentLocaliser from "react-widgets-moment";
import {useAuth} from "../../../00_utilities/hooks";

moment.tz.setDefault("America/Bogota");
moment.locale('es');
momentLocaliser(moment);

const Comentario = memo(props => {
    const {comentario, eliminarSeguimiento} = props;
    const authentication = useAuth();
    const {auth: {user}} = authentication;
    const ahora = moment(new Date);
    const creacion = moment(comentario.created);
    const tiempo_creacion = ahora.diff(creacion, "minutes");
    const es_usuario_que_creo = user.id === comentario.creado_por;
    const puede_borrar_comentario = es_usuario_que_creo && tiempo_creacion < 4;
    return (
        <div className="card mt-2">
            <div className="card-heading p-2" style={{backgroundColor: 'lightgray'}}>
                <div className="row">
                    <div className='col-11'>
                        <strong>{comentario.creado_por_username}</strong> <span
                        className="text-muted">{fechaHoraFormatoUno(comentario.created)}</span>
                    </div>
                    <div className='col-1 text-right'>
                        {puede_borrar_comentario &&
                        <span className='puntero' onClick={() => eliminarSeguimiento(comentario.id)}>x</span>}
                    </div>
                </div>
            </div>
            <div className="card-body p-3">
                {comentario.observacion}
            </div>
        </div>
    )
});

const ComentariosList = memo(props => {
    const {seguimiento_list, guardarComentario} = props;
    const comentarios_array = _.orderBy(seguimiento_list.filter(s => s.tipo_seguimiento === 0), ['id'], ['desc']);
    return (
        <div className="col-xs-12">
            <div className="page-header">
                <h1>
                    Comentarios<span className="badge badge-pill badge-primary">{comentarios_array.length}</span>
                </h1>
            </div>
            <div className="col-12">
                <FormComentario
                    onSubmit={guardarComentario}
                />
            </div>
            {comentarios_array.map(comentario =>
                <Comentario key={comentario.id}
                            comentario={comentario}
                            {...props}
                />)}

        </div>
    )
});

export default ComentariosList;