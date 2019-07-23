import React, {useState, Fragment, memo} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {useDispatch} from "react-redux";
import UploadDocumentoForm from '../forms/UploadArchivoForm';
import ArchivosList from '../components/ProyectoDocumentoList';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";
import {ARCHIVOS_LITERALES} from "../../../../permisos";

const PanelArchivosLiterales = memo(props => {
    const {literal, cargarProyecto} = props;
    const {mis_documentos} = literal;
    const dispatch = useDispatch();
    const permisos_archivos_literales = useTengoPermisos(ARCHIVOS_LITERALES);
    const [adicionar_documento, setAdicionarDocumento] = useState(false);
    const [item_seleccionado, setItemSeleccionado] = useState(null);
    const onSelectArchivo = (item_seleccionado) => {
        setItemSeleccionado(item_seleccionado);
        setAdicionarDocumento(true);
    };

    const onDeleteArchivo = (archivo_id) => {
        dispatch(actions.deleteArchivoLiteral(archivo_id, {callback: cargarProyecto}));
    };

    const onUploadArchivo = (e) => {
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
                                cargarProyecto();
                                dispatch(actions.notificarAction(`La ha subido el archivo para el literal`));
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
                actions.updateArchivoLiteral(id, valores, {
                    callback: () => {
                        setAdicionarDocumento(false)
                    }
                })
            )
        } else {
            onUploadArchivo(valores);
        }
    };

    return (
        <Fragment>
            {
                permisos_archivos_literales.add &&
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
                lista={mis_documentos}
                permisos={permisos_archivos_literales}
                onDeleteArchivo={onDeleteArchivo}
                onSelectElemento={onSelectArchivo}
            />
        </Fragment>
    )
});

export default PanelArchivosLiterales;