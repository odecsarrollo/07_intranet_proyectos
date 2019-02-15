import React, {Component, Fragment} from 'react';
import Combobox from 'react-widgets/lib/Combobox';

export default class AsignadoTareaFaseLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {adicionar_asignado_a: false}
    }

    render() {
        const {
            cambiarAsignadoTarea,
            miembros_literales_list,
            tarea,
            soy_responsable,
            administra_proyectos
        } = this.props;
        const {adicionar_asignado_a} = this.state;
        const data_miembros = _.map(
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
                {
                    !adicionar_asignado_a &&
                    <Fragment>
                    <span
                        style={{fontSize:'10px'}}
                        className={(soy_responsable || administra_proyectos) ? 'puntero' : ''}
                        onClick={() => {
                            if (soy_responsable || administra_proyectos) {
                                this.setState({adicionar_asignado_a: true})
                            }
                        }}
                    >
                        {
                            !tarea.asignado_a ?
                                'Adicionar...'
                                :
                                tarea.asignado_a_nombre
                        }
                </span>
                    </Fragment>
                }
                {
                    adicionar_asignado_a &&
                    <div style={{height: '250px'}}>
                        <Combobox
                            data={[{id: null, nombre: 'SIN DEFINIR'}, ...data_miembros]}
                            onSelect={(e) => {
                                cambiarAsignadoTarea(tarea, e.id, () => this.setState({adicionar_asignado_a: false}));
                            }}
                            placeholder='Seleccionar Asignado'
                            valueField='id'
                            textField='nombre'
                            filter='contains'
                        />
                    </div>
                }
            </div>
        )
    }
}