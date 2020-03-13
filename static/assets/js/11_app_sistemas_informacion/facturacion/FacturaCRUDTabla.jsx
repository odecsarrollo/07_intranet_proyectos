import React, {memo, useState, Fragment} from "react";
import {fechaFormatoUno, pesosColombianos} from "../../00_utilities/common";
import {makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";
import CustomIconTable from "../../00_utilities/components/ui/icon/CustomIconTable";
import IconButtonTableEdit from "../../00_utilities/components/ui/icon/table_icon_button_edit";
import DialogRelacionarCotizacionComponentes from "../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import RangoFechaDate from "../../00_utilities/components/filtros/RangoFechaDate";
import * as actions from "../../01_actions/01_index";
import selectTableHOC from "react-table/lib/hoc/selectTable";
import Table from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SiNoDialog from "../../00_utilities/components/ui/dialog/SiNoDialog";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {CLIENTES} from "../../permisos";

const SelectTable = selectTableHOC(Table);
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
    const [cotizacion_seleccionada_id, setCotizacionSeleccionadaId] = useState(null);
    const [show_quitar_cotizacion, setShowQuitarCotizacion] = useState(false);
    const [show_relacionar_cotizacion_confirmacion, setShowRelacionarCotizacionConfirmacion] = useState(false);
    const [show_relacionar_cotizacion, setShowRelacionarCotizacion] = useState(false);
    const permisos_cliente = useTengoPermisos(CLIENTES);
    data = data.map(f => ({
        ...f,
        porcentaje_rentabilidad: parseFloat(((f.rentabilidad / f.venta_bruta)) * 100).toFixed(2),
        ano: new Date(f.fecha_documento).getFullYear()
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
    const venta_bruta = data.map(f => parseFloat(f.venta_bruta)).reduce((uno, dos) => uno + dos, 0);
    const rentabilidad = data.map(f => parseFloat(f.rentabilidad)).reduce((uno, dos) => uno + dos, 0);
    const costo_total = data.map(f => parseFloat(f.costo_total)).reduce((uno, dos) => uno + dos, 0);
    const cotizaciones = useSelector(state => state.cotizaciones_componentes);
    const onBuscarCotizacion = (fecha_inicial, fecha_final) => dispatch(actions.fetchFacturasPorRangoFecha(fecha_inicial, fecha_final));
    const onRelacionarFactura = () => dispatch(actions.relacionarCotizacionComponenteFactura(factura_a_relacionar, cotizacion_seleccionada_id, 'add', {
        callback: () => {
            setShowRelacionarCotizacionConfirmacion(false);
            setCotizacionSeleccionadaId(null);
        }
    }));
    const onQuitarCotizacion = () => dispatch(actions.relacionarCotizacionComponenteFactura(factura_a_relacionar, cotizacion_seleccionada_id, 'rem', {
        callback: () => {
            setShowQuitarCotizacion(false);
            setCotizacionSeleccionadaId(null);
        }
    }));
    return (
        <Fragment>
            {show_quitar_cotizacion && <SiNoDialog
                onSi={onQuitarCotizacion}
                onNo={() => {
                    setShowQuitarCotizacion(false);
                    setCotizacionSeleccionadaId(null);
                }}
                is_open={show_quitar_cotizacion}
                titulo='Quitar Cotización'
            >
                Desea quitar la cotización?
            </SiNoDialog>}
            {show_relacionar_cotizacion_confirmacion && <SiNoDialog
                onSi={onRelacionarFactura}
                onNo={() => {
                    setShowRelacionarCotizacionConfirmacion(false);
                    setCotizacionSeleccionadaId(null)
                }}
                is_open={show_relacionar_cotizacion_confirmacion}
                titulo={`Confirmar Relacionar Cotización de ${cotizaciones[cotizacion_seleccionada_id].cliente_nombre}`}
            >
                Desea realmente relacionar la cotización {cotizaciones[cotizacion_seleccionada_id].nro_consecutivo} con
                estado {cotizaciones[cotizacion_seleccionada_id].estado_display}?
                {cotizaciones[cotizacion_seleccionada_id].estado !== 'FIN' && <div style={{color: 'red'}}>
                    EL ESTADO DE LA COTIZACIÓN SE PASARÁ A Entragada Totalmente, esta de acuerdo?
                </div>}
            </SiNoDialog>}
            {show_relacionar_cotizacion && <DialogRelacionarCotizacionComponentes
                exclude_ids={_.mapKeys(props.list, 'id')[factura_a_relacionar].cotizaciones_componentes.map(e => e.id)}
                placeholder='Cotización a buscar'
                texto_cancelar='Cerrar'
                id_text='id'
                min_caracteres={0}
                selected_item_text='texto'
                onSearch={null}
                onSelect={cotizacion_id => {
                    setCotizacionSeleccionadaId(cotizacion_id);
                    setShowRelacionarCotizacionConfirmacion(true);
                }}
                onCancelar={() => {
                    setShowRelacionarCotizacion(false);
                    setFacturaARelacionar(null);
                    dispatch(actions.clearCotizacionesComponentes())
                }}
                listado={_.map(cotizaciones, c => ({
                    id: c.id,
                    texto: `${c.cliente_nombre.substring(0, 15)}... (${c.nro_consecutivo})`
                }))}
                open={show_relacionar_cotizacion}
                select_boton_text='Relacionar'
                titulo_modal={`Relacionar Cotización de ${_.mapKeys(props.list, 'id')[factura_a_relacionar].cliente_nombre}`}
                onUnMount={() => dispatch(actions.clearCotizacionesComponentes())}
            />}
            {con_busqueda_rango && <RangoFechaDate onFiltarPorRangoMethod={onBuscarCotizacion}/>}
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
                            {
                                Header: "Cotizaciones",
                                accessor: "cotizaciones_componentes",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className='row text-center'>
                                    {row.value.map(c => <div className="col-12" key={c.id}>
                                        <Link to={`/app/ventas_componentes/cotizaciones/detail/${c.id}`}
                                              target='_blank'>
                                            {c.nro_consecutivo}
                                        </Link>
                                        <FontAwesomeIcon icon={'times'} className='puntero m-1' size='sm'
                                                         onClick={() => {
                                                             setCotizacionSeleccionadaId(c.id);
                                                             setFacturaARelacionar(row.original.id);
                                                             setShowQuitarCotizacion(true)
                                                         }}/>
                                    </div>)}
                                </div>
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
                                            setShowRelacionarCotizacion(true);
                                            setFacturaARelacionar(row.value);
                                            dispatch(actions.fetchCotizacionesComponentesClienteParaRelacionarFactura(_.mapKeys(props.list, 'id')[row.value].cliente))
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