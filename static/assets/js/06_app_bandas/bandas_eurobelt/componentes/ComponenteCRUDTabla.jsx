import React, {memo, useEffect, useState} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';
import CustomIconTable from '../../../00_utilities/components/ui/icon/CustomIconTable';
import InformationDisplayDialog from '../../../00_utilities/components/ui/dialog/InformationDisplayDialog';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../00_utilities/common";
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
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre",
                                maxWidth: 300,
                                minWidth: 300,
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
                                maxWidth: 100,
                                minWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "Categoria",
                                accessor: "categoria_nombre",
                                maxWidth: 150,
                                minWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "Costo",
                                accessor: "costo",
                                maxWidth: 60
                            },
                            {
                                Header: "Moneda",
                                accessor: "moneda_nombre",
                                maxWidth: 90,
                                filterable: true,
                                filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            },
                            {
                                Header: "Tasa",
                                accessor: "moneda_tasa",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Fact. Impor",
                                accessor: "factor_importacion",
                                maxWidth: 80,
                                minWidth: 80,
                            },
                            {
                                Header: "Costo COP",
                                accessor: "costo_cop",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Margen U.",
                                accessor: "margen_utilidad",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => `${parseFloat(row.value).toFixed(1)}%`
                            },
                            {
                                Header: "Precio Base",
                                accessor: "precio_base",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Rentabilidad",
                                accessor: "rentabilidad",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => pesosColombianos(row.value)
                            },
                            {
                                Header: "Activo",
                                accessor: "activo",
                                maxWidth: 60,
                                minWidth: 60,
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

                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Bandas",
                                accessor: "id",
                                maxWidth: 50,
                                Cell: row => <CustomIconTable
                                    icon='conveyor-belt'
                                    onClick={() => setIdComponenteSeleccionado(row.value)}
                                />
                            },
                            {
                                Header: "Elimi.",
                                show: permisos_object.delete,
                                maxWidth: 45,
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
        </div>
    );
}, areEqual);

export default Tabla;