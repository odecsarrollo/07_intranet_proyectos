import React, {Fragment, memo, useState} from 'react';
import {useDispatch} from 'react-redux';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import {makeStyles} from "@material-ui/core";
import {formatBytes} from "../../../00_utilities/common";
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../01_actions/01_index";
import UploadFileDialogForm from "../../../00_utilities/components/ui/UploadFileDialogForm";
import CotizacionDetailEnvioListItem from "./CotizacionDetailEnvioList";

const useStyles = makeStyles(theme => ({
    delete_boton: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        border: `1px solid ${theme.palette.primary.dark}`,
        borderRadius: '25px'
    },
    tamano_archivo: {
        fontSize: '9px'
    },
    nombre_archivo: {
        fontSize: '10px'
    },
    extension_icono: {
        color: 'white',
        position: 'relative',
        top: '60px',
        fontSize: '20px'
    }
}));


const CotizacionDetailAdjuntoList = memo(props => {
    const {adjuntos, cargarDatos, en_edicion, cotizacion_componente: {id, envios_emails, estado}} = props;
    const classes = useStyles();
    const tamano_adjuntos = _.map(adjuntos, t => parseFloat(t.size)).reduce((uno, dos) => uno + dos, 0);
    const imagenes = _.pickBy(adjuntos, a => a.imagen);
    const archivos = _.pickBy(adjuntos, a => !a.imagen);
    const dispatch = useDispatch();

    const [show_adicionar_ajunto, setShowAdicionarAdjunto] = useState(false);
    const [tipo_adjunto, setTipoAdjunto] = useState(null);
    const [show_envios_cotizacion, setShowEnviosCotizacion] = useState(false);

    const onUploadAdjunto = (e) => {
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            formData.append('tipo', tipo_adjunto);
            dispatch(
                actions.uploadAdjuntoCotizacionComponente(
                    id,
                    formData,
                    {
                        callback:
                            () => {
                                dispatch(actions.notificarAction(`Se ha subido el archivo para el proyecto`));
                                setShowAdicionarAdjunto(false);
                                dispatch(actions.fetchCotizacionComponente(id))
                            }
                    }
                )
            )
        }
    };

    const getTiposDocumentos = () => {
        if (tipo_adjunto === 'imagen') {
            return "image/*"
        } else if (tipo_adjunto === 'archivo') {
            return ".docx, .doc, .xls, .xlsx, .pdf, .pptx, .ppt, .xlsm"
        }
    };


    const onDeleteArchivo = (cotizacion_componente_id, adjunto_id) => dispatch(actions.deleteAdjuntoCotizacionComponente(cotizacion_componente_id, adjunto_id, {callback: () => cargarDatos()}));
    const onOpenUrl = (url) => window.open(url, '_blank');
    return <div className='row'>
        {show_envios_cotizacion &&
        <div className="col-12">
            <CotizacionDetailEnvioListItem
                onClose={() => setShowEnviosCotizacion(false)}
                lista={envios_emails}
                modal_open={show_envios_cotizacion}
            />
        </div>}
        {show_adicionar_ajunto &&
        <UploadFileDialogForm
            accept={getTiposDocumentos()}
            type_element={tipo_adjunto.toUpperCase()}
            is_open={show_adicionar_ajunto}
            onCancel={() => {
                setShowAdicionarAdjunto(false);
                setTipoAdjunto(null);
            }}
            onSubmit={onUploadAdjunto}
        />}
        <div className="col-12 mb-3">
            <div className="row">
                {estado === 'INI' &&
                <Fragment>
                    <div
                        className='puntero'
                        onClick={() => {
                            setShowAdicionarAdjunto(true);
                            setTipoAdjunto('archivo');
                        }}
                    >
                        <FontAwesomeIcon
                            icon={'file'}
                            size='3x'
                        />
                        <FontAwesomeIcon
                            icon={'arrow-circle-up'}
                            style={{color: "green", marginLeft: '-10px', marginBottom: '-13px'}}
                            size='lg'
                        />
                    </div>
                    <div
                        className='puntero ml-3'
                        onClick={() => {
                            setShowAdicionarAdjunto(true);
                            setTipoAdjunto('imagen');
                        }}
                    >
                        <FontAwesomeIcon
                            icon={'file-image'}
                            size='3x'
                        />
                        <FontAwesomeIcon
                            icon={'arrow-circle-up'}
                            style={{color: "green", marginLeft: '-10px', marginBottom: '-13px'}}
                            size='lg'
                        />
                    </div>
                </Fragment>}
                <div className="puntero ml-3">
                    <FontAwesomeIcon
                        icon={'history'}
                        onClick={() => setShowEnviosCotizacion(true)}
                        size='3x'
                    />
                </div>
            </div>
        </div>
        <div className="col-12">
            <Typography variant="h5" gutterBottom color="primary">
                Adjuntos <small>({formatBytes(tamano_adjuntos, 1)})</small>
            </Typography>
        </div>
        {_.map(imagenes, i =>
            <div className="col-6 col-md-3 col-lg-2 p-2 text-center" key={i.id}>
                <picture className='puntero'>
                    <img src={i.imagen_thumbnail} onClick={() => onOpenUrl(i.adjunto_url)}/>
                </picture>
                {en_edicion &&
                <div className={classes.delete_boton}>
                    <MyDialogButtonDelete
                        onDelete={() => onDeleteArchivo(i.cotizacion_componente, i.id)}
                        element_name={`${i.nombre_adjunto}.${i.extension.toLowerCase()}`}
                        element_type='Imagen Cotización'
                    />
                </div>}
                <div className={classes.nombre_archivo}>{i.nombre_adjunto}</div>
                <div className={classes.tamano_archivo}>({formatBytes(i.size, 1)})</div>
            </div>
        )}
        {_.map(archivos, i =>
            <div className="col-6 col-md-3 col-lg-2 p-2 text-center" key={i.id}>
                <span className={classes.extension_icono}>.{i.extension.toLowerCase()}</span>
                <div className='text-center'>
                    <FontAwesomeIcon
                        onClick={() => onOpenUrl(i.adjunto_url)}
                        className='puntero'
                        icon={'file'}
                        size='6x'
                    />
                    {en_edicion &&
                    <div className={classes.delete_boton}>
                        <MyDialogButtonDelete
                            onDelete={() => onDeleteArchivo(i.cotizacion_componente, i.id)}
                            element_name={`${i.nombre_adjunto}.${i.extension.toLowerCase()}`}
                            element_type='Archivo Cotización'
                        />
                    </div>}
                    <div className={classes.nombre_archivo}>{i.nombre_adjunto}</div>
                    <div className={classes.tamano_archivo}>({formatBytes(i.size, 1)})</div>
                </div>
            </div>
        )}</div>
});

export default CotizacionDetailAdjuntoList;