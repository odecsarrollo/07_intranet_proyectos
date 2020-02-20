import React, {memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from '../../../00_utilities/components/ui/icon/table_icon_button_detail';

import ReactTable from "react-table";
import {Link} from "react-router-dom";
import {pesosColombianos} from "../../../00_utilities/common";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}


const Tabla = memo(props => {
    const data = _.orderBy(props.list, ['nombre'], ['asc']);
    const {
        singular_name,
        onDelete,
        permisos_object
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
                        },
                        {
                            Header: "Nombre",
                            accessor: "to_string",
                            minWidth: 400,
                            maxWidth: 400,
                            filterable: true,
                            filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                            Cell: row => <div style={{
                                fontSize: '0.8rem',
                                whiteSpace: 'normal'
                            }}>{row.value}</div>
                        },
                        {
                            Header: "Costo",
                            accessor: "costo_cop",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => `${pesosColombianos(row.value)}`
                        },
                        {
                            Header: "Precio",
                            accessor: "precio_base",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => `${pesosColombianos(row.value)}`
                        },
                        {
                            Header: "Vlr. Mano Obra",
                            accessor: "precio_mano_obra",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => `${pesosColombianos(row.value)}`
                        },
                        {
                            Header: "Precio con Mano Obra",
                            accessor: "precio_con_mano_obra",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => `${pesosColombianos(row.value)}`
                        },
                        {
                            Header: "Rentabilidad",
                            accessor: "rentabilidad",
                            minWidth: 80,
                            maxWidth: 80,
                            Cell: row => `${pesosColombianos(row.value)}`
                        },
                        {
                            Header: "Empuja.",
                            accessor: "con_empujador",
                            minWidth: 50,
                            maxWidth: 50,
                            Cell: row => <div>{row.value && <FontAwesomeIcon icon={'check'}/>}</div>
                        }, ,
                        {
                            Header: "Aleta",
                            accessor: "con_aleta",
                            minWidth: 50,
                            maxWidth: 50,
                            Cell: row => <div>{row.value && <FontAwesomeIcon icon={'check'}/>}</div>
                        },
                        {
                            Header: "Torn.V",
                            accessor: "con_torneado_varilla",
                            minWidth: 50,
                            maxWidth: 50,
                            Cell: row => <div>{row.value && <FontAwesomeIcon icon={'check'}/>}</div>
                        }
                    ]
                },
                {
                    Header: "Opciones",
                    columns: [
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