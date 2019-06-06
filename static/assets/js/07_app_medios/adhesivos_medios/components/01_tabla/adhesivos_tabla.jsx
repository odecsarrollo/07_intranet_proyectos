import React from "react";
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableEdit from '../../../../00_utilities/components/ui/icon/table_icon_button_edit';

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;

        return (
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Codigo",
                                accessor: "codigo",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Alto",
                                accessor: "alto",
                    
                            },
                            {
                                Header: "Ancho",
                                accessor: "ancho",
                              
                            },
                            {
                                Header: "Stock Minimo",
                                accessor: "stock_min",
                          
                            },
                            {
                                Header: "Descripcion",
                                accessor: "descripcion",
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                }

                            },
                            {
                                Header: "Imagen",
                                Cell: ({original}) =>(
                                    <div style={{textAlign:'center', width: '100%'}}>
                                        <img src={original.imagen_small}></img>
                                    </div>
                                )

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
    }
}

export default Tabla;