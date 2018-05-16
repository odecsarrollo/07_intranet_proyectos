import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            proyectos_permisos
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
                                Header: "Nro. Cotizacion",
                                accessor: "nro_cotizacion",
                                maxWidth: 150
                            },
                            {
                                Header: "Nro. Proyecto",
                                accessor: "id_proyecto",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => {
                                    return (
                                        proyectos_permisos.detail ?
                                            <Link
                                                to={`/app/proyectos/proyectos/detail/${row.original.mi_proyecto}`}>
                                                <span>{row.value}</span>
                                            </Link> :
                                            <span>{row.value}</span>
                                    )
                                }
                            },
                            {
                                Header: "Uni. Nego",
                                accessor: "unidad_negocio",
                                maxWidth: 100,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Cliente",
                                accessor: "cliente",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Responsable",
                                maxWidth: 250,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    const {_original: {responsable}} = row;
                                    if (responsable) {
                                        const {_original: {responsable_nombres, responsable_apellidos}} = row;
                                        return (
                                            responsable_apellidos.toUpperCase().includes(filter.value.toUpperCase()) ||
                                            responsable_nombres.toUpperCase().includes(filter.value.toUpperCase())
                                        )
                                    } else {
                                        return false
                                    }
                                },
                                Cell: row => {
                                    return <span>{row.original.responsable && `${row.original.responsable_nombres} ${row.original.responsable_apellidos}`}</span>
                                }
                            },
                            {
                                Header: "Descripción",
                                accessor: "descripcion_cotizacion",
                                maxWidth: 600,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Estado",
                                accessor: "estado",
                                maxWidth: 350,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                                },
                                Cell: row => {
                                    const seguimiento_1 = row.value.includes('Seguimiento - 1');
                                    const seguimiento_2 = row.value.includes('Seguimiento - 2');
                                    const seguimiento_3 = row.value.includes('Seguimiento - 3');
                                    const seguimiento_4 = row.value.includes('Seguimiento - 4');
                                    const seguimiento_5 = row.value.includes('Seguimiento - 5');
                                    let backgroundColor = 'transparent';
                                    let color = 'black';
                                    if (seguimiento_1) {
                                        backgroundColor = 'green';
                                        color = 'white';
                                    }
                                    if (seguimiento_2) {
                                        backgroundColor = 'yellow';
                                    }
                                    if (seguimiento_3) {
                                        backgroundColor = 'yellow';
                                    }
                                    if (seguimiento_4) {
                                        backgroundColor = 'yellow';
                                    }
                                    if (seguimiento_5) {
                                        color = 'white';
                                        backgroundColor = 'red';
                                    }
                                    return (
                                        <div style={{backgroundColor, color}} className='pl-2'>{row.value}</div>
                                    )
                                }
                            },
                            {
                                Header: "$ Oferta",
                                accessor: "valor_ofertado",
                                maxWidth: 100,
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
                                maxWidth: 60,
                                Cell: row =>
                                    <MyDialogButtonDelete
                                        onDelete={() => {
                                            onDelete(row.original)
                                        }}
                                        element_name={row.original.descripcion_cotizacion}
                                        element_type={singular_name}
                                    />

                            },
                            {
                                Header: "Editar",
                                show: permisos_object.change,
                                maxWidth: 60,
                                Cell: row =>
                                    <IconButtonTableEdit
                                        onClick={() => {
                                            onSelectItemEdit(row.original);
                                        }}/>

                            },
                            {
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/proyectos/cotizaciones/cotizaciones/detail/${row.original.id}`}>
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