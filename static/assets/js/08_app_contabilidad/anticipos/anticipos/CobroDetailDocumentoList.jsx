import React, {memo} from 'react';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import {fechaFormatoUno, formatBytes} from "../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from "@material-ui/core/Checkbox";

const CobroDetailDocumentoListItem = memo(props => {
    return (
        <tr>
            <td style={{padding: '4px'}}>{props.item.nombre_archivo}</td>
            <td style={{padding: '4px'}}>.{props.item.extension.toUpperCase()}</td>
            <td style={{padding: '4px'}}>{formatBytes(props.item.size, 1)}</td>
            <td style={{padding: '4px'}}>{fechaFormatoUno(props.item.created)}</td>
            <td style={{padding: '4px'}}>{props.item.creado_por_username}</td>
            <td style={{padding: '2px'}} className='text-center'>
                <a href={props.item.archivo_url} target="_blank">
                    <IconButton
                        style={{
                            margin: 0,
                            padding: 4,
                        }}
                    >
                        <FontAwesomeIcon
                            className='puntero'
                            icon='download'
                            size='xs'
                        />
                    </IconButton>
                </a>
            </td>
            {
                props.permisos.change &&
                <td style={{padding: '2px'}} className='text-center'>
                    <IconButton
                        style={{
                            margin: 0,
                            padding: 4,
                        }}
                        onClick={() => props.onSelectElemento(props.item)}
                    >
                        <FontAwesomeIcon
                            className='puntero'
                            icon='edit'
                            size='xs'
                        />
                    </IconButton>
                </td>

            }

            {
                props.permisos.delete &&
                <td style={{padding: '2px'}} className='text-center'>
                    <MyDialogButtonDelete
                        onDelete={() => {
                            props.onDeleteArchivo(props.item.id)
                        }}
                        element_name={props.item.nombre_archivo}
                        element_type='Archivo'
                    />
                </td>
            }
            {
                props.permisos.change &&
                <td style={{padding: '2px'}} className='text-center'>
                    <Checkbox
                        checked={props.item.enviar_por_correo}
                        style={{margin: 0, padding: 0}}
                        color='primary'
                        onClick={() => {
                            props.onEnviarPorEmail(props.item.id, {
                                ...props.item,
                                enviar_por_correo: !props.item.enviar_por_correo
                            })
                        }}
                    />
                </td>

            }
        </tr>
    )
});

const CobroDetailDocumentoList = memo(props => {
    const {
        lista,
        onDeleteArchivo,
        onSelectElemento,
        onEnviarPorEmail,
        permisos
    } = props;
    let size = 0;
    return (
        <table className='table table-responsive table-striped' style={{fontSize: '11px'}}>
            <thead>
            <tr>
                <th style={{padding: '2px'}}>Nombre</th>
                <th style={{padding: '2px'}}>Extensión</th>
                <th style={{padding: '2px'}}>Tamaño</th>
                <th style={{padding: '2px'}}>Fecha</th>
                <th style={{padding: '2px'}}>Usuario</th>
                <th style={{padding: '2px'}}>Link</th>
                {
                    permisos.change &&
                    <th style={{padding: '2px'}}>Editar</th>
                }
                {
                    permisos.delete &&
                    <th style={{padding: '2px'}}>Eliminar</th>
                }
                <th style={{padding: '2px'}}>Enviar por Email</th>
            </tr>
            </thead>
            <tbody>
            {_.map(lista, e => {
                if (e.id) {
                    if (e.enviar_por_correo) {
                        size += e.size
                    }
                    return (
                        <CobroDetailDocumentoListItem
                            onEnviarPorEmail={onEnviarPorEmail}
                            item={e}
                            key={e.id}
                            permisos={permisos}
                            onDeleteArchivo={onDeleteArchivo}
                            onSelectElemento={onSelectElemento}
                        />
                    )
                }
            })}
            </tbody>
            <tfoot>
            <tr>
                <td colSpan={3}>Tamaño a Enviar: {formatBytes(size)}</td>
            </tr>
            </tfoot>
        </table>
    )
});

export default CobroDetailDocumentoList;