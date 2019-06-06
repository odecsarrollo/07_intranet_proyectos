import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CreateForm from '../00_forms/adhesivos_movimientos_form';
import Tabla from '../01_tabla/adhesivos_movimientos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import { permisosAdapter } from "../../../../00_utilities/common";
import { ADHESIVOS_MOVIMIENTOS_MEDIOS as adhesivos_movimientos_permisos_view } from '../../../../00_utilities/permisos/types';


const CRUD = crudHOC(CreateForm, Tabla);

class MovimientosEtiquetaMedios extends Component {
    constructor(props) {
        super(props);

        this.plural_name = 'Movimientos Adhesivos';
        this.singular_name = 'Movimiento Adhesivo';
        this.method_pool = {
            fetchObjectMethod: this.props.fetchAdhesivoMovimientoMedios,
            createObjectMethod: this.props.createAdhesivoMovimientoMedios,
        };
    }

    componentDidMount() {
        this.props.fetchAdhesivosMedios();
        this.props.fetchAdhesivosMovimientosMedios();
    }
    
    render() {
        const permisos_adhesivos_movimientos_medios = permisosAdapter(adhesivos_movimientos_permisos_view);
        const { movimientos_adhesivos } = this.props;
        return (
            <CRUD
                posCreateMethod={()=>this.props.fetchAdhesivosMedios()}
                method_pool={this.method_pool}
                list={movimientos_adhesivos}
                permisos_object={permisos_adhesivos_movimientos_medios}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        movimientos_adhesivos: state.medios_adhesivos_movimientos,
        adhesivos: state.medios_adhesivos
    }
}

export default connect(mapPropsToState, actions)(MovimientosEtiquetaMedios);
