import React, {Fragment, memo} from "react";
import ReactTable from "react-table";

function areEqual(prevProps, nextProps) {
    return prevProps.list === nextProps.list
}

const Tabla = memo(props => {
    const {
        equipo
    } = props;
    const tipo_equipo = equipo.tipo_equipo.nombre;
    const tipo_equipo_clase = equipo.tipo_equipo_clase.to_string;
    let rutinas_postventa_tipo_equipo = equipo.tipo_equipo.rutinas_postventa;
    let rutinas_postventa_tipo_equipo_clase = equipo.tipo_equipo_clase.rutinas_postventa;

    rutinas_postventa_tipo_equipo = rutinas_postventa_tipo_equipo.map(e => ({...e, origen: tipo_equipo}))
    rutinas_postventa_tipo_equipo_clase = rutinas_postventa_tipo_equipo_clase.map(e => ({
        ...e,
        origen: tipo_equipo_clase
    }))

    const list = [...rutinas_postventa_tipo_equipo, ...rutinas_postventa_tipo_equipo_clase]

    let data = _.orderBy(list, ['mes'], ['asc']);
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
                                accessor: "to_string",
                                maxWidth: 300,
                                filterable: true,
                                filterMethod: (filter, row) => {
                                    return row[filter.id] && row[filter.id].includes(filter.value.toUpperCase())
                                },
                                Cell: row => <div>{row.value ? row.value : 'SIN DEFINIR'}</div>
                            },
                            {
                                Header: "Mes",
                                accessor: "mes",
                                maxWidth: 60,
                                Cell: row => <div className='text-center'>{row.value}</div>
                            },
                            {
                                Header: "Rutina para...",
                                accessor: "origen",
                                maxWidth: 200,
                            }
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