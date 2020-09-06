import React, {Fragment, memo} from "react";
import ReactTable from "react-table";
import {formatBytes} from "../../../00_utilities/common";
import CustomIconTable from "../../../00_utilities/components/ui/icon/CustomIconTable";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const {
        equipo
    } = props;
    const tipo_equipo = equipo.tipo_equipo.nombre;
    const tipo_equipo_clase = equipo.tipo_equipo_clase.to_string;
    let documentos_postventa_tipo_equipo = equipo.tipo_equipo.documentos;
    let documentos_postventa_tipo_equipo_clase = equipo.tipo_equipo_clase.documentos;

    documentos_postventa_tipo_equipo = documentos_postventa_tipo_equipo.map(e => ({...e, origen: tipo_equipo}))
    documentos_postventa_tipo_equipo_clase = documentos_postventa_tipo_equipo_clase.map(e => ({
        ...e,
        origen: tipo_equipo_clase
    }))

    const list = [...documentos_postventa_tipo_equipo, ...documentos_postventa_tipo_equipo_clase]

    let data = _.orderBy(list, ['nombre_archivo'], ['asc']);
    return (
        <Fragment>
            <ReactTable
                data={data}
                columns={[
                    {
                        Header: "Información",
                        columns: [
                            {
                                Header: "Id",
                                accessor: "id",
                                maxWidth: 60
                            },
                            {
                                Header: "Nombre",
                                accessor: "nombre_archivo",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <div>{row.value ? row.value : 'SIN DEFINIR'}</div>
                            },
                            {
                                Header: "Documento para...",
                                accessor: "origen",
                                maxWidth: 250,
                            },
                            {
                                Header: "Extensión",
                                accessor: "extension",
                                maxWidth: 70,
                                Cell: row => <div className='text-right'>
                                    {row.value}
                                </div>
                            },
                            {
                                Header: "Tamaño",
                                accessor: "size",
                                maxWidth: 70,
                                Cell: row => <div className='text-right'>
                                    {formatBytes(row.value, 1)}
                                </div>
                            },
                            {
                                Header: "Documento",
                                accessor: "archivo_url",
                                maxWidth: 100,
                                Cell: row => <div className='center'>
                                    <a href={row.value} target='_blank'>
                                        <CustomIconTable icon='download'/>
                                    </a>
                                </div>
                            },
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight tabla-maestra"
            />
        </Fragment>
    );
}, areEqual);

export default Tabla;