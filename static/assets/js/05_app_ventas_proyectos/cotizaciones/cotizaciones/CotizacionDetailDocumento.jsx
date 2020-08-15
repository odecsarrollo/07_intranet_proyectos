import React from 'react';
import * as actions from "../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import ArchivosCotizacionList from '../../../00_utilities/components/ui/FileList';

const CotizacionDetailDocumento = (props) => {
    const {cotizacion, cotizacion: {mis_documentos}, permisos} = props;
    const dispatch = useDispatch();
    const onUploadFile = (valores, callback) => {
        if (valores.id) {
            delete valores.archivo;
            dispatch(
                actions.updateArchivoCotizacion(
                    valores.id,
                    valores,
                    {
                        callback: () => {
                            dispatch(actions.fetchCotizacion(cotizacion.id, {callback}))
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
            formData.append('tipo', e.tipo);
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
        return dispatch(
            actions.deleteArchivoCotizacion(
                archivo_id,
                {
                    callback: () => {
                        dispatch(actions.fetchCotizacion(cotizacion.id));
                        callback();
                    }
                }
            )
        )
    };
    return (
        <ArchivosCotizacionList
            tiene_tipo={true}
            tipos_list={[{id: 'POLIZA', name: 'Póliza'}, {id: 'COTIZACION', name: 'Cotización'}]}
            lista_documentos={mis_documentos}
            permisos={permisos}
            onUploadFile={onUploadFile}
            onDeleteFile={onDeleteFile}
        />
    )
};

export default CotizacionDetailDocumento;