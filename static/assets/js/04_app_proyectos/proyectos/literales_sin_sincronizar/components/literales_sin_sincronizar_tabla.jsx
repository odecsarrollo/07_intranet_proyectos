import React from "react";
import {Link} from 'react-router-dom'

import ReactTable from "react-table";

class Tabla extends React.Component {
    render() {

        const data = this.props.data;
        const {
            updateItem,
            singular_name,
            permisos_cotizaciones,
            permisos_proyectos,
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
                                Header: "Nro. Cotización",
                                accessor: "cotizacion_nro",
                                maxWidth: 100,
                            },
                            {
                                Header: "Id Proyecto",
                                accessor: "id_proyecto",
                                maxWidth: 100,
                                Cell: row => {
                                    return (
                                        permisos_proyectos.detail ?
                                            <Link
                                                to={`/app/proyectos/proyectos/detail/${row.original.proyecto}`}>
                                                <span>{row.value}</span>
                                            </Link> :
                                            <span>{row.value}</span>
                                    )
                                }
                            },
                            {
                                Header: "Id Literal",
                                accessor: "id_literal",
                                maxWidth: 150,
                            },
                            {
                                Header: "Nombre Literal",
                                accessor: "descripcion",
                                maxWidth: 300,
                            },
                        ]
                    }
                ]}
                defaultPageSize={20}
                className="-striped -highlight tabla-maestra"
            />
        );
    }
}

export default Tabla;