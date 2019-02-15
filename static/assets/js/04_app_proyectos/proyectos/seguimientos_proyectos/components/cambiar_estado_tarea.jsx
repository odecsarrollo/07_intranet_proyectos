import React, {Component} from 'react';
import Combobox from 'react-widgets/lib/Combobox';

class TdCambiarEstadoTarea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cambiar_estado: false
        }
    }

    render() {
        const {
            fila,
            actualizarTarea,
            puede_cambiar_estado,
            table_style
        } = this.props;
        const {cambiar_estado} = this.state;
        return (
            <td style={table_style.td} height={cambiar_estado ? '130px' : '20px'}>
                {
                    cambiar_estado ?
                        <Combobox
                            data={[
                                {id: 1, nombre: 'NUEVA'},
                                {id: 2, nombre: 'PENDIENTE'},
                                {id: 3, nombre: 'EN PROCESO'},
                                {id: 4, nombre: 'TERMINADA'},
                            ]}
                            onSelect={
                                e => {
                                    actualizarTarea(fila.id, {estado: e.id}, () => this.setState({cambiar_estado: false}))
                                }}
                            placeholder='Seleccionar Estado'
                            valueField='id'
                            textField='nombre'
                            filter='contains'
                        /> :
                        <span
                            style={{fontSize: '9px'}}
                            className={puede_cambiar_estado ? 'puntero' : ''}
                            onClick={() => {
                                if (puede_cambiar_estado) {
                                    this.setState({cambiar_estado: true})
                                }
                            }}
                        >
                                {fila.estado_display}
                            </span>
                }
            </td>
        )
    }
}

export default TdCambiarEstadoTarea;
