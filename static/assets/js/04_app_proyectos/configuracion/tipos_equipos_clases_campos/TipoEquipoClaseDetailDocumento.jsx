import React from "react";
import {useDispatch} from "react-redux";
import ArchivosTipoEquipoList from "../../../00_utilities/components/ui/FileList";
import * as actions from "../../../01_actions/01_index";

const TipoEquipoClaseDetailDocumento = props => {
    const {tipo_equipo_clase: {documentos, id}, permisos, cargarTipoEquipo} = props;
    const dispatch = useDispatch();
    const onUploadFile = (valores, callback) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoTipoEquipoClase(
                    id,
                    valores.id,
                    valores.nombre_archivo,
                    {
                        callback
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
                actions.uploadArchivoTipoEquipoClase(
                    id,
                    formData,
                    {
                        callback: () => {
                            dispatch(actions.fetchTipoEquipoClase(id, {
                                callback: () => {
                                    dispatch(actions.notificarAction(`La ha subido el archivo para el proyecto`));
                                    callback();
                                }
                            }))
                        }
                    }
                )
            )
        }
    };
    const onDeleteFile = (archivo_id, callback) => {
        dispatch(
            actions.deleteArchivoTipoEquipoClase(
                id,
                archivo_id,
                {
                    callback: () => {
                        cargarTipoEquipo();
                        callback();
                    }
                }
            )
        )
    };
    return (
        <ArchivosTipoEquipoList
            lista_documentos={documentos}
            permisos={permisos}
            onUploadFile={onUploadFile}
            onDeleteFile={onDeleteFile}
        />
    )
};

export default TipoEquipoClaseDetailDocumento;