import React, {Component} from 'react';
import {formatMoney} from 'accounting';
import TextField from 'material-ui/TextField';
import TablaProyectoLiteralesMateriales from './../../../components/proyectos/proyectos/proyectos_literales_materiales_tabla';

export default class ProyectoLiteralDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: ""
        })
    }

    render() {
        const {literal, items_literales} = this.props;
        const {busqueda} = this.state;

        if (!literal || !items_literales) {
            return (<div>Cargando ...</div>)
        }

        let listado_materiales = items_literales;

        if (!busqueda.toUpperCase().includes('TODO')) {
            listado_materiales = _.pickBy(items_literales, objeto => {
                return (
                    objeto.item_biable.descripcion.toUpperCase().includes(busqueda.toUpperCase())||
                    objeto.item_biable.id_referencia.toUpperCase().includes(busqueda.toUpperCase())||
                    objeto.item_biable.id_item.toString().toUpperCase().includes(busqueda.toUpperCase())
                )
            });
        }

        return (
            <div className="row">
                <div className="col-12">
                    <h4 className="h4-responsive">Literal: <small>{literal.id_literal}</small></h4>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <h5 className='h5-response'>{literal.descripcion}</h5>
                        </div>
                        <div className="col-12">
                            <h6 className='h6-response'>Costo
                                Materiales: <small>{formatMoney(Number(literal.costo_materiales), "$", 0, ".", ",")}</small>
                            </h6>
                        </div>
                        <div className="col-12">
                            <TextField
                                floatingLabelText="A buscar"
                                fullWidth={true}
                                onChange={e => {
                                    this.setState({busqueda: e.target.value});
                                }}
                                autoComplete="off"
                                value={busqueda}
                            />
                        </div>
                        <div className="col-12">
                            <TablaProyectoLiteralesMateriales lista_materiales={listado_materiales}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}