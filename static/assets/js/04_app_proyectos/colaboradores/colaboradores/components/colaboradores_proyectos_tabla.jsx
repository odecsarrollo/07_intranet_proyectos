import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        let data = this.props.data;
        if (_.size(data) > 0) {
            data = data.filter(c => c.en_proyectos);
        }
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object
        } = this.props;


        return (
            <ReactTable
                data={data}
                noDataText={`No hay elementos para mostrar tipo ${singular_name}`}
                columns={[
                    {
                        Header: "Caracteristicas",
                        columns: [
                            {
                                Header: "Cédula",
                                accessor: "cedula",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toLowerCase())
                                }
                            },
                            {
                                Header: "Nombres",
                                maxWidth: 320,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return (
                                        row._original.nombres.includes(filter.value.toUpperCase()) ||
                                        row._original.apellidos.includes(filter.value.toUpperCase())
                                    )
                                },
                                Cell: row => `${row.original.nombres} ${row.original.apellidos}`
                            },
                            {
                                Header: "Username",
                                accessor: "usuario_username",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] ? row[filter.id].includes(filter.value.toLowerCase()) : false
                                },
                                Cell: row => row.value
                            },
                            {
                                Header: "Cargo",
                                accessor: "cargo_descripcion",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] ? row[filter.id].includes(filter.value.toUpperCase()) : false
                                }
                            },
                            {
                                Header: "Centro Costo",
                                accessor: "centro_costo_nombre",
                                maxWidth: 200,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] ? row[filter.id].includes(filter.value.toUpperCase()) : false
                                }
                            },
                            {
                                Header: "CGUno",
                                accessor: "es_cguno",
                                maxWidth: 50,
                                Cell: row => (
                                    row.value && <div className='text-center' style={{color: 'green'}}><i
                                        className={'fas fa-check-circle'}></i></div>
                                )
                            },
                            {
                                Header: "Ges. Hor.",
                                accessor: "autogestion_horas_trabajadas",
                                maxWidth: 70,
                                Cell: row => (
                                    row.value && <div className='text-center' style={{color: 'green'}}><i
                                        className={'fas fa-check-circle'}></i></div>
                                )
                            },
                        ]
                    },
                    {
                        Header: "Opciones",
                        columns: [
                            {
                                Header: "Ver",
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/proyectos/colaboradores/colaboradores/detail/${row.original.id}`}>
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
    }
}

export default Tabla;