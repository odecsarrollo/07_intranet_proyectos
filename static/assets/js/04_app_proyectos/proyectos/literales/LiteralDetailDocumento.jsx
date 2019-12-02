import React from 'react';
import * as actions from "../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import ArchivosCotizacionList from '../../../00_utilities/components/ui/FileList';

const LiteralDetailDocumento = (props) => {
    const {literal, literal: {mis_documentos}, permisos, cargarLiteral} = props;
    const dispatch = useDispatch();
    const onUploadFile = (valores, callback) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoLiteral(
                    valores.id,
                    valores,
                    {
                        callback: () => {
                            cargarLiteral();
                            callback();
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
                actions.uploadArchivoLiteral(
                    literal.id,
                    formData,
                    {
                        callback:
                            () => {
                                cargarLiteral();
                                dispatch(actions.notificarAction(`La ha subido el archivo para el literal`));
                                callback()
                            }
                    }
                )
            )
        }
    };
    const onDeleteFile = (archivo_id, callback) => {
        dispatch(actions.deleteArchivoLiteral(archivo_id, {
            callback: () => {
                cargarLiteral();
                callback();
            }
        }))
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

export default LiteralDetailDocumento;