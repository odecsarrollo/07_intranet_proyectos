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
        this.onBuscar = this.onBuscar.bind(this);
        this.error_callback = this.error_callback.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    handleChangeTipoConsulta(event, index, tipo_consulta) {
        this.setState({tipo_consulta});
    }

    onBuscar(e) {
        e.preventDefault();
        this.props.cargando();
        if (this.state.tipo_consulta === 2) {
            this.props.fetchItemsBiablexParametro(
                this.state.tipo_consulta, this.state.busqueda,
                () => this.props.noCargando(),
                this.error_callback
            );
        }

        if ((this.state.tipo_consulta === 1 || this.state.tipo_consulta === 3) && this.state.busqueda.length >= 3) {
            this.props.fetchItemsBiablexParametro(
                this.state.tipo_consulta, this.state.busqueda,
                () => this.props.noCargando(),
                this.error_callback
            );
        } else {
            this.props.clearItemsBiable();
            this.props.noCargando();
        }
    }

    render() {
        const {busqueda} = this.state;
        const {
            lista_objetos,
            mis_permisos,
            esta_cargando
        } = this.props;
        return (
            <SinPermisos
                cargando={esta_cargando}
                nombre='Items CGUNO'
                mis_permisos={mis_permisos}
                can_see={tengoPermiso(mis_permisos, 'list_itemsbiable')}
            >
                <div className="row">
                    <div className="col-12">
                        <ListaTitulo
                            titulo='Items CGUNO'
                            can_add={false}
                        />
                    </div>
                    <div className="col-12">
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
                        <form action="" onSubmit={this.onBuscar}>
                            <div className="row">
                                <div className="col-md-9">
                                    <ListaBusqueda
                                        busqueda={busqueda}
                                        onChange={e => {
                                            this.setState({busqueda: e.target.value});
                                        }}/>
                                </div>
                                <div className="col-md-3">
                                    <input type="submit" className='btn btn-primary' value="Buscar"></input>
                                </div>
                            </div>
                        </form>
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
        esta_cargando: state.esta_cargando,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(ItemsCGUNOLista);