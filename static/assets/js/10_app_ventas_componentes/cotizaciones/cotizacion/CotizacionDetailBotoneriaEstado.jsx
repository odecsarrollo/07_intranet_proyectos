import {Typography} from "@material-ui/core";
import moment from "moment-timezone";
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
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {fechaToYMD} from "../../../00_utilities/common";

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

const FechaSiNoDialog = props => {
    const {onChange, value, calendar_space = true, label = 'Fecha próximo Seguimiento', min = new Date()} = props;
    return <div>
        <label>
            <strong>{label}</strong>
        </label>
        <DateTimePicker
            onChange={(v) => onChange(v)}
            format={"YYYY-MM-DD"}
            time={false}
            max={new Date(3000, 1, 1)}
            min={min}
            value={value}
        />
        {calendar_space && <div style={{height: '250px'}}/>}
    </div>
}

const CotizacionDetailBotoneriaEstado = memo(props => {
    const {cotizacion_componente: {id, estado, items}, contacto, cargarDatos} = props;
    const [show_aplazada, setShowAplazada] = useState(false);
    const [show_rechazada, setShowRechazada] = useState(false);
    const [show_en_proceso, setShowEnProceso] = useState(false);
    const [show_terminar, setShowTerminar] = useState(false);
    const [show_editar_confirmacion, setShowEditarConfirmacion] = useState(false);
    const [show_enviar, setShowEnviar] = useState(false);
    const [show_recibida, setShowRecibida] = useState(false);
    const [fecha_proximo_seguimiento, setFechaProximoSeguimiento] = useState(null);
    const [fecha_orden_compra, setFechaOrdenCompra] = useState(null);
    const [nro_orden_compra, setNroOrdenCompra] = useState(null);
    const [valor_orden_compra, setValorOrdenCompra] = useState(null);
    const dispatch = useDispatch();
    const setEstado = (
        estado_nuevo,
        razon_rechazo = null,
        callback = null
    ) => {
        return dispatch(
            actions.cambiarEstadoCotizacionComponente(
                id,
                estado_nuevo,
                razon_rechazo,
                fecha_proximo_seguimiento ? fechaToYMD(fecha_proximo_seguimiento) : null,
                fecha_orden_compra ? fechaToYMD(fecha_orden_compra) : null,
                nro_orden_compra,
                valor_orden_compra,
                {callback}
            )
        )
    };

    const enviarCotizacion = (valores, no_enviar) => {
        dispatch(actions.enviarCotizacionComponente(
            id,
            valores,
            {
                callback: (res) => {
                    if (no_enviar) {
                        const {archivo_url, archivo_name} = res.envios_emails.slice(-1)[0];
                        const link = document.createElement('a');
                        link.href = archivo_url;
                        link.setAttribute('download', archivo_name);
                        document.body.appendChild(link);
                        link.click();

                    } else {
                        dispatch(notificarAction('La cotización se ha enviado correctamente'));
                    }
                    setFechaProximoSeguimiento(null);
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
            estado_cotizacion={estado}
            onCancel={() => setShowEnviar(false)}
            onSubmit={enviarCotizacion}
        />}
        {show_terminar &&
        <SiNoDialog
            can_on_si={fecha_proximo_seguimiento !== null}
            onSi={() => {
                setEstado(
                    'FIN',
                    null,
                    () => {
                        cargarDatos();
                        setShowTerminar(false);
                        setFechaProximoSeguimiento(null);
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
                        setFechaProximoSeguimiento(null);
                    }
                )
            }}
            onNo={() => setShowEditarConfirmacion(false)}
            is_open={show_editar_confirmacion}
            titulo='Editar Cotización?'
        >
            Deséa EDITAR esta cotización?
        </SiNoDialog>}
        {show_en_proceso && <SiNoDialog
            can_on_si={fecha_proximo_seguimiento !== null && fecha_orden_compra !== null && nro_orden_compra && valor_orden_compra}
            onSi={() => {
                setEstado(
                    'PRO',
                    null,
                    () => {
                        cargarDatos();
                        setShowEnProceso(false);
                        setFechaProximoSeguimiento(null);
                        setFechaOrdenCompra(null);
                        setNroOrdenCompra(null);
                        setValorOrdenCompra(null);
                    }
                )
            }}
            onNo={() => {
                setShowEnProceso(false);
                setFechaProximoSeguimiento(null);
                setFechaOrdenCompra(null);
                setNroOrdenCompra(null);
                setValorOrdenCompra(null);
            }}
            is_open={show_en_proceso}
            titulo='Cambiar a estado en proceso'
        >
            Deséa pasar esta cotización a estado EN PROCESO?
            <FechaSiNoDialog
                onChange={setFechaProximoSeguimiento}
                value={fecha_proximo_seguimiento}
                calendar_space={false}
            />
            <div style={{border: '1px solid black', padding: '10px', marginTop: '5px'}}>
                <Typography variant='h6' color='primary'>Orden Compra</Typography>
                <div className="row">
                    <div className="col-4">Valor</div>
                    <div className="col-8">
                        <input
                            type='number'
                            onChange={(event) => setValorOrdenCompra(event.target.value)}
                            value={valor_orden_compra}
                        />
                    </div>
                    <div className="col-4">Nro. Orden Compra</div>
                    <div className="col-8">
                        <input
                            onChange={(event) => setNroOrdenCompra(event.target.value)}
                            value={nro_orden_compra}
                        />
                    </div>
                </div>
                <FechaSiNoDialog
                    onChange={setFechaOrdenCompra}
                    value={fecha_orden_compra}
                    min={null}
                    label='Fecha Orden de Compra'
                />
            </div>
        </SiNoDialog>}
        {show_aplazada && <SiNoDialog
            can_on_si={fecha_proximo_seguimiento !== null}
            onSi={() => {
                setEstado(
                    'APL',
                    null,
                    () => {
                        cargarDatos();
                        setShowAplazada(false);
                        setFechaProximoSeguimiento(null);
                    }
                )
            }}
            onNo={() => {
                setShowAplazada(false);
                setFechaProximoSeguimiento(null);
            }}
            is_open={show_aplazada}
            titulo='Cambiar a estado Aplazado'
        >
            Deséa pasar esta cotización a estado Aplazada?
            <FechaSiNoDialog onChange={setFechaProximoSeguimiento} value={fecha_proximo_seguimiento}/>
        </SiNoDialog>}
        {show_recibida && <SiNoDialog
            onSi={() => {
                setEstado(
                    'REC',
                    null,
                    () => {
                        cargarDatos();
                        setShowRecibida(false);
                        setFechaProximoSeguimiento(null);
                    }
                )
            }}
            can_on_si={fecha_proximo_seguimiento !== null}
            onNo={() => {
                setShowRecibida(false);
                setFechaProximoSeguimiento(null);
            }}
            is_open={show_recibida}
            titulo='Cambiar a estado recibida'
        >
            Deséa pasar esta cotización a estado RECIBIDA?
            <FechaSiNoDialog onChange={setFechaProximoSeguimiento} value={fecha_proximo_seguimiento}/>
        </SiNoDialog>}
        {show_rechazada && <CotizacionRechazadaFormDialog
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
                {(estado === 'REC' || estado === 'APL') && <BotonCotizacion
                    onClick={() => setShowEditarConfirmacion(true)}
                    nombre='Editar'
                    icono='edit'/>}
                {(estado === 'ENV' || estado === 'APL') && <BotonCotizacion
                    onClick={() => setShowRecibida(true)}
                    nombre='Recibida'
                />}
                {(estado === 'REC' || estado === 'APL') && <BotonCotizacion
                    onClick={() => setShowEnProceso(true)}
                    icono='thumbs-up'
                    nombre='En Proceso'
                />}
                {(estado === 'REC' || estado === 'PRO' || estado === 'APL') &&
                <BotonCotizacion
                    icono='thumbs-down'
                    onClick={() => setShowRechazada(true)}
                    color='secondary'
                    nombre='Rechazada'
                />}
                {(estado === 'REC' || estado === 'PRO') &&
                <BotonCotizacion
                    icono='thumbs-down'
                    onClick={() => setShowAplazada(true)}
                    color='secondary'
                    nombre='Aplazada'
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