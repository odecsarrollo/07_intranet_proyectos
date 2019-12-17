import React, {useState, memo, useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux'
import * as actions from "../../../../01_actions/01_index";

import ReactTable from "react-table";
import Combobox from 'react-widgets/lib/Combobox';

const Cell = memo((props) => {
    const dispatch = useDispatch();
    const [editando, setEditando] = useState(false);
    const {row, ciudades} = props;
    let lista = _.map(ciudades, e => ({
        name: `${e.nombre} - ${e.departamento_nombre}`,
        id: e.id
    }));
    lista = [{id: null, name: 'Ninguno'}, ...lista];
    return (
        <div>
            {
                editando &&
                <div style={{height: '300px'}}>
                    <Combobox data={lista}
                              filter='contains'
                              placeholder='Seleccionar Ciudad'
                              valueField='id'
                              textField='name'
                              onSelect={e => {
                                  dispatch(actions.fetchCiudadCargueCatalogo(
                                      row.original.id,
                                      {
                                          callback: (res) => {
                                              dispatch(actions.updateCiudadCargueCatalogo(
                                                  row.original.id, {
                                                      ...res,
                                                      ciudad_intranet: e.id
                                                  }
                                              ));
                                              setEditando(false)
                                          }
                                      }));
                              }}
                    />
                </div>
            }
            {
                !editando &&
                <div className='puntero' onClick={() => setEditando(true)}>
                    {row.value ? `${row.value} - ${row.original.departamento_intranet_nombre}` : 'Relacionar'}
                </div>
            }
        </div>
    )
});

const Tabla = (props) => {
    const data = props.data;
    const dispatch = useDispatch();
    const ciudades = useSelector(state => state.geografia_ciudades);
    useEffect(() => {
        dispatch(actions.fetchCiudades());
        return () => {
            dispatch(actions.clearCiudades());
        };
    }, []);
    return (
        <ReactTable
            data={data}
            columns={[
                {
                    Header: "Caracteristicas",
                    columns: [
                        {
                            Header: "Sistema Informacion",
                            accessor: "sistema_informacion_nombre",
                            maxWidth: 80,
                            filterable: true
                        },
                        {
                            Header: "Id",
                            accessor: "id",
                            maxWidth: 40
                        },
                        {
                            Header: "Nombre",
                            maxWidth: 150,
                            filterable: true,
                            filterMethod: (filter, row) => row._original.to_string.includes(filter.value.toUpperCase()),
                            Cell: row => `${row.original.to_string}`
                        },
                        {
                            Header: "Departamento",
                            maxWidth: 150,
                            accessor: "departamento_nombre",
                            filterable: true
                        },
                        {
                            Header: "País",
                            maxWidth: 100,
                            accessor: "pais_nombre",
                            filterable: true
                        },
                        {
                            Header: "Ciudad Relacionada",
                            minWidth: 300,
                            accessor: "ciudad_intranet_nombre",
                            Cell: row => <Cell
                                key={row.original.id}
                                row={row}
                                ciudades={ciudades}
                            />
                        },
                    ]
                }
            ]}
            defaultPageSize={10}
            className="-striped -highlight tabla-maestra"
        />
    );
};

export default Tabla;