import React, {Component, Fragment} from 'react';
import Tabla from '../01_tabla/computadores_tabla';
import {connect} from 'react-redux'
import * as actions from '../../../01_actions/01_index';
import CreateForm from '../00_forms/computadores_form';
import crudHOC from '../../../00_utilities/components/hoc_crud';
import UploadFile from '../../../00_utilities/components/ui/upload_file/uploadFile';
import {
    SISTEMAS_EQUIPOS_COMPUTADORES as computadores_permisos_view,
} from "../../../permisos";
import {permisosAdapterDos} from "../../../00_utilities/common";
import TipoDato from '../../../00_utilities/components/ui/upload_file/tiposDatos';

const CRUD = crudHOC(CreateForm, Tabla);

class EquiposComputadoresSistemas extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this)
        this.plural_name = 'Computadores';
        this.singular_name = 'Computador';
        this.method_pool = {
            fetchObjectMethod: this.props.fetchSistemasEquipoComputador,
            deleteObjectMethod: this.props.deleteSistemasEquipoComputador,
            createObjectMethod: this.props.createSistemasEquipoComputador,
            updateObjectMethod: this.props.updateSistemasEquipoComputador,
        };

        const MARCA_CHOICES = [
            {id: 1, value: 'SONY'},
            {id: 2, value: 'TOSHIBA'},
            {id: 3, value: 'LENOVO'},
            {id: 4, value: 'ASUS'},
            {id: 5, value: 'DELL'},
            {id: 6, value: 'MAC'},
            {id: 7, value: 'HP'},
            {id: 8, value: 'INTEL'},
            {id: 9, value: 'MICROSOFT'},
            {id: 10, value: 'SIEMMENS'},
            {id: 11, value: 'INTEL'},
        ];
        const PROCESADOR_CHOICES = [
            {id: 1, value: 'CORE I3'},
            {id: 2, value: 'CORE I5'},
            {id: 3, value: 'CORE I7'},
            {id: 4, value: 'AMD E1'},
            {id: 5, value: 'CENTRINO'},
            {id: 6, value: 'PENTIUM'},
            {id: 7, value: 'XEON'},
            {id: 8, value: 'CORE 2 DUO'},
            {id: 9, value: 'CELERON'},
            {id: 10, value: 'CORE 2'}
        ];

        const TIPO_PC_CHOICES = [
            {id: 1, value: 'ESCRITORIO'},
            {id: 2, value: 'PORTATIL'}
        ];

        const ESTADO_CHOICES = [
            {id: 1, value: 'EN PRODUCCIÓN'},
            {id: 2, value: 'FUERA DE PRODUCCIÓN'}
        ];

        this.cabeceras = [
            {campo: 'nombre', null: false, tipo: TipoDato.string(), unique: true},
            {campo: 'marca', null: false, tipo: TipoDato.int(), choices: MARCA_CHOICES},
            {campo: 'referencia', null: true, tipo: TipoDato.string()},
            {campo: 'procesador', null: false, tipo: TipoDato.int(), choices: PROCESADOR_CHOICES},
            {campo: 'tipo', null: false, tipo: TipoDato.int(), choices: TIPO_PC_CHOICES},
            {campo: 'serial', null: true, tipo: TipoDato.string()},
            {campo: 'estado', null: false, tipo: TipoDato.int(), choices: ESTADO_CHOICES},
            {campo: 'descripcion', null: true, tipo: TipoDato.string()}
        ];
    }


    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                computadores_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    cargarDatos() {
        this.props.fetchSistemasEquiposComputadores();
    }

    render() {
        const {object_list, mis_permisos} = this.props;
        const permisos_computadores = permisosAdapterDos(mis_permisos, computadores_permisos_view)

        return (
            <Fragment>
                <UploadFile
                    objectCabecera={this.cabeceras}
                    createLoadeableFile={this.props.fetchComputadoresFile}
                />
                <CRUD
                    method_pool={this.method_pool}
                    list={object_list}
                    permisos_object={permisos_computadores}
                    plural_name={this.plural_name}
                    singular_name={this.singular_name}
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