import React, {memo} from "react";
import MyDialogButtonDelete from '../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";

import ReactTable from "react-table";
import {Link} from "react-router-dom";
import {pesosColombianos} from "../../00_utilities/common";

const Tabla = memo(props => {
    const data = _.map(_.pickBy(_.orderBy(props.list, ['nro_consecutivo'], ['desc']), e => e.estado !== 'INI'));
    const {
        singular_name,
        onDelete,
        permisos_object,
        estado_cotizacion_seleccionada,
        setEstadoCotizacion
    } = props;
    const estados = [
        {indice: 1, nombre: 'En Proceso', codigo: 'PRO'},
        {indice: 2, nombre: 'Enviada', codigo: 'ENV'},
        {indice: 3, nombre: 'Recibida', codigo: 'REC'},
        {indice: 4, nombre: 'Terminada', codigo: 'FIN'},
        {indice: 5, nombre: 'Rechazada', codigo: 'ELI'},
    ];
    return (
        <div>
            <div>
                Filtro Estado:
                <div className="row">
                    {_.map(estados, e =>
                        <div
                            key={e.codigo} className="col-12 col-sm-6 col-md-3 col-lg-1 puntero"
                            onClick={() => setEstadoCotizacion(e.codigo)}
                            style={{color: `${e.codigo === estado_cotizacion_seleccionada ? 'red' : ''}`}}
                        >
                            {e.nombre}
                        </div>)}
                </div>
            </div>
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
                                Header: "#",
                                accessor: "nro_consecutivo",
                                maxWidth: 70,
                                filterable: true
                            },
                            {
                                Header: "Cliente",
                                accessor: "cliente_nombre",
                                maxWidth: 250,
                                minWidth: 250,
                                filterable: true
                            },
                            {
                                Header: "Estado",
                                accessor: "estado_display",
                                maxWidth: 80,
                                minWidth: 80,
                                filterable: true
                            },
                            {
                                Header: "Ciudad",
                                maxWidth: 250,
                                minWidth: 250,
                                filterable: true,
                                Cell: row => `${row.original.pais_nombre}-${row.original.departamento_nombre}-${row.original.ciudad_nombre}`
                            },
                            {
                                Header: "Contacto",
                                maxWidth: 200,
                                minWidth: 200,
                                filterable: true,
                                Cell: row => `${row.original.contacto_nombres} ${row.original.contacto_apellidos}`
                            },
                            {
                                Header: "Responsable",
                                accessor: "responsable_username",
                                maxWidth: 80,
                                minWidth: 80,
                                filterable: true
                            },
                            {
                                Header: "Creado Por",
                                accessor: "creado_por_username",
                                maxWidth: 80,
                                minWidth: 80,
                                filterable: true
                            },
                            {
                                Header: "Valor Total",
                                accessor: "valor_total",
                                maxWidth: 80,
                                minWidth: 80,
                                Cell: row => <div className='text-right'>{pesosColombianos(row.value)}</div>
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
                                Header: "Ver",
                                show: permisos_object.detail,
                                maxWidth: 60,
                                Cell: row =>
                                    <Link to={`/app/ventas_componentes/cotizaciones/detail/${row.original.id}`}>
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
});

export default Tabla;