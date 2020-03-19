import React, {memo, useState, Fragment} from "react";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CotizacionCRUDFormDialog from "./forms/CotizacionCRUDFormDialog";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import HistoricoPrecio from "../../../03_app_admin/especificas/clientes/clientes/ClienteHistoricoPrecios";
import {Link} from "react-router-dom";

const styles = {
    texto_principal: {
        fontSize: '0.8rem',
        margin: 0
    },
    texto_secondario: {
        fontSize: '0.7rem',
        paddingLeft: '10px',
        margin: 0,
        wordBreak: 'break-all',
        whiteSpace: 'pre-line'
    },
};

const CotizacionDetailInfo = memo(props => {
    const [show_cotizacion_informacion_dialog, setShowCotizacionInformacionDialog] = useState(false);
    const {cotizacion, contacto, onSubmitCotizacion, cargarDatos, editable, onDelete} = props;
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
                Datos Cotización {cotizacion.nro_consecutivo} {cotizacion.version &&
            <Fragment>v.{cotizacion.version}</Fragment>}
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
            <Typography variant="body1" gutterBottom color="secondary" style={styles.texto_secondario}>
                {cotizacion.razon_rechazo}
            </Typography>
            <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                Cliente:
            </Typography>
            <Link to={`/app/ventas_componentes/clientes/detail/${cotizacion.cliente}`}>
                <Typography variant="body1" style={styles.texto_secondario} gutterBottom color="secondary">
                    {cotizacion.cliente_nombre}
                </Typography>
            </Link>
            <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                Ciudad:
            </Typography>
            <Typography variant="body1" style={styles.texto_secondario} gutterBottom color="secondary">
                {`${cotizacion.ciudad_nombre} - ${cotizacion.departamento_nombre} - ${cotizacion.pais_nombre}`}
            </Typography>
            {contacto && <Fragment>
                <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                    Contacto:
                </Typography>
                <Typography variant="body1" style={styles.texto_secondario} gutterBottom color="secondary">
                    {contacto.full_nombre}
                </Typography>
                {contacto.telefono && <div>
                    <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                        <FontAwesomeIcon
                            icon={'phone'}
                            style={{color: 'green'}}
                        /> {contacto.telefono}
                    </Typography>
                </div>}
                {contacto.telefono_2 && <div>
                    <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                        <FontAwesomeIcon
                            icon={'phone'}
                            style={{color: 'green'}}
                        /> {contacto.telefono_2}
                    </Typography>
                </div>}
                {contacto.correo_electronico && <div>
                    <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                        <FontAwesomeIcon
                            icon={'at'}
                            style={{color: 'green'}}
                        /> {contacto.correo_electronico.toString().toLowerCase()}
                    </Typography>
                </div>}
                {contacto.correo_electronico_2 && <div>
                    <Typography variant="overline" color="inherit" gutterBottom style={styles.texto_secondario}>
                        <FontAwesomeIcon
                            icon={'at'}
                            style={{color: 'green'}}
                        /> {contacto.correo_electronico_2.toString().toLowerCase()}
                    </Typography>
                </div>}
                {cotizacion.observaciones && <div>
                    <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                        Observaciones:
                    </Typography>
                    <Typography variant="body2" gutterBottom color="secondary" style={styles.texto_principal}>
                        {cotizacion.observaciones}
                    </Typography>
                </div>}
            </Fragment>}
            {cotizacion.responsable_nombre && <div>
                <Typography variant="body1" gutterBottom color="primary" style={styles.texto_principal}>
                    Atendido por:
                </Typography>
                <Typography variant="body2" gutterBottom color="secondary" style={styles.texto_principal}>
                    {cotizacion.responsable_nombre}
                </Typography>
            </div>}
            {editable && !cotizacion.nro_consecutivo && <MyDialogButtonDelete
                element_name={`Cotización para ${cotizacion.cliente_nombre}`}
                element_type='Cotización'
                tamano_icono='2x'
                onDelete={onDelete}/>}
        </Fragment>
    )
});

export default CotizacionDetailInfo;