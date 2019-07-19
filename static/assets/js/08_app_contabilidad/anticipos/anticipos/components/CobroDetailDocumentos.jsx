import React, {memo, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux/es/hooks/useDispatch";
import CobroDetailDocumentoUploadForm from './CobroDetailDocumentoUploadForm';
import CobroDetailDocumentoList from './CobroDetailDocumentoList';

const CobroDetailDocuento = memo(props => {
    const {cobro, documentos} = props;
    const [archivo_seleccionado, setArchivoSeleccionado] = useState(null);
    const [show_adicionar_archivo, setMostrarAdicionarArchivo] = useState(false);
    const dispatch = useDispatch();

    const onSubmitUploadArchivo = (valores) => {
        const {id} = valores;
        if (id) {
            delete valores.archivo;
            dispatch(
                actions.updateProformaAnticipoArchivo(id, valores, {
                        callback:
                            () => dispatch(actions.fetchProformaAnticipo(
                                cobro.id,
                                {callback: () => setMostrarAdicionarArchivo(false)})
                            )
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
                actions.uploadArchivoProformaAnticipo(
                    cobro.id,
                    formData,
                    {
                        callback:
                            () => {
                                dispatch(actions.fetchProformaAnticipo(
                                    cobro.id,
                                    {
                                        callback: () => {
                                            setMostrarAdicionarArchivo(false);
                                            setArchivoSeleccionado(null);
                                        }
                                    })
                                );
                                dispatch(actions.notificarAction(`Se ha subido el archivo`));
                            }
                    }
                )
            )
        }
    };

    const onEnviarPorEmail = (archivo_id, item) => {
        delete item.archivo;
        dispatch(actions.updateProformaAnticipoArchivo(
            archivo_id,
            item,
            {
                callback: () => {
                    dispatch(actions.fetchProformaAnticipo(cobro.id))
                }
            })
        )
    };

    const onSelectArchivo = (archivo_seleccionado) => {
        setArchivoSeleccionado(archivo_seleccionado);
        setMostrarAdicionarArchivo(true);
    };

    const onDeleteArchivo = (archivo_id) => {
        dispatch(actions.deleteProformaAnticipoArchivo(archivo_id, {callback: () => dispatch(actions.fetchProformaAnticipo(cobro.id))}));
    };

    return <div className="col-12">
        <Typography variant="h5" gutterBottom color="primary">
            Documentos
            <FontAwesomeIcon
                className='puntero'
                icon={`${show_adicionar_archivo ? 'minus' : 'plus'}-circle`}
                onClick={() => setMostrarAdicionarArchivo(!show_adicionar_archivo)}
            />
        </Typography>
        {
            show_adicionar_archivo &&
            <CobroDetailDocumentoUploadForm
                onSubmit={onSubmitUploadArchivo}
                initialValues={archivo_seleccionado}
            />
        }
        {
            documentos.length > 0 &&
            <CobroDetailDocumentoList
                lista={documentos}
                onEnviarPorEmail={onEnviarPorEmail}
                onDeleteArchivo={onDeleteArchivo}
                onSelectElemento={onSelectArchivo}
                permisos={{
                    change: true,
                    delete: true
                }}
            />
        }
    </div>
});


export default CobroDetailDocuento;