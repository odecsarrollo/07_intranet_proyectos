import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso} from "../../../../00_utilities/common";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import {
    PERMISO_LIST_ITEM_BIABLE as can_list_permiso,
    PERMISO_ULTIMO_COSTO_ITEM_BIABLE as can_see_ultimo_costo_permiso
} from "../../../../00_utilities/permisos/types";

import Tabla from '../components/items_tabla';

class ItemsList extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            tipo_consulta: 0
        });
        this.handleChangeTipoConsulta = this.handleChangeTipoConsulta.bind(this);
        this.onBuscar = this.onBuscar.bind(this);
        this.error_callback = this.error_callback.bind(this);
        this.notificar = this.notificar.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearItemsBiable()
    }

    cargarDatos() {
        this.props.cargando();
        this.props.fetchMisPermisos(() => this.props.noCargando(), this.error_callback)
    }

    handleChangeTipoConsulta(event, index, tipo_consulta) {
        this.setState({tipo_consulta});
    }

    onBuscar(e, busqueda) {
        e.preventDefault();
        this.props.cargando();
        if (this.state.tipo_consulta === 2) {
            this.props.fetchItemsBiablexParametro(
                this.state.tipo_consulta, busqueda,
                () => this.props.noCargando(),
                this.error_callback
            );
        }

        if ((this.state.tipo_consulta === 1 || this.state.tipo_consulta === 3) && busqueda.length >= 3) {
            this.props.fetchItemsBiablexParametro(
                this.state.tipo_consulta, busqueda,
                () => this.props.noCargando(),
                this.error_callback
            );
        } else {
            this.props.clearItemsBiable();
            this.props.noCargando();
        }
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const can_list = tengoPermiso(mis_permisos, can_list_permiso);
        const can_see_ultimo_costo = tengoPermiso(mis_permisos, can_see_ultimo_costo_permiso);
        return (
            <ValidarPermisos can_see={can_list} nombre='listas de items CGUno'>
                <Titulo>Items CGUno</Titulo>
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
                <div className="col-12">
                    <ListaBusqueda>
                        {
                            busqueda => {
                                return (
                                    <form action="" onSubmit={(e) => this.onBuscar(e, busqueda)}>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <input type="submit" className='btn btn-primary' value="Buscar"></input>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }}
                    </ListaBusqueda>
                </div>
                <Tabla
                    can_see_ultimo_costo={can_see_ultimo_costo}
                    data={_.map(object_list, e => e)}
                />
                <CargarDatos
                    cargarDatos={this.cargarDatos}
                />
            </ValidarPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.items_cguno
    }
}

export default connect(mapPropsToState, actions)(ItemsList)