import React, {useContext, useState, useCallback} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {useDispatch} from "react-redux";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import {fechaFormatoUno, fechaToYMD, formatoDinero, numeroFormato} from "../../../00_utilities/common";
import MyDialogButtonDelete from "../../../00_utilities/components/ui/dialog/delete_dialog";
import SiNoDialog from "../../../00_utilities/components/ui/dialog/SiNoDialog";
import CustomIconTable from "../../../00_utilities/components/ui/icon/CustomIconTable";
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {
    adicionarPagoCotizacion,
    cambiarFechaAcuerdoPagoCotizacion,
    eliminarOrdenCompraCotizacion,
    eliminarPagoCotizacion
} from "../../../01_actions/especificas/cotizaciones/cotizacionesAction";
import CotizacionAcuerdoPagoAddPagoDialog from "./CotizacionAcuerdoPagoAddPagoDialog"
import {ACUERDO_PAGO_COTIZACIONES} from "../../../permisos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";


const useStyles = makeStyles(theme => ({
    download_boton: {
        position: 'absolute',
        bottom: '0px',
        left: '40px',
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
    ul: {
        margin: 0,
        padding: 0
    },
    li: {
        listStyle: 'none',
        margin: 0,
        padding: 0
    },
    download_boton_pago: {
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
}))

const FechaSiNoDialog = props => {
    const {
        onChange,
        value,
        calendar_space = true,
        label = 'Fecha próximo Seguimiento',
        min = new Date(),
        max = new Date(3000, 1, 1),
    } = props;
    return <div>
        <label>
            <strong>{label}</strong>
        </label>
        <DateTimePicker
            onChange={(v) => onChange(v)}
            format={"YYYY-MM-DD"}
            time={false}
            max={max}
            min={min}
            value={value}
        />
        {calendar_space && <div style={{height: '250px'}}/>}
    </div>
}

const AcuerdoPago = (props) => {
    const {
        acuerdo_pago,
        eliminarPago,
        openAplicarPago,
        setAcuerdoPagoId,
        setShowChangeFechaProyectada
    } = props;
    const {pagos} = acuerdo_pago;
    const {table} = useContext(StylesContext);
    const permisos = useTengoPermisos(ACUERDO_PAGO_COTIZACIONES);
    return <tr style={table.tr}>
        <td style={table.td}>{acuerdo_pago.motivo}</td>
        <td style={table.td}><span
            onClick={() => {
                if (permisos.change_fecha_proyectada) {
                    setShowChangeFechaProyectada(true);
                    setAcuerdoPagoId(acuerdo_pago.id);
                }
            }}>
            {acuerdo_pago.fecha_proyectada}
        </span></td>
        <td style={table.td_right}>{acuerdo_pago.porcentaje > 0 ? `${numeroFormato(acuerdo_pago.porcentaje, 1)}%` : ''}</td>
        <td style={table.td_break_line}>{acuerdo_pago.requisitos}</td>
        <td style={table.td_right}>{formatoDinero(acuerdo_pago.valor_proyectado, '$', 0)}</td>
        <td style={table.td}>
            {pagos.length > 0 && <table className='table table-striped table-responsive'>
                <thead>
                <tr style={table.tr}>
                    <th style={table.td}>Fecha</th>
                    <th style={table.td}>Valor</th>
                    <th style={table.td}>Doc.</th>
                </tr>
                </thead>
                <tbody>
                {pagos.map(p =>
                    <tr key={p.id} style={table.tr}>
                        <td style={table.td}>{fechaFormatoUno(p.fecha)}</td>
                        <td style={table.td_right}>{formatoDinero(p.valor, '$', 0)}</td>
                        <td style={table.td}>
                            <div className="row">
                                <div className="col-6">
                                    <a href={p.comprobante_pago} target='_blank'>
                                        <CustomIconTable icon='download'/>
                                    </a>
                                </div>
                                <div className="col-6">
                                    <MyDialogButtonDelete
                                        element_name={formatoDinero(p.valor, '$', 0)}
                                        element_type='Pago'
                                        onDelete={() => eliminarPago(p.id)}
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr style={table.tr}>
                    <td style={table.td}>Total Pagado:</td>
                    <td style={table.td}>{formatoDinero(pagos.map(p => p.valor).reduce((sum, valor) => sum + valor), '$', 0)}</td>
                    <td style={table.td}></td>
                </tr>
                </tfoot>
            </table>}
        </td>
        <td style={table.td}>
            <CustomIconTable
                icon='plus'
                onClick={() => {
                    openAplicarPago();
                    setAcuerdoPagoId(acuerdo_pago.id)
                }
                }
            />
        </td>
    </tr>
}


const CotizacionOrdenComrpa = (props) => {
    const {
        eliminarPago,
        eliminarOC,
        orden_compra,
        orden_compra: {acuerdos_pagos},
        openAplicarPago,
        setAcuerdoPagoId,
        setShowChangeFechaProyectada
    } = props;
    const classes = useStyles();
    const {table} = useContext(StylesContext);
    return <div className="row card p-4 m-1">
        <div className="row">
            <div className="col-md-4">
                <Typography variant="body1" gutterBottom color="primary">
                    Fecha Orden Compra: {orden_compra.orden_compra_fecha}
                </Typography>
            </div>
            <div className="col-md-4">
                <Typography variant="body1" gutterBottom color="primary">
                    Nro. Orden Compra: {orden_compra.orden_compra_nro}
                </Typography>
            </div>
            <div className="col-md-4">
                <Typography variant="body1" gutterBottom color="primary">
                    Valor Orden Compra: {formatoDinero(orden_compra.valor_orden_compra, '$', 0)}
                </Typography>
            </div>
            <MyDialogButtonDelete onDelete={() => eliminarOC(orden_compra.id)}
                                  element_name={orden_compra.valor_proyectado} element_type='Orden de Compra'/>
            {orden_compra.orden_compra_archivo && <a href={orden_compra.orden_compra_archivo} target='_blank'>
                <IconButton className={classes.download_boton}>
                    <span>Descargar Orden Compra</span>
                    <FontAwesomeIcon
                        className='puntero ml-2'
                        icon='download'
                        size='1x'
                    />
                </IconButton>
            </a>}
        </div>
        <table className='table table-responsive table-striped'>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Motivo</th>
                <th style={table.td}>Fecha Proyectada</th>
                <th style={table.td}>Porcentaje</th>
                <th style={table.td}>Requisitos</th>
                <th style={table.td}>Valor Proyectado</th>
                <th style={table.td}>Pagos</th>
                <th style={table.td}>Adicionar Pago</th>
            </tr>
            </thead>
            <tbody>
            {acuerdos_pagos.map(oc => <AcuerdoPago
                setShowChangeFechaProyectada={setShowChangeFechaProyectada}
                eliminarPago={eliminarPago}
                acuerdo_pago={oc}
                key={oc.id}
                openAplicarPago={openAplicarPago}
                setAcuerdoPagoId={setAcuerdoPagoId}
            />)}
            </tbody>
        </table>
    </div>
}


const CotizacionAcuerdoPagoList = (props) => {
    const [show_add_pago, setAddPago] = useState(false)
    const [show_change_fecha_proyectada, setShowChangeFechaProyectada] = useState(false);
    const [fecha_proyectada_pago, setFechaProyectadaPago] = useState(null);
    const [acuerdo_pago_id, setAcuerdoPagoId] = useState(null)
    const dispatch = useDispatch();
    const {cotizacion: {pagos_proyectados, id}} = props;
    const adicionarPago = (v) => {
        v.append('acuerdo_pago_id', acuerdo_pago_id)
        dispatch(adicionarPagoCotizacion(id, v, {
            callback: () => {
                setAcuerdoPagoId(null);
                setAddPago(false);
            }
        }));
    };
    const eliminarPago = (pago_id) => dispatch(eliminarPagoCotizacion(id, pago_id));
    const eliminarOC = (oc_id) => dispatch(eliminarOrdenCompraCotizacion(id, oc_id));
    const acuerdos_pagos = useCallback(
        _.mapKeys(_.flatMap(pagos_proyectados.map(pp => pp.acuerdos_pagos)), 'id'),
        [show_change_fecha_proyectada]
    );
    return <div>
        {show_change_fecha_proyectada && <SiNoDialog
            can_on_si={fecha_proyectada_pago !== null}
            onSi={() => {
                dispatch(cambiarFechaAcuerdoPagoCotizacion(
                    id,
                    acuerdo_pago_id,
                    fechaToYMD(fecha_proyectada_pago),
                    {
                        callback: () => {
                            setShowChangeFechaProyectada(false);
                            setAcuerdoPagoId(null);
                            setFechaProyectadaPago(null);
                        }
                    }))
            }}
            onNo={() => {
                setShowChangeFechaProyectada(false);
                setAcuerdoPagoId(null);
                setFechaProyectadaPago(null);
            }}
            is_open={show_change_fecha_proyectada}
            titulo='Cambiar fecha proyectada'
        >
            Desea cambiar la fecha proyectada?
            <FechaSiNoDialog
                onChange={setFechaProyectadaPago}
                value={
                    fecha_proyectada_pago ? fecha_proyectada_pago : (
                        new Date(acuerdos_pagos[acuerdo_pago_id].fecha_proyectada) ? new Date(acuerdos_pagos[acuerdo_pago_id].fecha_proyectada) : undefined
                    )
                }
            />
        </SiNoDialog>}
        {show_add_pago && <CotizacionAcuerdoPagoAddPagoDialog
            onCancel={() => {
                setAddPago(false);
                setAcuerdoPagoId(null);
            }}
            modal_open={show_add_pago}
            onSubmit={adicionarPago}
        />}
        {pagos_proyectados.map(p => <CotizacionOrdenComrpa
            setShowChangeFechaProyectada={setShowChangeFechaProyectada}
            eliminarPago={eliminarPago}
            setAcuerdoPagoId={setAcuerdoPagoId}
            orden_compra={p} key={p.id}
            openAplicarPago={() => setAddPago(true)}
            eliminarOC={eliminarOC}
        />)}
    </div>
}

export default CotizacionAcuerdoPagoList;