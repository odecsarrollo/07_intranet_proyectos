import React, {Component, Fragment} from 'react';
import Combobox from 'react-widgets/lib/Combobox';
import MiembrosLista from './miembros_literal_list';

export default class MiembroLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {usuario_seleccionado: null}
    }

    render() {
        const {
            usuarios,
            quitarMiembro,
            adicionarMiembro,
            miembros_literales_list,
            editarMiembro,
            table_style,
            puede_administrar
        } = this.props;
        const {usuario_seleccionado} = this.state;
        const miembros_actuales_id = _.map(miembros_literales_list, m => m.usuario);
        return (
            <div className="row">
                <h4>Participantes</h4>
                <div className="col-12">
                    <MiembrosLista
                        table_style={table_style}
                        miembros_literales_list={miembros_literales_list}
                        quitarMiembro={quitarMiembro}
                        editarMiembro={editarMiembro}
                        usuarios={usuarios}
                        puede_administrar={puede_administrar}
                    />
                </div>
                {
                    puede_administrar &&
                    <Fragment>
                        <div className="col-12 col-md-10">
                            <Combobox
                                data={
                                    _.map(
                                        _.orderBy(
                                            _.pickBy(
                                                usuarios,
                                                e => (e.first_name && !miembros_actuales_id.includes(e.id))
                                            ),
                                            ['first_name', 'last_name'],
                                            ['asc', 'asc']
                                        ), e => {
                                            return (
                                                {
                                                    id: e.id,
                                                    nombre: `${e.first_name} ${e.last_name}`
                                                }
                                            )
                                        }
                                    )
                                }
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
                    </Fragment>
                }
            </div>
        )
    }
}