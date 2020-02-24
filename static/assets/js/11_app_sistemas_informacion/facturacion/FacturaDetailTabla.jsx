import React, {memo} from "react";
import ReactTable from "react-table";
import {pesosColombianos} from "../../00_utilities/common";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    texto_largo: {
        fontSize: '0.7rem',
        whiteSpace: 'normal'
    },
}));

const FacturaDetailTabla = memo(props => {
    const data = props.list;
    const {permisos_factura} = props;
    const {venta_bruta, costo_total, rentabilidad} = props.factura;
    const classes = useStyles();
    return (
        <ReactTable
            data={data}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Referencia",
                            accessor: "referencia_item",
                            maxWidth: 150,
                            minWidth: 150,
                            Cell: row => <div className={classes.texto_largo}>{row.value}</div>
                        },
                        {
                            Header: "Descripción",
                            accessor: "descripcion_item",
                            maxWidth: 250,
                            minWidth: 250,
                            Cell: row => <div className={classes.texto_largo}>{row.value}</div>
                        },
                        {
                            Header: "$Precio. U",
                            accessor: "precio_uni",
                            maxWidth: 100,
                            minWidth: 100,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Cantidad",
                            accessor: "cantidad",
                            maxWidth: 70,
                            minWidth: 70,
                            Cell: row => <div className="text-right">{row.value}</div>
                        },
                        {
                            Header: "$Valor Bruto",
                            accessor: "venta_bruta",
                            maxWidth: 80,
                            minWidth: 80,
                            Footer: <div className='text-right'>{pesosColombianos(venta_bruta)}</div>,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "$Descuentos",
                            accessor: "dscto_netos",
                            show: permisos_factura.ver_descuentos,
                            maxWidth: 80,
                            minWidth: 80,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "$Costo Total",
                            accessor: "costo_total",
                            show: permisos_factura.ver_costos,
                            maxWidth: 80,
                            minWidth: 80,
                            Footer: <div className='text-right'>{pesosColombianos(costo_total)}</div>,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Rentabilidad",
                            accessor: "rentabilidad",
                            show: permisos_factura.ver_rentabilidad,
                            maxWidth: 80,
                            minWidth: 80,
                            Footer: <div className='text-right'>{pesosColombianos(rentabilidad)}</div>,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                    ]
                },
            ]}
            defaultPageSize={props.list.length}
            className="-striped -highlight tabla-maestra"
        />
    );
});

export default FacturaDetailTabla;