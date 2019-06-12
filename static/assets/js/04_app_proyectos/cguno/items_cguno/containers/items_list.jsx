import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import FormControl from '@material-ui/core/FormControl';
import {permisosAdapterDos} from "../../../../00_utilities/common";
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import {ListaBusqueda} from '../../../../00_utilities/utiles';
import {
    ITEM_BIABLE as permisos_view, LITERALES as literales_permisos_view
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
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    componentWillUnmount() {
        this.props.clearItemsBiable()
    }

    cargarDatos() {

    }

    handleChangeTipoConsulta(event) {
        const tipo_consulta = event.target.value;
        this.setState({tipo_consulta});
    }

    onBuscar(e, busqueda) {
        e.preventDefault();
        if (this.state.tipo_consulta === 2) {
            this.props.fetchItemsBiablexParametro(this.state.tipo_consulta, busqueda);
        }

        if ((this.state.tipo_consulta === 1 || this.state.tipo_consulta === 3) && busqueda.length >= 3) {
            this.props.fetchItemsBiablexParametro(this.state.tipo_consulta, busqueda);
        } else {
            this.props.clearItemsBiable();
        }
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos = permisosAdapterDos(mis_permisos, permisos_view);
        return (
            <ValidarPermisos can_see={permisos.list} nombre='listas de items CGUno'>
                <Titulo>Items CGUno</Titulo>
                <div className="col-12">
                    <FormControl fullWidth={true}>
                        <InputLabel htmlFor='select-tipo-consulta'>
                            Tipo Consulta
                        </InputLabel>
                        <SelectField
                            value={this.state.tipo_consulta}
                            onChange={this.handleChangeTipoConsulta}
                            inputProps={{
                                id: `select-tipo-consulta`,
                            }}
                        >
                            <MenuItem value={1}>
                                Descripción
                            </MenuItem>
                            <MenuItem value={2}>
                                ID Cguno
                            </MenuItem>
                            <MenuItem value={3}>
                                Referencia
                            </MenuItem>
                        </SelectField>
                    </FormControl>
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
                    can_see_ultimo_costo={permisos.ver_ultimo_costo}
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