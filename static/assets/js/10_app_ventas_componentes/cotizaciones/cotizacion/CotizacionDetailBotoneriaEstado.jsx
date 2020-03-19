import React, {memo, useState, Fragment} from "react";
import {useDispatch} from 'react-redux';
import * as actions from '../../../01_actions/01_index';
import CotizacionEnviarFormDialog from './forms/CotizacionEnviarFormDialog'
import CotizacionRechazadaFormDialog from './forms/CotizacionRechazadaFormDialog'
import SiNoDialog from '../../../00_utilities/components/ui/dialog/SiNoDialog';
import Button from "@material-ui/core/Button";
import {notificarAction} from "../../../01_actions/01_index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

const BotonCotizacion = memo(props => {
    const classes = useStyles();
    const {onClick, nombre, icono = null, color = 'primary'} = props;
    return (
        <Button
            className={classes.button}
            variant="contained"
            color={color}
            onClick={onClick}
        >
            {nombre}
            {icono &&
            <FontAwesomeIcon
                className={clsx(classes.rightIcon, classes.iconSmall)}
                icon={icono}
                size='lg'
            />}
        </Button>
    )
});


const CotizacionDetailBotoneriaEstado = memo(props => {
    const {cotizacion_componente: {id, estado, items}, contacto, cargarDatos} = props;
    const [show_rechazada, setShowRechazada] = useState(false);
    const [show_en_proceso, setShowEnProceso] = useState(false);
    const [show_terminar, setShowTerminar] = useState(false);
    const [show_editar_confirmacion, setShowEditarConfirmacion] = useState(false);
    const [show_enviar, setShowEnviar] = useState(false);
    const dispatch = useDispatch();
    const setEstado = (estado_nuevo, razon_rechazo = null, callback = null) => dispatch(actions.cambiarEstadoCotizacionComponente(id, estado_nuevo, razon_rechazo, {callback}));

    const enviarCotizacion = (valores) => {
        dispatch(actions.enviarCotizacionComponente(
            id,
            valores,
            {
                callback: () => {
                    dispatch(notificarAction('La cotización se ha enviado correctamente'));
                    return setShowEnviar(false);
                }
            })
        )
    };

    return <Fragment>
        {show_enviar && <CotizacionEnviarFormDialog
            singular_name='Cotización'
            contacto={contacto}
            modal_open={show_enviar}
            onCancel={() => setShowEnviar(false)}
            onSubmit={enviarCotizacion}
        />}
        {show_terminar &&
        <SiNoDialog
            onSi={() => {
                setEstado(
                    'FIN',
                    null,
                    () => {
                        cargarDatos();
                        setShowTerminar(false);
                    }
                )
            }}
            onNo={() => setShowTerminar(false)}
            is_open={show_terminar}
            titulo='Terminar Cotización'
        >
            Deséa TERMINAR esta cotización?
        </SiNoDialog>}
        {show_editar_confirmacion &&
        <SiNoDialog
            onSi={() => {
                setEstado(
                    'INI',
                    null,
                    () => {
                        cargarDatos();
                        setShowEditarConfirmacion(false);
                    }
                )
            }}
            onNo={() => setShowEditarConfirmacion(false)}
            is_open={show_editar_confirmacion}
            titulo='Editar Cotización?'
        >
            Deséa EDITAR esta cotización?
        </SiNoDialog>}
        {show_en_proceso &&
        <SiNoDialog
            onSi={() => {
                setEstado(
                    'PRO',
                    null,
                    () => {
                        cargarDatos();
                        setShowEnProceso(false);
                    }
                )
            }}
            onNo={() => setShowEnProceso(false)}
            is_open={show_en_proceso}
            titulo='Cambiar a estado en proceso'
        >
            Deséa pasar esta cotización a estado EN PROCESO?
        </SiNoDialog>}
        {show_rechazada &&
        <CotizacionRechazadaFormDialog
            singular_name='Cotización Rechazada'
            modal_open={show_rechazada}
            onCancel={() => setShowRechazada(false)}
            onSubmit={(v) => setEstado(
                'ELI',
                v.razon_rechazada,
                () => {
                    cargarDatos();
                    setShowRechazada(false);
                }
            )}
        />}

        <div className="col-12">
            <div className="row">
                {estado === 'REC' &&
                <BotonCotizacion
                    onClick={() => setShowEnProceso(true)}
                    icono='thumbs-up'
                    nombre='En Proceso'
                />}
                {(estado === 'REC' || estado === 'PRO') &&
                <BotonCotizacion
                    icono='thumbs-down'
                    onClick={() => setShowRechazada(true)}
                    color='secondary'
                    nombre='Rechazada'
                />}
                {estado === 'REC' &&
                <BotonCotizacion
                    onClick={() => setShowEditarConfirmacion(true)}
                    nombre='Editar'
                    icono='edit'/>}
                {estado === 'ENV' &&
                <BotonCotizacion
                    onClick={() => setEstado('REC', null, () => cargarDatos())}
                    nombre='Recibida'
                />}
                {estado === 'PRO' &&
                <BotonCotizacion
                    onClick={() => setShowTerminar(true)}
                    nombre='Terminada'
                />}
                {items.length > 0 && estado !== 'ELI' && estado !== 'FIN' &&
                <div className="col-12 text-center">
                    <BotonCotizacion
                        icono='inbox-out'
                        onClick={() => setShowEnviar(true)}
                        nombre='Enviar'
                    />
                </div>}
            </div>
        </div>
    </Fragment>
});

export default CotizacionDetailBotoneriaEstado;