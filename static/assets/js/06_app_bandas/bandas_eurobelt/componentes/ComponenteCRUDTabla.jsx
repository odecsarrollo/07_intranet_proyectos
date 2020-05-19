import React, {memo, useEffect, useState} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';
import CustomIconTable from '../../../00_utilities/components/ui/icon/CustomIconTable';
import InformationDisplayDialog from '../../../00_utilities/components/ui/dialog/InformationDisplayDialog';

import ReactTable from "react-table";
import {formatoDinero, formatoMoneda, pesosColombianos} from "../../../00_utilities/common";
import Checkbox from "@material-ui/core/Checkbox";
import {useDispatch, useSelector} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import IconButtonTableSee from "../../../00_utilities/components/ui/icon/table_icon_button_detail";
import {Link} from "react-router-dom";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const data = _.map(props.list);
    const {
        singular_name,
        onDelete,
        onSelectItemEdit,
        permisos_object,
        activarDesactivarComponente
    } = props;
    const [mostrar_bandas, setMostrarBandas] = useState(false);
    const [id_componente_seleccionado, setIdComponenteSeleccionado] = useState(null);
    const dispatch = useDispatch();
    const bandas = useSelector(state => state.banda_eurobelt_bandas);
    useEffect(() => {
        if (id_componente_seleccionado) {
            dispatch(actions.clearBandasEurobelt());
            dispatch(actions.fetchBandasEurobeltxComponente(
                id_componente_seleccionado,
                {callback: () => setMostrarBandas(true)})
            );
        }
        return () => dispatch(actions.clearBandasEurobelt())
    }, [id_componente_seleccionado]);
    return (
        <div>
            {mostrar_bandas && <InformationDisplayDialog
                is_open={mostrar_bandas}
                fullScreen={true}
                onCerrar={() => {
                    dispatch(actions.clearBandasEurobelt());
                    setMostrarBandas(false);
                    setIdComponenteSeleccionado(null);
                }}
                titulo_text={`Bandas por Componente ${props.list[id_componente_seleccionado].referencia} - ${props.list[id_componente_seleccionado].nombre}`}
                cerrar_text='Cerrar'
                context_text='Estas son las bandas relacionadas con el componente'
            >
                <table className='table table-responsive table-striped'>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Ver</th>
                    </tr>
                    </thead>
                    <tbody>
                    {_.map(bandas, e =>
                        <tr key={e.id}>
                            <td>{e.id}</td>
                            <td>{e.to_string}</td>
                            <td>
                                <Link to={`/app/bandas/banda/${e.id}`} target='_blank'>
                                    <IconButtonTableSee/>
                                </Link>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </InformationDisplayDialog>}
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 40
                            },
                            {
                                Header: "Referencia",
                                accessor: "referencia",
                                maxWidth: 120,
                                minWidth: 120,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                Cell: row => {
                                    return (
                                        <div style={{
                                            fontSize: '0.7rem',
                                            whiteSpace: 'normal'
                                        }}>{row.value}</div>
                                    )
                                }
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                                maxWidth: 250,
                                minWidth: 250,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                Cell: row => {
                                    return (
                                        <div style={{
                                            fontSize: '0.8rem',
                                            whiteSpace: 'normal'
                                        }}>{row.value}</div>
                                    )
                                }
                            },
                            {
                                Header: "Proveedor",
                                accessor: "proveedor_nombre",
                                maxWidth: 90,
                                minWidth: 90,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                                Cell: row => {
                                    return (
                                        <div style={{
                                            fontSize: '0.7rem',
                                            whiteSpace: 'normal'
                                        }}>{row.value}</div>
                                    )
                                }
                            },
                            {
                                Header: "Categoria",
                                accessor: "categoria_nombre",
                                maxWidth: 90,
                                minWidth: 90,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "Costo",
                                accessor: "costo",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div
                                    className="text-right">{`${row.value} ${row.original.moneda_nombre}`}</div>
                            },
                            {
                                Header: "F. Imp.",
                                accessor: "factor_importacion",
                                maxWidth: 50,
                                minWidth: 50,
                                Cell: row => <div className="text-right">{row.value}</div>
                            },
                        ]
                    },
                    {
                        Header: "PESOS COLOMBIANOS",
                        columns: [
                            {
                                Header: "Tasa",
                                accessor: "tasa",
                                maxWidth: 50,
                                minWidth: 50,
                                Cell: row => <div
                                    className="text-right">{formatoMoneda(row.value, '$', 0)}</div>
                            },
                            {
                                Header: "Costo COP",
                                accessor: "costo_cop",
                                maxWidth: 70,
                                minWidth: 70,
                                Cell: row => <div className="text-right">{formatoMoneda(row.value, '$', 0)}</div>
                            },
                            {
                                Header: "Margen U.",
                                accessor: "margen_utilidad",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className="text-right">{`${parseFloat(row.value).toFixed(1)}%`}</div>
                            },
                            {
                                Header: "Precio Base",
                                accessor: "precio_base",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className="text-right">{formatoMoneda(row.value, '$', 0)}</div>
                            },
                            {
                                Header: "Rentabilidad",
                                accessor: "rentabilidad",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className="text-right">{formatoMoneda(row.value, '$', 0)}</div>
                            },
                        ]
                    },
                    {
                        Header: "DOLARES AMERICANOS",
                        columns: [
                            {
                                Header: "Tasa USD",
                                accessor: "tasa_usd",
                                maxWidth: 50,
                                minWidth: 50,
                                Cell: row => <div
                                    className="text-right">{formatoMoneda(row.value, '$', 4)}</div>
                            },
                            {
                                Header: "Costo USD",
                                accessor: "costo_usd",
                                maxWidth: 70,
                                minWidth: 70,
                                Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 4)}</div>
                            },
                            {
                                Header: "Margen U.",
                                accessor: "margen_utilidad",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 4)}</div>
                            },
                            {
                                Header: "Precio Base USD",
                                accessor: "precio_base_usd",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 4)}</div>
                            }
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Act.",
                                accessor: "activo",
                                maxWidth: 40,
                                minWidth: 40,
                                Cell: row => (
                                    <div className='text-center' style={{width: '100%'}}>
                                        <Checkbox
                                            style={{margin: 0, padding: 0}}
                                            color='primary'
                                            checked={row.value}
                                            onChange={() => activarDesactivarComponente(row.original.id, !row.value)}
                                        />
                                    </div>
                                )
                            },
                            {
                                Header: "Bandas",
                                accessor: "id",
                                maxWidth: 50,
                                minWidth: 50,
                                Cell: row => <CustomIconTable
                                    icon='conveyor-belt'
                                    onClick={() => setIdComponenteSeleccionado(row.value)}
                                />
                            },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 40,
                                Cell: row =>
                                    !row.original.es_cguno &&
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={`${row.original.to_string}`}
                                        element_type={singular_name}
                                    />

                            },
                            {
                                Header: "Editar",
                                show: permisos_object.change,
                                maxWidth: 40,
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
        </div>
    );
}, areEqual);

export default Tabla;