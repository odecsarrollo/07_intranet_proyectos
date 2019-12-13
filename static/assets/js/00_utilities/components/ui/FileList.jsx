import React, {memo, useState, Fragment} from 'react';
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import {fechaFormatoUno, formatBytes} from "../../../00_utilities/common";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from "prop-types";
import UploadDocumentoForm from "../../../05_app_ventas_proyectos/cotizaciones/cotizaciones/forms/UploadArchivoForm";

const FileListItem = memo(props => {
    const {
        onDeleteArchivo,
        setItemSeleccionado,
        setAdicionarDocumento,
        permisos,
        item,
        item: {
            id,
            nombre_archivo,
            extension,
            size,
            created,
            creado_por_username,
            archivo_url
        }
    } = props;

    return (
        <tr>
            <td style={{padding: '4px'}}>{nombre_archivo}</td>
            <td style={{padding: '4px'}}>.{extension.toUpperCase()}</td>
            <td style={{padding: '4px'}}>{formatBytes(size, 1)}</td>
            <td style={{padding: '4px'}}>{fechaFormatoUno(created)}</td>
            <td style={{padding: '4px'}}>{creado_por_username}</td>
            <td style={{padding: '2px'}} className='text-center'>
                <a href={archivo_url}>
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
                permisos.change &&
                <td style={{padding: '2px'}} className='text-center'>
                    <IconButton
                        style={{
                            margin: 0,
                            padding: 4,
                        }}
                        onClick={() => {
                            setItemSeleccionado(item);
                            setAdicionarDocumento(true);
                        }}
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
                permisos.delete &&
                <td style={{padding: '2px'}} className='text-center'>
                    <MyDialogButtonDelete
                        onDelete={() => {
                            onDeleteArchivo(id, () => setItemSeleccionado(null))
                        }}
                        element_name={nombre_archivo}
                        element_type='Archivo'
                    />
                </td>
            }
        </tr>
    )
});

const FileList = memo(props => {
    const {
        permisos,
        lista_documentos,
        onDeleteFile = null,
        onUploadFile = null
    } = props;
    const [item_seleccionado, setItemSeleccionado] = useState(null);
    const [adicionar_documento, setAdicionarDocumento] = useState(false);
    return (
        <Fragment>
            {adicionar_documento && <UploadDocumentoForm
                onSubmit={v =>
                    onUploadFile(v, () => {
                        setAdicionarDocumento(false);
                        setItemSeleccionado(null);
                    })}
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
                    {permisos.change && <th style={{padding: '2px'}}>Editar</th>}
                    {permisos.delete && <th style={{padding: '2px'}}>Eliminar</th>}
                </tr>
                </thead>
                <tbody>
                {lista_documentos.map(e => <FileListItem
                    item={e} key={e.id}
                    permisos={permisos}
                    onDeleteArchivo={onDeleteFile}
                    setAdicionarDocumento={setAdicionarDocumento}
                    setItemSeleccionado={setItemSeleccionado}
                />)}
                </tbody>
            </table>
        </Fragment>
    )
});

FileList.propTypes = {
    lista_documentos: PropTypes.array,
    onDeleteFile: PropTypes.func,
    permisos: PropTypes.object,
    onUploadFile: PropTypes.func
};

export default FileList;