import React, {memo, useState, Fragment} from "react";
import ReactTable from "react-table";
import {fechaFormatoUno, pesosColombianos} from "../../00_utilities/common";
import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";
import CustomIconTable from "../../00_utilities/components/ui/icon/CustomIconTable";
import IconButtonTableEdit from "../../00_utilities/components/ui/icon/table_icon_button_edit";
import DialogRelacionarCotizacionComponentes from "../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import * as actions from "../../01_actions/01_index";

const useStyles = makeStyles(theme => ({
    texto_largo: {
        fontSize: '0.7rem',
        whiteSpace: 'normal'
    },
}));

const FacturaCRUDTabla = memo(props => {
    const dispatch = useDispatch();
    let data = _.orderBy(props.list, ['nro_documento', 'fecha_documento'], ['desc', 'desc']);
    const [factura_a_relacionar, setFacturaARelacionar] = useState(null);
    data = data.map(f => ({
        ...f,
        porcentaje_rentabilidad: parseFloat(((f.rentabilidad / f.venta_bruta)) * 100).toFixed(2),
        ano: new Date(f.fecha_documento).getFullYear()
    }));
    const {
        permisos_object,
        onSelectItemEdit
    } = props;
    const classes = useStyles();
    const venta_bruta = data.map(f => parseFloat(f.venta_bruta)).reduce((uno, dos) => uno + dos, 0);
    const rentabilidad = data.map(f => parseFloat(f.rentabilidad)).reduce((uno, dos) => uno + dos, 0);
    const costo_total = data.map(f => parseFloat(f.costo_total)).reduce((uno, dos) => uno + dos, 0);
    const cotizaciones = useSelector(state => state.cotizaciones_componentes);
    const buscarCotizacionComponentes = (parametro) => dispatch(actions.fetchCotizacionesComponentesParaRelacionarFactura(parametro));
    const onRelacionarFactura = (cotizacion) => dispatch(actions.relacionarCotizacionComponenteFactura(factura_a_relacionar, cotizacion, 'add'));
    return (
        <Fragment>
            {factura_a_relacionar && <DialogRelacionarCotizacionComponentes
                exclude_ids={_.mapKeys(props.list, 'id')[factura_a_relacionar].cotizaciones_componentes}
                placeholder='Cotización a buscar'
                id_text='id'
                min_caracteres={3}
                selected_item_text='nro_consecutivo'
                onSearch={buscarCotizacionComponentes}
                onSelect={onRelacionarFactura}
                onCancelar={() => setFacturaARelacionar(null)}
                listado={_.map(cotizaciones)}
                open={factura_a_relacionar !== null}
                select_boton_text='Relacionar'
                titulo_modal={'Relacionar Cotización'}
                onUnMount={() => dispatch(actions.clearCotizacionesComponentes())}
            />}
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
                            {
                                Header: "% Rent.",
                                accessor: "porcentaje_rentabilidad",
                                show: permisos_object.ver_rentabilidad,
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className='text-right'>{row.value}%</div>
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

                            },
                            {
                                Header: "R. Cot.",
                                accessor: 'id',
                                maxWidth: 45,
                                Cell: row =>
                                    <CustomIconTable
                                        icon='code-merge'
                                        onClick={() => {
                                            setFacturaARelacionar(row.value);
                                        }}/>

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

export default FacturaCRUDTabla;