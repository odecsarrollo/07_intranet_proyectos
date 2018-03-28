import React, {Component, Fragment} from 'react';
import Combobox from 'react-widgets/lib/Combobox';

class BuscadorProyectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            literales: null
        }
    };

    render() {
        const {literales} = this.state;
        const {literales_colaborador_list, modificarAutorizacionProyecto} = this.props;
        return (
            <Fragment>
                <Combobox data={
                    _.map(this.props.proyectos_list, e => {
                        return ({
                                literales: e.mis_literales,
                                nombre: `${e.id_proyecto}`
                            }
                        )
                    })}
                          placeholder='Seleccionar Proyecto...'
                          valueField='literales'
                          textField='nombre'
                          onSelect={(e) => {
                              this.setState({literales: e.literales});
                          }}
                />
                {
                    literales &&
                    <Combobox
                        data={
                            _.map(_.pickBy(literales, e => !literales_colaborador_list.includes(e.id)), e => {
                                return ({
                                    id: e.id,
                                    nombre: `${e.id_literal} - ${e.descripcion}`
                                })
                            })
                        }
                        placeholder='Seleccionar Literal...'
                        valueField='id'
                        textField='nombre'
                        onSelect={(e) => modificarAutorizacionProyecto(e.id, 'add')}
                    />
                }
            </Fragment>
        )
    }
}

export default BuscadorProyectos;