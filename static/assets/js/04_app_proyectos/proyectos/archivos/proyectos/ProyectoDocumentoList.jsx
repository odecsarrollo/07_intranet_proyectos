import React, {Fragment, useState} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux";
import UploadDocumentoForm from '../forms/UploadArchivoForm';
import ArchivosList from '../components/ProyectoDocumentoList';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const PanelArchivosProyectos = (props) => {
    const {cargarProyecto, proyecto, permisos_archivos_proyecto} = props;
    const {mis_documentos} = proyecto;
    const dispatch = useDispatch();
    const [adicionar_documento, setAdicionarDocumento] = useState(false);
    const [item_seleccionado, setItemSeleccionado] = useState(null);

    const onSelectArchivo = (item_seleccionado) => {
        setItemSeleccionado(item_seleccionado);
        setAdicionarDocumento(true);
    };

    const onDeleteArchivo = (archivo_id) => {
        dispatch(actions.deleteArchivoProyecto(archivo_id, {callback: cargarProyecto}));
    };

    const onUploadArchivo = (e) => {
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            dispatch(
                actions.uploadArchivoProyecto(
                    proyecto.id,
                    formData,
                    {
                        callback:
                            () => {
                                cargarProyecto();
                                dispatch(actions.notificarAction(`La ha subido el archivo para el proyecto`));
                                setAdicionarDocumento(false);
                            }
                    }
                )
            )
        }
    };

    const onSubmitUploadArchivo = (valores) => {
        const {id} = valores;
        if (id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoProyecto(id, valores, {
                        callback:
                            () => {
                                setAdicionarDocumento(false)
                            }
                    }
                )
            )
        } else {
            onUploadArchivo(valores);
        }
    };


    return (
        <Fragment>
            {
                permisos_archivos_proyecto.add &&
                <FontAwesomeIcon
                    className='puntero'
                    icon={`${adicionar_documento ? 'minus' : 'plus'}-circle`}
                    onClick={() => {
                        setAdicionarDocumento(!adicionar_documento);
                        setItemSeleccionado(null);

                    }}
                />
            }
            {
                adicionar_documento &&
                <UploadDocumentoForm
                    onSubmit={onSubmitUploadArchivo}
                    initialValues={item_seleccionado}
                />
            }
            <ArchivosList
                permisos={permisos_archivos_proyecto}
                lista={mis_documentos}
                onDeleteArchivo={onDeleteArchivo}
                onSelectElemento={onSelectArchivo}
            />
        </Fragment>
    )
};

export default PanelArchivosProyectos;