import React, {memo} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {numeroFormato, pesosColombianos} from "../../../00_utilities/common";
import {Link} from "react-router-dom";

const InformeTunelVentasTabla = memo(props => {
    const {cotizaciones_seleccionardas: {campo_valor, lista, estado, responsable}, limpiarLista} = props;
    const valor = lista.reduce((suma, elemento) => parseFloat(suma) + parseFloat(elemento[campo_valor]), 0);
    return (
        <Dialog
            scroll='paper'
            fullScreen={false}
            open={lista.length > 0}
        >
            <DialogTitle id="responsive-dialog-title">
                {responsable} - {estado}
            </DialogTitle>
            <DialogContent>
                <table className='table table-striped'>
                    <thead>
                    <tr>
                        <th>Cotización</th>
                        <th>Cliente</th>
                        <th>Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lista.map(i => <tr key={i.id}>
                        <td>
                            <Link to={`/app/ventas_proyectos/cotizaciones/cotizaciones/detail/${i.id}`}
                                  target={'_blank'}>
                                {i.unidad_negocio}-{i.nro_cotizacion}
                            </Link>
                        </td>
                        <td>{i.cliente_nombre}</td>
                        <td style={{textAlign: 'right'}}> {pesosColombianos(i[campo_valor])}</td>
                    </tr>)}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td>{pesosColombianos(valor)}</td>
                    </tr>
                    </tfoot>
                </table>
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    variant="contained"
                    className='ml-3'
                    onClick={limpiarLista}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
});


export default InformeTunelVentasTabla;