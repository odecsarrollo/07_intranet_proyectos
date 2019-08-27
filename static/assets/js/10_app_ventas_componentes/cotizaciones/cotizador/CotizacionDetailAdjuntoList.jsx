import React, {memo} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import {makeStyles} from "@material-ui/core";
import {formatBytes} from "../../../00_utilities/common";
import Typography from "@material-ui/core/Typography";

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
    const {adjuntos, onDeleteArchivo, en_edicion} = props;
    const classes = useStyles();
    const tamano_adjuntos = _.map(adjuntos, t => parseFloat(t.size)).reduce((uno, dos) => uno + dos, 0);
    const imagenes = _.pickBy(adjuntos, a => a.imagen);
    const archivos = _.pickBy(adjuntos, a => !a.imagen);
    const onOpenUrl = (url) => window.open(url, '_blank');
    return <div className='row'>
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
                        onDelete={() => onDeleteArchivo(i.id)}
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
                            onDelete={() => onDeleteArchivo(i.id)}
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