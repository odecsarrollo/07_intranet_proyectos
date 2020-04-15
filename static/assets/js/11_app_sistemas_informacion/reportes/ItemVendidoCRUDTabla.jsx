import React, {memo, Fragment} from "react";
import {fechaFormatoUno, pesosColombianos} from "../../00_utilities/common";
import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import RangoFechaDate from "../../00_utilities/components/filtros/RangoFechaDate";
import * as actions from "../../01_actions/01_index";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import Table from "react-table";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {CLIENTES} from "../../permisos";

const SelectTable = selectTableHOC(Table);
const useStyles = makeStyles(theme => ({
    texto_largo: {
        fontSize: '0.7rem',
        whiteSpace: 'normal'
    },
}));

const ItemVendidoCRUDTabla = memo(props => {
    const dispatch = useDispatch();
    let data = _.orderBy(props.list, ['factura_nro', 'factura_fecha'], ['desc', 'desc']);
    const permisos_cliente = useTengoPermisos(CLIENTES);
    data = data.map(f => ({
        ...f,
        porcentaje_rentabilidad: parseFloat(((f.rentabilidad / f.venta_bruta)) * 100).toFixed(2),
        ano: new Date(f.factura_fecha).getFullYear()
    }));
    const {
        permisos_object,
        onSelectItemEdit,
        con_busqueda_rango = false,
        selection,
        getTrGroupProps,
        isSelected,
        toggleAll,
        checkboxTable,
        selectAll,
        toggleSelection,
        rowFn,
        singular_name,
    } = props;
    const classes = useStyles();
    // const venta_bruta = data.map(f => parseFloat(f.venta_bruta)).reduce((uno, dos) => uno + dos, 0);
    // const rentabilidad = data.map(f => parseFloat(f.rentabilidad)).reduce((uno, dos) => uno + dos, 0);
    // const costo_total = data.map(f => parseFloat(f.costo_total)).reduce((uno, dos) => uno + dos, 0);
    const onBuscarItems = (fecha_inicial, fecha_final) => dispatch(actions.fetchItemsFacturasPorRangoFecha(fecha_inicial, fecha_final));
    return (
        <Fragment>
            {con_busqueda_rango && <RangoFechaDate onFiltarPorRangoMethod={onBuscarItems}/>}
            <SelectTable
                ref={r => checkboxTable.current = r}
                getTrGroupProps={getTrGroupProps}
                selection={selection}
                selectType="checkbox"
                isSelected={isSelected}
                selectAll={selectAll}
                toggleSelection={toggleSelection}
                toggleAll={toggleAll}
                keyField="id"
                previousText='Anterior'
                nextText='Siguiente'
                pageText='Página'
                ofText='de'
                rowsText='filas'
                getTrProps={rowFn}
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Referencia",
                                accessor: 'referencia_item',
                                maxWidth: 100,
                                minWidth: 100,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                filterable: true
                            },
                            {
                                Header: "Descripción",
                                accessor: 'descripcion_item',
                                maxWidth: 300,
                                minWidth: 300,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                filterable: true
                            },
                            {
                                Header: "Factura.",
                                maxWidth: 80,
                                accessor: 'factura_nro',
                                minWidth: 80,
                                filterable: true,
                                filterMethod: (filter, row) => `${row._original.factura_tipo}-${row._original.factura_nro}`.includes(filter.value.toUpperCase()),
                                Cell: row => <div>{row.original.factura_tipo}-{row.original.factura_nro}</div>
                            },
                            {
                                Header: "Fecha Documento",
                                accessor: 'fecha_documento',
                                maxWidth: 150,
                                minWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => `${fechaFormatoUno(row._original.fecha_documento).toString()}`.includes(filter.value.toLowerCase()),
                                Cell: row => <div>{fechaFormatoUno(row.value)}</div>
                            },
                            {
                                Header: "Año",
                                accessor: 'ano',
                                maxWidth: 70,
                                minWidth: 70,
                                filterable: true,
                                Cell: row => <div className='text-right'>{row.value}</div>
                            },
                            {
                                Header: "Marca",
                                accessor: 'marca',
                                maxWidth: 200,
                                minWidth: 200,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                filterable: true
                            },
                            {
                                Header: "Cliente",
                                accessor: "cliente_nombre",
                                maxWidth: 250,
                                minWidth: 250,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                filterable: true,
                                Cell: row => <div className={classes.texto_largo}>
                                    {permisos_cliente.detail ?
                                        <Link to={`/app/ventas_componentes/clientes/detail/${row.original.cliente}`}
                                              target='_blank'>
                                            {row.value}
                                        </Link> : row.value}
                                </div>
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
                                //Footer: <div className='text-right'>{pesosColombianos(venta_bruta)}</div>,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "$Descuentos",
                                accessor: "dscto_netos",
                                //show: permisos_object.ver_descuentos,
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "$Costo Total",
                                accessor: "costo_total",
                                //show: permisos_object.ver_costos,
                                maxWidth: 80,
                                minWidth: 80,
                                //Footer: <div className='text-right'>{pesosColombianos(costo_total)}</div>,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "Rentabilidad",
                                accessor: "rentabilidad",
                                //show: permisos_object.ver_rentabilidad,
                                maxWidth: 80,
                                minWidth: 80,
                                //Footer: <div className='text-right'>{pesosColombianos(rentabilidad)}</div>,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
                            },
                            {
                                Header: "% Rent.",
                                accessor: "porcentaje_rentabilidad",
                                //show: permisos_object.ver_rentabilidad,
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className='text-right'>{row.value}%</div>
                            }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        </Fragment>
    );
});

export default ItemVendidoCRUDTabla;