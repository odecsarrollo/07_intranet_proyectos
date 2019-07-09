import React, {memo} from 'react';
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import {fechaFormatoUno, formatBytes} from "../../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';

const ListaArchivoItem = memo(props => {
    return (
        <tr>
            <td style={{padding: '4px'}}>{props.item.nombre_archivo}</td>
            <td style={{padding: '4px'}}>.{props.item.extension.toUpperCase()}</td>
            <td style={{padding: '4px'}}>{formatBytes(props.item.size, 1)}</td>
            <td style={{padding: '4px'}}>{fechaFormatoUno(props.item.created)}</td>
            <td style={{padding: '4px'}}>{props.item.creado_por_username}</td>
            <td style={{padding: '2px'}} className='text-center'>
                <a href={props.item.archivo_url}>
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
        </tr>
    )
});

const ListaArchivosList = memo(props => {
    const {
        lista,
        onDeleteArchivo,
        onSelectElemento,
        permisos
    } = props;
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
            </tr>
            </thead>
            <tbody>
            {_.map(lista, e => <ListaArchivoItem
                item={e} key={e.id}
                permisos={permisos}
                onDeleteArchivo={onDeleteArchivo}
                onSelectElemento={onSelectElemento}
            />)}
            </tbody>
        </table>
    )
});

export default ListaArchivosList;