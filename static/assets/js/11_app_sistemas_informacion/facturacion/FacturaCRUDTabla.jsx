import React, {memo} from "react";
import ReactTable from "react-table";
import {fechaHoraFormatoUno, pesosColombianos} from "../../00_utilities/common";
import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";
import IconButtonTableEdit from "../../00_utilities/components/ui/icon/table_icon_button_edit";

const useStyles = makeStyles(theme => ({
    texto_largo: {
        fontSize: '0.7rem',
        whiteSpace: 'normal'
    },
}));

const FacturaCRUDTabla = memo(props => {
    const data = _.orderBy(props.list, ['fecha_documento'], ['desc']);
    const {
        permisos_object,
        onSelectItemEdit
    } = props;
    const classes = useStyles();
    const venta_bruta = data.map(f => parseFloat(f.venta_bruta)).reduce((uno, dos) => uno + dos, 0);
    const rentabilidad = data.map(f => parseFloat(f.rentabilidad)).reduce((uno, dos) => uno + dos, 0);
    const costo_total = data.map(f => parseFloat(f.costo_total)).reduce((uno, dos) => uno + dos, 0);
    return (
        <ReactTable
            data={data}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Nro.",
                            maxWidth: 150,
                            minWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => `${row._original.tipo_documento}-${row._original.nro_documento}`.includes(filter.value.toUpperCase()),
                            Cell: row => <div>{row.original.tipo_documento}-{row.original.nro_documento}</div>
                        },
                        {
                            Header: "Fecha Documento",
                            accessor: 'fecha_documento',
                            maxWidth: 150,
                            minWidth: 150,
                            Cell: row => <div>{fechaHoraFormatoUno(row.value)}</div>
                        },
                        {
                            Header: "Cliente",
                            accessor: "cliente_nombre",
                            maxWidth: 250,
                            minWidth: 250,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            filterable: true,
                            Cell: row => <div className={classes.texto_largo}>{row.value}</div>
                        },
                        {
                            Header: "Vendedor",
                            maxWidth: 250,
                            minWidth: 250,
                            accessor: "prueba",
                            filterMethod: (filter, row) => `${row._original.vendedor_nombre}-${row._original.vendedor_apellido}`.includes(filter.value.toUpperCase()),
                            filterable: true,
                            Cell: row => <div
                                className={classes.texto_largo}>{row.original.vendedor_nombre} {row.original.vendedor_apellido} </div>
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
                            show: permisos_object.ver_descuentos,
                            maxWidth: 80,
                            minWidth: 80,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "$Costo Total",
                            accessor: "costo_total",
                            show: permisos_object.ver_costos,
                            maxWidth: 80,
                            minWidth: 80,
                            Footer: <div className='text-right'>{pesosColombianos(costo_total)}</div>,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Rentabilidad",
                            accessor: "rentabilidad",
                            show: permisos_object.ver_rentabilidad,
                            maxWidth: 80,
                            minWidth: 80,
                            Footer: <div className='text-right'>{pesosColombianos(rentabilidad)}</div>,
                            Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                        },
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
                        {
                            Header: "Ver",
                            accessor: "id",
                            show: permisos_object.detail,
                            maxWidth: 40,
                            Cell: row => {
                                return (
                                    <Link to={`/app/ventas_componentes/facturas/detail/${row.value}`}
                                          target='_blank'>
                                        <IconButtonTableSee/>
                                    </Link>
                                )
                            }

                        },
                        {
                            Header: "Editar",
                            show: permisos_object.change,
                            maxWidth: 45,
                            Cell: row =>
                                <IconButtonTableEdit
                                    onClick={() => {
                                        onSelectItemEdit(row.original);
                                    }}/>

                        }
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
});

export default FacturaCRUDTabla;