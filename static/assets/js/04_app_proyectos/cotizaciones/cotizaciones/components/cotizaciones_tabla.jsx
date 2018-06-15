import React from "react";
import Checkbox from 'material-ui/Checkbox';
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    render() {

        const data = _.orderBy(this.props.data, ['nro_cotizacion'], ['desc']);
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
                                Header: "Nro. Coti",
                                accessor: "nro_cotizacion",
                                maxWidth: 70
                            },
                            {
                                Header: "Nro. OP",
                                accessor: "id_proyecto",
                                maxWidth: 80,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => {
                                    const id_proyecto = row.original.mi_proyecto;
                                    const id_literal = row.original.mi_literal;
                                    const id_proyecto_mostrar = id_proyecto ? row.original.id_proyecto : row.original.mi_literal_id_literal;
                                    const id_proyecto_url = id_literal ? row.original.mi_literal_proyecto_id : row.original.mi_proyecto;
                                    return (
                                        proyectos_permisos.detail ?
                                            <Link
                                                to={`/app/proyectos/proyectos/detail/${id_proyecto_url}`}>
                                                <span>{id_proyecto_mostrar}</span>
                                            </Link> :
                                            <span>{id_proyecto_mostrar}</span>
                                    )
                                }
                            },
                            {
                                Header: "Uni. Nego",
                                accessor: "unidad_negocio",
                                maxWidth: 80,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Cliente",
                                accessor: "cliente_nombre",
                                maxWidth: 150,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id].includes(filter.value.toUpperCase())
                                }
                            },
                            {
                                Header: "Responsable",
                                maxWidth: 90,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    const {_original: {responsable_actual}} = row;
                                    if (responsable_actual) {
                                        return (
                                            responsable_actual.toUpperCase().includes(filter.value.toUpperCase())
                                        )
                                    } else {
                                        return false
                                    }
                                },
                                Cell: row => {
                                    return <span>
                                        {row.original.responsable_actual ? row.original.responsable_actual : ''}
                                            </span>
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
                defaultPageSize={30}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;