import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import ArchivosTipoEquipoList from "../../../00_utilities/components/ui/FileList";
import * as actions from "../../../01_actions/01_index";

const EquipoDetailDocumento = props => {
    const {tipo_equipo: {documentos, id}, permisos, cargarTipoEquipo} = props;
    const dispatch = useDispatch();
    const onUploadFile = (valores, callback) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoTipoEquipo(
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
                actions.uploadArchivoTipoEquipo(
                    id,
                    formData,
                    {
                        callback: () => {
                            dispatch(actions.fetchTipoEquipo(id, {
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
            actions.deleteArchivoTipoEquipo(
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

export default EquipoDetailDocumento;