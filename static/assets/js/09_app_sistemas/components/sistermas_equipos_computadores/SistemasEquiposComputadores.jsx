import React, {Component, Fragment} from 'react';
import Tabla from '../01_tabla/computadores_tabla';
import {connect} from 'react-redux'
import * as actions from '../../../01_actions/01_index';
import CreateForm from '../00_forms/computadores_form';
import crudHOC from '../../../00_utilities/components/hoc_crud';
import {
    SISTEMAS_EQUIPOS_COMPUTADORES as computadores_permisos_view,

} from "../../../00_utilities/permisos/types";
import {MyFieldFileInput} from '../../../00_utilities/components/ui/forms/fields';
import {permisosAdapterDos} from "../../../00_utilities/common";
import Button from "@material-ui/core/Button";
const CRUD = crudHOC(CreateForm, Tabla);

class EquiposComputadoresSistemas extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this)
        this.plural_name = 'Computadores';
        this.singular_name = 'Computador';
        //this.onChange = this.onChange.bind(this);
        this.cargarDatosComputadores = this.cargarDatosComputadores.bind(this);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchSistemasEquipoComputador,
            deleteObjectMethod: this.props.deleteSistemasEquipoComputador,
            createObjectMethod: this.props.createSistemasEquipoComputador,
            updateObjectMethod: this.props.updateSistemasEquipoComputador,
        };
        this.fileUpload = null;
    }

    onChange(v){
        console.log(this.fileUpload.files[0])
    }

    cargarDatosComputadores(){
        const datos_a_subir = new FormData();
        datos_a_subir.append(this.fileUpload.files[0]);
        this.props.fetchComputadoresFile(datos_a_subir)
    }

    componentDidMount() {
        console.log("props",this.props)
        this.props.fetchMisPermisosxListado(
            [
               computadores_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    cargarDatos(){

        this.props.fetchSistemasEquiposComputadores();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_computadores = permisosAdapterDos(mis_permisos, computadores_permisos_view)

        return (
            <Fragment>
                <input
                type="file"
                value={null}

                ref={(ref) => this.fileUpload = ref}
                onChange={this.onChange}
                />
                <Button
                    color="primary"
                    variant="contained"
                    type='submit'
                    className='ml-3'
                >
                    {'Cargar Archivo'}
                </Button>
                <CRUD
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_computadores}
                plural_name={this.plural_name}
                singular_name = {this.singular_name}
                {...this.props}
            />
            </Fragment>

        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos,
        object_list: state.sistemas_equipos_computadores
    }
}

export default connect(mapPropsToState, actions)(EquiposComputadoresSistemas);