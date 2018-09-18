import React, {Component} from 'react';
import FormAddFase from './forms/add_fase_form';
import FaseLiteral from './seguimiento_literal_fase';

export default class SeguimientoLiteral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fase_seleccionada_id: null
        };
        this.adicionarQuitarFaseLiteral = this.adicionarQuitarFaseLiteral.bind(this);
        this.onSeleccionarFase = this.onSeleccionarFase.bind(this);
    }

    adicionarQuitarFaseLiteral(id_fase) {
        const {adicionarQuitarFaseLiteral, literal, onTabClick} = this.props;
        adicionarQuitarFaseLiteral(literal.id, id_fase, () => onTabClick(2))
    }

    onSeleccionarFase(fase_literal_id) {
        const {cargando, noCargando} = this.props;
        cargando();
        const success_callback = () => {
            this.setState({fase_seleccionada_id: fase_literal_id});
            noCargando();
        };
        this.props.fetchTareasFases_x_literal(fase_literal_id, success_callback);
    }

    render() {
        const {fases_literales_list} = this.props;
        const {fase_seleccionada_id} = this.state;
        return (
            <div>
                <FormAddFase
                    fases={this.props.fases_list}
                    fases_en_literal={this.props.fases_literales_list}
                    adicionarQuitarFaseLiteral={this.adicionarQuitarFaseLiteral}
                />
                Fases
                <div className="row">
                    {_.map(fases_literales_list, e => {
                        return (
                            <FaseLiteral
                                {...this.props}
                                fase_seleccionada_id={fase_seleccionada_id}
                                onSeleccionarFase={this.onSeleccionarFase}
                                fase={e}
                                key={e.id}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}