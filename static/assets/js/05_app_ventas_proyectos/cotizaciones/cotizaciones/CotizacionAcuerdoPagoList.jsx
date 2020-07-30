import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import React, {useContext, useState} from "react";
import {useDispatch} from "react-redux";
import {formatoDinero, numeroFormato} from "../../../00_utilities/common";
import StylesContext from "../../../00_utilities/contexts/StylesContext";
import {adicionarPagoCotizacion} from "../../../01_actions/especificas/cotizaciones/cotizacionesAction";
import CotizacionAcuerdoPagoAddPagoDialog from "./CotizacionAcuerdoPagoAddPagoDialog";

const AcuerdoPago = (props) => {
    const {
        acuerdo_pago,
        openAplicarPago,
        setOrdenCompraSeleccionada
    } = props;
    const {table} = useContext(StylesContext);
    return <tr style={table.tr}>
        <td style={table.td}>{acuerdo_pago.motivo}</td>
        <td style={table.td}>{acuerdo_pago.fecha_proyectada}</td>
        <td style={table.td_right}>{acuerdo_pago.porcentaje > 0 ? `${numeroFormato(acuerdo_pago.porcentaje, 1)}%` : ''}</td>
        <td style={table.td_right}>{formatoDinero(acuerdo_pago.valor_proyectado, '$', 0)}</td>
        <td style={table.td}>Aqui irían los pagos</td>
        <td style={table.td}><span onClick={() => {
            openAplicarPago();
            setOrdenCompraSeleccionada(acuerdo_pago)
        }}>Aplicar Pago</span></td>
    </tr>
}

const useStyles = makeStyles(theme => ({
    download_boton: {
        position: 'absolute',
        bottom: '0px',
        left: '40px',
        margin: 0,
        padding: 4,
        color: theme.palette.primary.dark
    },
}))

const CotizacionOrdenComrpa = (props) => {
    const {
        orden_compra,
        orden_compra: {acuerdos_pagos},
        openAplicarPago,
        setOrdenCompraSeleccionada
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
                    Valor Orden Compra: {orden_compra.valor_orden_compra}
                </Typography>
            </div>
            <a href={orden_compra.orden_compra_archivo} target='_blank'>
                <IconButton className={classes.download_boton}>
                    <span>Descargar Orden Compra</span>
                    <FontAwesomeIcon
                        className='puntero ml-2'
                        icon='download'
                        size='1x'
                    />
                </IconButton>
            </a>
        </div>
        <table className='table table-responsive table-striped'>
            <thead>
            <tr style={table.tr}>
                <th style={table.td}>Motivo</th>
                <th style={table.td}>Fecha Proyectada</th>
                <th style={table.td}>Porcentaje</th>
                <th style={table.td}>Valor Proyectado</th>
                <th style={table.td}>Pagos</th>
                <th style={table.td}></th>
            </tr>
            </thead>
            <tbody>
            {acuerdos_pagos.map(oc => <AcuerdoPago
                acuerdo_pago={oc}
                key={oc.id}
                openAplicarPago={openAplicarPago}
                setOrdenCompraSeleccionada={setOrdenCompraSeleccionada}
            />)}
            </tbody>
        </table>
    </div>
}


const CotizacionAcuerdoPagoList = (props) => {
    const [show_add_pago, setAddPago] = useState(false)
    const [orden_compra_seleccionada, setOrdenCompraSeleccionada] = useState(null)
    const dispatch = useDispatch();
    const {cotizacion: {pagos_proyectados, id}} = props;
    const adicionarPago = (v) => dispatch(adicionarPagoCotizacion(id, v));
    return <div>
        {show_add_pago && <CotizacionAcuerdoPagoAddPagoDialog
            onCancel={() => {
                setAddPago(false);
                setOrdenCompraSeleccionada(false);
            }}
            modal_open={show_add_pago}
            onSubmit={adicionarPago}
        />}
        {pagos_proyectados.map(p => <CotizacionOrdenComrpa
            setOrdenCompraSeleccionada={setOrdenCompraSeleccionada}
            orden_compra={p} key={p.id}
            openAplicarPago={() => setAddPago(true)}
        />)}
    </div>
}

export default CotizacionAcuerdoPagoList;