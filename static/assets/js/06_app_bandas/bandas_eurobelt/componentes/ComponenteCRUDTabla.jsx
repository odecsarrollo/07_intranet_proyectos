import React, {memo} from "react";
import MyDialogButtonDelete from '../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";
import {pesosColombianos} from "../../../00_utilities/common";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}


const Tabla = memo(props => {
    const data = _.map(props.list);
    const {
        singular_name,
        onDelete,
        onSelectItemEdit,
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
                            maxWidth: 100,
                            filterable: true
                        },
                        {
                            Header: "Nombre",
                            accessor: "nombre",
                            maxWidth: 300,
                            minWidth: 300,
                            filterable: true,
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
                            Header: "Costo",
                            accessor: "costo",
                            maxWidth: 60
                        },
                        {
                            Header: "Moneda",
                            accessor: "moneda_nombre",
                            maxWidth: 90,
                            filterable: true
                        },
                        {
                            Header: "Tasa",
                            accessor: "moneda_tasa",
                            maxWidth: 80,
                            Cell: row => pesosColombianos(row.value)
                        },
                        {
                            Header: "Fact. Impor",
                            accessor: "factor_importacion",
                            maxWidth: 80
                        },
                        {
                            Header: "Costo COP",
                            accessor: "costo_cop",
                            maxWidth: 80,
                            Cell: row => pesosColombianos(row.value)
                        },
                        {
                            Header: "Margen U.",
                            accessor: "margen_utilidad",
                            maxWidth: 80,
                            Cell: row => `${parseFloat(row.value).toFixed(1)}%`
                        },
                        {
                            Header: "Precio Base",
                            accessor: "precio_base",
                            maxWidth: 80,
                            Cell: row => pesosColombianos(row.value)
                        },
                        {
                            Header: "Rentabilidad",
                            accessor: "rentabilidad",
                            maxWidth: 80,
                            Cell: row => pesosColombianos(row.value)
                        },

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
}, areEqual);

export default Tabla;