import React, {Fragment} from "react";
import {MyDialogButtonDelete} from '../../../../00_utilities/components/ui/dialog';
import {IconButtonTableEdit, IconButtonTableSee} from '../../../../00_utilities/components/ui/icon/iconos';
import {Link} from 'react-router-dom'

import ReactTable from "react-table";
import {pesosColombianos} from "../../../../00_utilities/common";

class Tabla extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tipo_filtro_revision: null
        }
    }

    render() {
        let data = _.orderBy(this.props.data, ['nro_cotizacion'], ['desc']);
        const {
            updateItem,
            singular_name,
            onDelete,
            onSelectItemEdit,
            permisos_object,
            proyectos_permisos
        } = this.props;

        const estado_revisar = 'Para Revisar';
        const estado_revisar_ok = 'Revisado - OK';
        const estado_revisar_rechaza = 'Revisado - No Aprobado';

        const nro_cotizaciones_revisar = _.size(_.pickBy(data, c => c.estado === estado_revisar));
        const nro_cotizaciones_ok = _.size(_.pickBy(data, c => c.estado === estado_revisar_ok));
        const nro_cotizaciones_rechaza = _.size(_.pickBy(data, c => c.estado === estado_revisar_rechaza));

        const {tipo_filtro_revision} = this.state;

        return (
            <div>
                {
                    tipo_filtro_revision &&
                    <div className='puntero'
                         onClick={() => this.setState({tipo_filtro_revision: null})}>
                        <strong>Mostrar Todo </strong>
                    </div>
                }
                {
                    nro_cotizaciones_revisar > 0 &&
                    <div className='puntero'
                         onClick={() => this.setState({tipo_filtro_revision: estado_revisar})}>
                        Para Revisar: {nro_cotizaciones_revisar}
                    </div>
                }
                {
                    nro_cotizaciones_ok &&
                    <div className='puntero'
                         onClick={() => this.setState({tipo_filtro_revision: estado_revisar_ok})}>
                        Aprobada Revisión: {nro_cotizaciones_ok}
                    </div>
                }
                {
                    nro_cotizaciones_rechaza &&
                    <div className='puntero'
                         onClick={() => this.setState({tipo_filtro_revision: estado_revisar_rechaza})}>
                        Rechazada Revisión: {nro_cotizaciones_rechaza}
                    </div>
                }
                <ReactTable
                    data={tipo_filtro_revision ? data.filter(e => e.estado === tipo_filtro_revision) : data}
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
                                    maxWidth: 70,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Cliente",
                                    accessor: "cliente_nombre",
                                    maxWidth: 190,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    }
                                },
                                {
                                    Header: "Responsable",
                                    maxWidth: 80,
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
                                    minWidth: 400,
                                    filterable: true,
                                    filterMethod: (filter, row) => {
                                        return row[filter.id].includes(filter.value.toUpperCase())
                                    },
                                    Cell: row => {
                                        let icono = null;
                                        let style = {};
                                        if (row.original.estado === estado_revisar) {
                                            icono = 'far fa-clock';
                                            style = {color: 'orange'}
                                        }
                                        if (row.original.estado === estado_revisar_rechaza) {
                                            icono = 'far fa-times';
                                            style = {color: 'red'}
                                        }
                                        if (row.original.estado === estado_revisar_ok) {
                                            icono = 'far fa-check';
                                            style = {color: 'green'};
                                        }
                                        return (
                                            <div style={{fontSize: '0.6rem'}}>
                                                {
                                                    icono ?
                                                        <Fragment>
                                                            {row.value} <i className={`${icono}`} style={style}></i>
                                                        </Fragment> :
                                                        row.value
                                                }
                                            </div>
                                        )
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
                                            backgroundColor = 'turquoise';
                                        }
                                        if (seguimiento_3) {
                                            backgroundColor = 'yellow';
                                        }
                                        if (seguimiento_4) {
                                            backgroundColor = 'darkorange';
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
                    defaultPageSize={100}
                    className="-striped -highlight tabla-maestra"
                />
            </div>
        );
    }
}

export default Tabla;