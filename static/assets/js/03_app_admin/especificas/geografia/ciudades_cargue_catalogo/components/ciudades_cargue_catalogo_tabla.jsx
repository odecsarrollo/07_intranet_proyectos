import React, {Component} from "react";

import ReactTable from "react-table";
import Combobox from 'react-widgets/lib/Combobox';

class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = {editando: false}
    }

    render() {
        const {row, ciudades_list} = this.props;
        const {editando} = this.state;
        let lista = _.map(ciudades_list, e => ({
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
                                  onChange={e => {
                                      this.props.fetchCiudadCargueCatalogo(
                                          row.original.id,
                                          {
                                              callback: (res) => {
                                                  this.props.updateCiudadCargueCatalogo(
                                                      row.original.id, {
                                                          ...res,
                                                          ciudad_intranet: e.id
                                                      }
                                                  );
                                                  this.setState({editando: false})
                                              }
                                          });
                                  }}
                        />
                    </div>
                }
                {
                    !editando &&
                    <div className='puntero' onClick={() => this.setState({editando: true})}>
                        {row.value ? row.value : 'Relacionar'}
                    </div>
                }
            </div>
        )
    }
}

class Tabla extends Component {
    render() {

        const data = this.props.data;
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
                                    key={row.original.id} row={row}
                                    {...this.props}
                                />
                            },
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