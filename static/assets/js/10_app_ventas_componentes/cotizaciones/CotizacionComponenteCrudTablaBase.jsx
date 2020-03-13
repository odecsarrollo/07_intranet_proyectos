import React, {memo} from "react";
import MyDialogButtonDelete from '../../00_utilities/components/ui/dialog/delete_dialog';
import IconButtonTableSee from "../../00_utilities/components/ui/icon/table_icon_button_detail";

import ReactTable from "react-table";
import {Link} from "react-router-dom";
import {pesosColombianos} from "../../00_utilities/common";
import useTengoPermisos from "../../00_utilities/hooks/useTengoPermisos";
import {CLIENTES} from "../../permisos";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    texto_largo: {
        fontSize: '0.7rem',
        whiteSpace: 'normal'
    },
}));

const Tabla = memo(props => {
    const data = _.map(_.pickBy(_.orderBy(props.list, ['nro_consecutivo'], ['desc']), e => e.estado !== 'INI'));
    const {
        singular_name,
        onDelete = null,
        permisos_object,
        nro_filas = 100
    } = props;
    const classes = useStyles();
    const permisos_cliente = useTengoPermisos(CLIENTES);
    return <ReactTable
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
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase()),
                        filterable: true,
                        Cell: row => <div className={classes.texto_largo}>
                            {permisos_cliente.detail ?
                                <Link to={`/app/ventas_componentes/clientes/detail/${row.original.cliente}`}
                                      target='_blank'>
                                    {row.value}
                                </Link> : row.value}
                        </div>
                    },
                    {
                        Header: "Estado",
                        accessor: "estado_display",
                        maxWidth: 80,
                        minWidth: 80
                    },
                    {
                        Header: "Ciudad",
                        accessor: "ciudad_nombre",
                        maxWidth: 250,
                        minWidth: 250,
                        filterable: true,
                        filterMethod: (filter, row) => `${row._original.pais_nombre}-${row._original.departamento_nombre}-${row._original.ciudad_nombre}`.includes(filter.value.toUpperCase()),
                        Cell: row => `${row.original.pais_nombre}-${row.original.departamento_nombre}-${row.original.ciudad_nombre}`
                    },
                    {
                        Header: "Contacto",
                        maxWidth: 200,
                        minWidth: 200,
                        filterable: true,
                        accessor: "contacto",
                        filterMethod: (filter, row) => `${row._original.contacto_nombres} ${row._original.contacto_apellidos}`.includes(filter.value.toUpperCase()),
                        Cell: row => `${row.original.contacto_nombres} ${row.original.contacto_apellidos}`
                    },
                    {
                        Header: "Responsable",
                        accessor: "responsable_username",
                        maxWidth: 80,
                        minWidth: 80,
                        filterable: true,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
                    },
                    {
                        Header: "Creado Por",
                        accessor: "creado_por_username",
                        maxWidth: 80,
                        minWidth: 80,
                        filterable: true,
                        filterMethod: (filter, row) => row[filter.id] && row[filter.id].toUpperCase().includes(filter.value.toUpperCase())
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
                        show: onDelete && permisos_object.delete,
                        maxWidth: 45,
                        Cell: row =>
                            !row.original.es_cguno &&
                            onDelete &&
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
        defaultPageSize={nro_filas}
        className="-striped -highlight tabla-maestra"
    />
});

export default Tabla;