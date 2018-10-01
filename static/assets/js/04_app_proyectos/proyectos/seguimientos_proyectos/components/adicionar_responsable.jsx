import React, {Component} from 'react';
import Combobox from 'react-widgets/lib/Combobox';

export default class ResponsableFaseLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {adicionar_responsable: false}
    }

    render() {
        const {
            miembros_literales_list,
            cambiarResponsable,
            fase,
        } = this.props;
        const {adicionar_responsable} = this.state;
        const data_responsables = _.map(
            _.orderBy(miembros_literales_list, ['colaborador'], ['asc']), e => {
                return (
                    {
                        id: e.usuario,
                        nombre: `${e.colaborador}`
                    }
                )
            }
        );
        return (
            <div>
                <strong>Responsable: </strong>
                <span
                    className='puntero'
                    onClick={() => this.setState({adicionar_responsable: true})}
                >
                {
                    !fase.responsable ?
                        'Adicionar...'
                        :
                        fase.responsable_nombre
                }
                </span>
                {
                    adicionar_responsable &&
                    <Combobox
                        data={[{id: null, nombre: 'SIN DEFINIR'}, ...data_responsables]}
                        onSelect={(e) => {
                            cambiarResponsable(e.id, () => this.setState({adicionar_responsable: false}));
                        }}
                        placeholder='Seleccionar Responsable'
                        valueField='id'
                        textField='nombre'
                    />
                }
            </div>
        )
    }
}