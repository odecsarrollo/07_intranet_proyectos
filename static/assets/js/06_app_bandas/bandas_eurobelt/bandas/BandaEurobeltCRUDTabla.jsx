import React, {memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';

import ReactTable from "react-table";
import {Link} from "react-router-dom";
import {pesosColombianos, formatoDinero} from "../../../00_utilities/common";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Checkbox from "@material-ui/core/Checkbox";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}


const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['nombre'], ['asc']);
    const {
        singular_name,
        onDelete,
        permisos_object,
        updateItem
    } = props;
    return (
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
                            maxWidth: 350,
                            minWidth: 350,
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
                            accessor: "to_string",
                            minWidth: 300,
                            maxWidth: 300,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            Cell: row => <div style={{
                                fontSize: '0.7rem',
                                whiteSpace: 'normal'
                            }}>{row.value}</div>
                        },
                        {
                            Header: "Emp.",
                            accessor: "con_empujador",
                            minWidth: 40,
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>{row.value &&
                            <FontAwesomeIcon icon={'check'}/>}</div>
                        },
                        {
                            Header: "Aleta",
                            accessor: "con_aleta",
                            minWidth: 40,
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>{row.value &&
                            <FontAwesomeIcon icon={'check'}/>}</div>
                        },
                        {
                            Header: "Tor.V",
                            accessor: "con_torneado_varilla",
                            minWidth: 40,
                            maxWidth: 40,
                            Cell: row => <div className='text-center'>{row.value &&
                            <FontAwesomeIcon icon={'check'}/>}</div>
                        }
                    ]
                },
                {
                    Header: "PESOS COLOMBIANOS",
                    columns: [
                        {
                            Header: "Costo",
                            accessor: "costo_cop",
                            minWidth: 70,
                            maxWidth: 70,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Precio",
                            accessor: "precio_base",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Val. MO",
                            accessor: "precio_mano_obra",
                            minWidth: 60,
                            maxWidth: 60,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Total",
                            accessor: "precio_con_mano_obra",
                            minWidth: 70,
                            maxWidth: 70,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                        {
                            Header: "Rentabilidad",
                            accessor: "rentabilidad",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => <div className="text-right">{pesosColombianos(row.value)}</div>
                        },
                    ]
                },
                {
                    Header: "DOLARES AMERICANOS",
                    columns: [
                        {
                            Header: "Costo USD",
                            accessor: "costo_usd",
                            minWidth: 70,
                            maxWidth: 70,
                            Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 2)}</div>
                        },
                        {
                            Header: "Precio USD",
                            accessor: "precio_base_usd",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 2)}</div>
                        },
                        {
                            Header: "Val. MO USD",
                            accessor: "precio_mano_obra_usd",
                            minWidth: 60,
                            maxWidth: 60,
                            Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 2)}</div>
                        },
                        {
                            Header: "Total USD",
                            accessor: "precio_con_mano_obra_usd",
                            minWidth: 70,
                            maxWidth: 70,
                            Cell: row => <div className="text-right">{formatoDinero(row.value, '$', 2)}</div>
                        },]
                },
                {
                    Header: "Opciones",
                    columns: [
                        {
                            Header: "Activo",
                            accessor: "activo",
                            maxWidth: 50,
                            Cell: row => (
                                <div className='text-center' style={{width: '100%'}}>
                                    <Checkbox
                                        style={{margin: 0, padding: 0}}
                                        color='primary'
                                        checked={row.value}
                                        onChange={() => updateItem({...row.original, activo: !row.value})}
                                    />
                                </div>
                            )
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
                            Header: "Ver",
                            show: permisos_object.detail,
                            maxWidth: 40,
                            Cell: row =>
                                <Link to={`/app/bandas/banda/${row.original.id}`}>
                                    <IconButtonTableSee/>
                                </Link>

                        }
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
}, areEqual);

export default Tabla;