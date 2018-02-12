import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import {tengoPermiso} from '../../../../../01_actions/00_general_fuctions';
import {SinPermisos, ListaTitulo, ListaBusqueda} from '../../../../components/utiles';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TablaItemsCGUNO from './../../../components/cguno/items_cguno/items_cguno_list_tabla';


class ItemsCGUNOLista extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            tipo_consulta: 0
        });
        this.handleChangeTipoConsulta = this.handleChangeTipoConsulta.bind(this);
    }

    handleChangeTipoConsulta(event, index, tipo_consulta) {
        this.setState({tipo_consulta});
    }

    render() {
        const {busqueda} = this.state;
        const {
            lista_objetos,
            mis_permisos
        } = this.props;
        return (
            <SinPermisos
                nombre='Items CGUNO'
                mis_permisos={mis_permisos}
                can_see={!tengoPermiso(mis_permisos, 'list_itemsbiable')}
            >
                <div className="row">
                    <div className="col-12">
                        <ListaTitulo
                            titulo='Items CGUNO'
                            can_add={false}
                        />
                    </div>
                    <div className="col-12 col-md-3 mr-1">
                        <SelectField
                            floatingLabelText="Tipo Consulta"
                            value={this.state.tipo_consulta}
                            onChange={this.handleChangeTipoConsulta}
                        >
                            <MenuItem value={1} primaryText="Descripción"/>
                            <MenuItem value={2} primaryText="ID Cguno"/>
                            <MenuItem value={3} primaryText="Referencia"/>
                        </SelectField>
                    </div>
                    <div className="col-12 col-md-8">
                        <ListaBusqueda
                            busqueda={busqueda}
                            onChange={e => {
                                this.setState({busqueda: e.target.value});

                                if (this.state.tipo_consulta === 2) {
                                    this.props.fetchItemsBiablexParametro(this.state.tipo_consulta, e.target.value);
                                }

                                if ((this.state.tipo_consulta === 1 || this.state.tipo_consulta === 3) && e.target.value.length >= 3) {
                                    this.props.fetchItemsBiablexParametro(this.state.tipo_consulta, e.target.value);
                                } else {
                                    this.props.clearItemsBiable()
                                }
                            }}/>
                    </div>
                    <div className="col-12">
                        <TablaItemsCGUNO mis_permisos={mis_permisos} lista={lista_objetos}/>
                    </div>
                </div>
            </SinPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        lista_objetos: state.items_cguno,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(ItemsCGUNOLista);