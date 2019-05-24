import React, { Component } from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import CreateForm from './forms/etiquetas_form';
import Tabla from './etiquetas_medios_tabla';
import crudHOC from '../../../00_utilities/components/hoc_crud';
import {permisosAdapter} from "../../../00_utilities/common";
import {ETIQUETA_MEDIOS_CATALOGOS as etiquetas_permisos_view} from '../../../00_utilities/permisos/types';


const CRUD = crudHOC(CreateForm, Tabla);

class EtiquetaMedios extends Component {
    constructor(props) {
        super(props);
        this.method_pool = {
            fetchObjectMethod: this.props.fetchEtiquetaMedios,
            deleteObjectMethod: this.props.deleteEtiquetaMedios,
            createObjectMethod: this.props.createEtiquetaMedios,
            updateObjectMethod: this.props.updateEtiquetaMedios,
        };
        this.plural_name = 'Etiquetas';
        this.singular_name = 'Etiqueta';
    }
    componentDidMount() {
        this.props.fetchEtiquetasMedios();
    }
    render() {
        const permisos_etiqueta_medios = permisosAdapter(etiquetas_permisos_view);
        const { etiquetas } = this.props;
        return (
            <CRUD
                method_pool={this.method_pool}
                list={etiquetas}
                permisos_object={permisos_etiqueta_medios}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        etiquetas: state.medios_etiquetas
    }
}

export default connect(mapPropsToState, actions)(EtiquetaMedios);