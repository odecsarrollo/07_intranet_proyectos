import React from 'react';
import * as actions from "../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import ArchivosCotizacionList from '../../../00_utilities/components/ui/FileList';

const ProyectoDetailDocumento = (props) => {
    const {proyecto: {mis_documentos, id}, permisos, cargarProyecto} = props;
    const dispatch = useDispatch();
    const onUploadFile = (valores, callback) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoProyecto(
                    valores.id,
                    valores,
                    {
                        callback: () => {
                            dispatch(actions.fetchProyecto(id, {callback}))
                        }
                    }
                )
            )
        } else {
            onUploadArchivo(valores, callback);
        }
    };

    const onUploadArchivo = (e, callback) => {
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            dispatch(
                actions.uploadArchivoProyecto(
                    id,
                    formData,
                    {
                        callback:
                            () => {
                                dispatch(
                                    actions.fetchProyecto(
                                        id,
                                        {
                                            callback: () => {
                                                dispatch(actions.notificarAction(`La ha subido el archivo para el proyecto`));
                                                callback()
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
    const onDeleteFile = (archivo_id, callback) => {
        dispatch(
            actions.deleteArchivoProyecto(
                archivo_id,
                {
                    callback: () => {
                        cargarProyecto();
                        callback();
                    }
                }
            )
        )
    };
    return (
        <ArchivosCotizacionList
            lista_documentos={mis_documentos}
            permisos={permisos}
            onUploadFile={onUploadFile}
            onDeleteFile={onDeleteFile}
        />
    )
};

export default ProyectoDetailDocumento;