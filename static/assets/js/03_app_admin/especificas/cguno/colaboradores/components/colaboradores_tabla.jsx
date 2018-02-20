import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            mi_cuenta,
            onDelete,
            onSelectItem,
            onCreateColaboradorUsuario,
            handleOpen,
            can_detail,
            can_make_superuser,
            can_make_staff,
            can_make_active,
            can_delete,
            can_change
        } = this.props;


        return (
            <div>
                <ReactTable
                    data={data}
                    columns={[
                        {
                            Header: "Personal",
                            columns: [
                                {
                                    Header: "Cédula",
                                    accessor: "cedula",
                                    maxWidth: 150,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toLowerCase())
                                    }
                                },
                                {
                                    Header: "Nombres",
                                    accessor: "nombres",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Apellidos",
                                    accessor: "apellidos",
                                    maxWidth: 200,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "De CGUno",
                                    accessor: "es_cguno",
                                    maxWidth: 80,
                                    Cell: row => (
                                        row.value && <i className={'far fa-check-circle'}></i>
                                    )
                                },
                                {
                                    Header: "En Proy.",
                                    accessor: "en_proyectos",
                                    maxWidth: 80,
                                    Cell: row => (
                                        can_change ?
                                            <Checkbox
                                                checked={row.value}
                                                onCheck={() => updateItem({
                                                    ...row.original,
                                                    en_proyectos: !row.value
                                                })}
                                            />
                                            :
                                            row.value && <i className='far fa-check-circle'></i>
                                    )
                                },
                            ]
                        },
                        {
                            Header: "Acceso",
                            columns: [
                                {
                                    Header: "Username",
                                    accessor: "usuario_username",
                                    maxWidth: 150,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id] ? row[filter.id].includes(filter.value.toLowerCase()) : false
                                    },
                                    Cell: row => (
                                        !row.value ? can_change &&
                                            <span>Crear Usuario <i
                                                onClick={() => onCreateColaboradorUsuario(row.original)}
                                                className='far fa-plus puntero'></i></span> :
                                            row.value
                                    )
                                },
                                {
                                    Header: "Ges. Horas",
                                    accessor: "autogestion_horas_trabajadas",
                                    maxWidth: 80,
                                    Cell: row => (
                                        can_change ?
                                            <Checkbox
                                                checked={row.value}
                                                onCheck={() => updateItem({
                                                    ...row.original,
                                                    autogestion_horas_trabajadas: !row.value
                                                })}
                                            /> :
                                            row.value && <i className='far fa-check-circle'></i>
                                    )
                                },
                            ]
                        },
                        {
                            Header: "Opciones",
                            columns: [
                                {
                                    Header: "Elimi.",
                                    show: can_delete,
                                    maxWidth: 60,
                                    Cell: row =>
                                        !row.original.es_cguno &&
                                        <MyDialogButtonDelete
                                            onDelete={() => {
                                                onDelete(row.original)
                                            }}
                                            element_name={`${row.original.nombres} ${row.original.apellidos}`}
                                            element_type='Colaborador'
                                        />

                                },
                                {
                                    Header: "Editar",
                                    show: can_change,
                                    maxWidth: 60,
                                    Cell: row =>
                                        !row.original.es_cguno &&
                                        <IconButtonTableEdit
                                            onClick={() => {
                                                onSelectItem(row.original);
                                                handleOpen()
                                            }}/>

                                },
                                {
                                    Header: "Ver",
                                    show: can_detail,
                                    maxWidth: 60,
                                    Cell: row =>
                                        <Link to={`/app/admin/colaboradores/detail/${row.original.id}`}>
                                            <IconButtonTableSee/>
                                        </Link>

                                }
                            ]
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight tabla-maestra"
                />
            </div>
        );
    }
}

export default Tabla;