import React, {Component} from 'react';
import Combobox from 'react-widgets/lib/Combobox';

export default class MiembroLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {usuario_seleccionado: null}
    }

    render() {
        const {usuarios, adicionarMiembro} = this.props;
        const {usuario_seleccionado} = this.state;
        return (
            <div className="row">
                <h4>Participantes</h4>
                <div className="col-12 col-md-10">
                    <Combobox
                        data={_.map(_.orderBy(_.pickBy(usuarios, e => e.first_name), ['first_name', 'last_name'], ['asc', 'asc']), e => {
                            return (
                                {
                                    id: e.id,
                                    nombre: `${e.first_name} ${e.last_name}`
                                }
                            )
                        })}
                        onSelect={(e) => {
                            this.setState({usuario_seleccionado: e})
                        }}
                        defaultValue={usuario_seleccionado ? usuario_seleccionado.id : null}
                        placeholder='Seleccionar Usuario'
                        valueField='id'
                        textField='nombre'
                    />
                </div>
                {
                    usuario_seleccionado &&
                    <div className="col-12 col-md-2">
                        <button
                            className='btn btn-primary'
                            onClick={() => adicionarMiembro(usuario_seleccionado.id)}
                        >
                            Adicionar
                        </button>
                    </div>
                }
            </div>
        )
    }
}