import React, {memo, Fragment, useState} from 'react';
import {useDispatch} from 'react-redux';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import {fechaFormatoUno, formatBytes} from "../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import * as actions from "../../../01_actions/01_index";
import UploadDocumentoForm from "../forms/UploadArchivoForm";

const CotizacionDetailDocumentoListItem = memo(props => {
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

const CotizacionDetailDocumentoList = memo(props => {
    const {
        permisos,
        cotizacion
    } = props;
    const {mis_documentos} = cotizacion;
    const dispatch = useDispatch();
    const [adicionar_documento, setAdicionarDocumento] = useState(false);
    const [item_seleccionado, setItemSeleccionado] = useState(null);
    const onSelectElemento = (item_seleccionado) => {
        setItemSeleccionado(item_seleccionado);
        setAdicionarDocumento(true);
    };
    const onDeleteArchivo = (archivo_id) => {
        dispatch(
            actions.deleteArchivoCotizacion(
                archivo_id,
                {
                    callback: () => {
                        dispatch(actions.fetchCotizacion(cotizacion.id));
                        setItemSeleccionado(null);
                    }
                }
            )
        )
    };

    const onSubmitUploadArchivo = (valores) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoCotizacion(
                    valores.id,
                    valores,
                    {
                        callback: () => {
                            dispatch(actions.fetchCotizacion(cotizacion.id, {
                                callback: () => {
                                    setAdicionarDocumento(false);
                                    setItemSeleccionado(null);
                                }
                            }))
                        }
                    }
                )
            )
        } else {
            onUploadArchivo(valores);
        }
    };

    const onUploadArchivo = (e) => {
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            dispatch(
                actions.uploadArchivoCotizacion(
                    cotizacion.id,
                    formData,
                    {
                        callback:
                            () => {
                                dispatch(
                                    actions.fetchCotizacion(
                                        cotizacion.id,
                                        {
                                            callback: () => {
                                                dispatch(actions.notificarAction(`La ha subido el archivo para la cotizacion ${cotizacion.nro_cotizacion ? cotizacion.nro_cotizacion : cotizacion.id}`));
                                                setAdicionarDocumento(false);
                                                setItemSeleccionado(null);
                                            }
                                        }
                                    )
                                )
                            }
                    }
                )
            )
        }
    };

    return (
        <Fragment>
            {adicionar_documento && <UploadDocumentoForm
                onSubmit={onSubmitUploadArchivo}
                initialValues={item_seleccionado}
            />}
            {permisos.add && <FontAwesomeIcon
                className='puntero'
                icon={`${adicionar_documento ? 'minus' : 'plus'}-circle`}
                onClick={() => {
                    setAdicionarDocumento(!adicionar_documento);
                    setItemSeleccionado(null);
                }}
            />}
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
                {mis_documentos.map(e => <CotizacionDetailDocumentoListItem
                    item={e} key={e.id}
                    permisos={permisos}
                    onDeleteArchivo={onDeleteArchivo}
                    onSelectElemento={onSelectElemento}
                />)}
                </tbody>
            </table>
        </Fragment>
    )
});

export default CotizacionDetailDocumentoList;