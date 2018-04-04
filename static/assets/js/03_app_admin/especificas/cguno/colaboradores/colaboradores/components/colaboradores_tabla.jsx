import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            onCreateColaboradorUsuario,
            permisos_object
        } = this.props;


        return (
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Personal",
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
                                Header: "Cargo",
                                accessor: "cargo_descripcion",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] ? row[filter.id].includes(filter.value.toUpperCase()) : false
                                }
                            },
                            {
                                Header: "Cat. Centro Costo",
                                accessor: "centro_costo_padre_nombre",
                                maxWidth: 200,
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
                                Header: "Aprendiz",
                                accessor: "es_aprendiz",
                                maxWidth: 50,
                                Cell: row => (
                                    row.value && <div className='text-center' style={{color: 'green'}}><i
                                        className={'fas fa-check-circle'}></i></div>
                                )
                            },
                            {
                                Header: "En Proy.",
                                accessor: "en_proyectos",
                                maxWidth: 60,
                                Cell: row => (
                                    row.value && <div className='text-center' style={{color: 'green'}}><i
                                        className={'fas fa-check-circle'}></i></div>
                                )
                            },
                            {
                                Header: "Sal. Fijo",
                                accessor: "es_salario_fijo",
                                maxWidth: 60,
                                Cell: row => (
                                    row.value && <div className='text-center' style={{color: 'green'}}><i
                                        className={'fas fa-check-circle'}></i></div>
                                )
                            },
                        ]
                    },
                    {
                        Header: "Nomina",
                        columns: [
                            {
                                Header: "% Cja. Comp",
                                accessor: "porcentaje_caja_compensacion",
                                maxWidth: 70,
                                Cell: row => {
                                    return (
                                        <span>{Number(row.value).toFixed(2)}%</span>
                                    )
                                }
                            },
                            {
                                Header: "% Pension",
                                accessor: "porcentaje_pension",
                                maxWidth: 70,
                                Cell: row => {
                                    return (
                                        <span>{Number(row.value).toFixed(2)}%</span>
                                    )
                                }
                            },
                            {
                                Header: "% ARL",
                                accessor: "porcentaje_arl",
                                maxWidth: 70,
                                Cell: row => {
                                    return (
                                        <span>{Number(row.value).toFixed(4)}%</span>
                                    )
                                }
                            },
                            {
                                Header: "% Prest. Sociales",
                                accessor: "porcentaje_prestaciones_sociales",
                                maxWidth: 70,
                                Cell: row => {
                                    return (
                                        <span>{Number(row.value).toFixed(2)}%</span>
                                    )
                                }
                            },
                            {
                                Header: "% Salud",
                                accessor: "porcentaje_salud",
                                maxWidth: 70,
                                Cell: row => {
                                    return (
                                        <span>{Number(row.value).toFixed(2)}%</span>
                                    )
                                }
                            },
                            {
                                Header: "Horas Mes",
                                accessor: "nro_horas_mes",
                                maxWidth: 70,
                                Cell: row => {
                                    return (
                                        <div className='text-right'>{row.value}</div>
                                    )
                                }
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
                                    !row.value ? permisos_object.change &&
                                        <span>Crear Usuario <i
                                            onClick={() => onCreateColaboradorUsuario(row.original)}
                                            className='far fa-plus puntero'></i></span> :
                                        row.value
                                )
                            },
                            {
                                Header: "Ges. Hor.",
                                accessor: "autogestion_horas_trabajadas",
                                maxWidth: 60,
                                Cell: row => (
                                    row.original.usuario_username &&
                                    permisos_object.change ?
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
                                show: permisos_object.delete,
                                maxWidth: 45,
                                Cell: row =>
                                    !row.original.es_cguno &&
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={`${row.original.nombres} ${row.original.apellidos}`}
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

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 40,
                                Cell: row =>
                                    <Link to={`/app/admin/cguno/colaborador/detail/${row.original.id}`}>
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