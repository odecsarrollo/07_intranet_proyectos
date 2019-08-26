import React, {memo, useState, Fragment} from "react";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CotizacionCRUDFormDialog from "./forms/CotizacionCRUDFormDialog";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";

const styles = {
    texto_principal: {
        fontSize: '0.8rem',
        margin: 0
    },
    texto_secondario: {
        fontSize: '0.7rem',
        paddingLeft: '10px',
        margin: 0,
        wordBreak: 'break-all'
    },
};

const CotizacionDetailInfo = memo(props => {
    const [show_cotizacion_informacion_dialog, setShowCotizacionInformacionDialog] = useState(false);
    const {cotizacion, contacto_cotizacion, onSubmitCotizacion, cargarDatos, editable, onDelete} = props;
    return (
        <Fragment>
            {show_cotizacion_informacion_dialog &&
            <CotizacionCRUDFormDialog
                singular_name={`Contacto Cotización ${cotizacion.nro_consecutivo}`}
                initialValues={cotizacion}
                modal_open={show_cotizacion_informacion_dialog}
                onCancel={() => {
                    cargarDatos();
                    setShowCotizacionInformacionDialog(false);
                }}
                onSubmit={v => onSubmitCotizacion(v, () => setShowCotizacionInformacionDialog(false))}
            />}
            <Typography variant="h5" gutterBottom color="primary">
                Datos Cotización {cotizacion.nro_consecutivo}
                {editable &&
                <FontAwesomeIcon
                    className='puntero'
                    icon={'edit'}
                    onClick={() => setShowCotizacionInformacionDialog(true)}
                />}
            </Typography>
            <Typography variant="h4" gutterBottom color="secondary">
                {cotizacion.estado_display}
            </Typography>
            <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                Cliente:
            </Typography>
            <Typography variant="body1" style={styles.texto_secondario} gutterBottom color="secondary">
                {cotizacion.cliente_nombre}
            </Typography>
            <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                Ciudad:
            </Typography>
            <Typography variant="body1" style={styles.texto_secondario} gutterBottom color="secondary">
                {`${cotizacion.ciudad_nombre} - ${cotizacion.departamento_nombre} - ${cotizacion.pais_nombre}`}
            </Typography>
            {contacto_cotizacion &&
            <Fragment>
                <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                    Contacto:
                </Typography>
                <Typography variant="body1" style={styles.texto_secondario} gutterBottom color="secondary">
                    {contacto_cotizacion.full_nombre}
                </Typography>
                {contacto_cotizacion.telefono &&
                <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                    <FontAwesomeIcon
                        icon={'phone'}
                        style={{color: 'green'}}
                    /> {contacto_cotizacion.telefono}
                </Typography>}<br/>
                {contacto_cotizacion.telefono_2 &&
                <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                    <FontAwesomeIcon
                        icon={'phone'}
                        style={{color: 'green'}}
                    /> {contacto_cotizacion.telefono_2}
                </Typography>}<br/>
                {contacto_cotizacion.correo_electronico &&
                <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                    <FontAwesomeIcon
                        icon={'at'}
                        style={{color: 'green'}}
                    /> {contacto_cotizacion.correo_electronico.toString().toLowerCase()}
                </Typography>}<br/>
                {contacto_cotizacion.correo_electronico_2 &&
                <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                    <FontAwesomeIcon
                        icon={'at'}
                        style={{color: 'green'}}
                    /> {contacto_cotizacion.correo_electronico_2.toString().toLowerCase()}
                </Typography>}<br/>
                {cotizacion.observaciones &&
                <Fragment>
                    <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                        Observaciones:
                    </Typography>
                    <Typography variant="body2" gutterBottom color="secondary" style={styles.texto_principal}>
                        {cotizacion.observaciones}
                    </Typography>
                </Fragment>
                }
            </Fragment>
            }
            {editable && !cotizacion.nro_consecutivo &&
            <MyDialogButtonDelete
                element_name={`Cotización para ${cotizacion.cliente_nombre}`}
                element_type='Cotización'
                tamano_icono='2x'
                onDelete={onDelete}/>
            }
        </Fragment>
    )

});

export default CotizacionDetailInfo;