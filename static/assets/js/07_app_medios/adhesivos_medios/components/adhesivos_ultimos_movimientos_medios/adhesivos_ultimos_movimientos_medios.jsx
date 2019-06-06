import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import Tabla from '../01_tabla/adhesivos_ultimos_movimientos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';
import { permisosAdapter } from "../../../../00_utilities/common";
import { ADHESIVOS_MOVIMIENTOS_MEDIOS as adhesivos_movimientos_permisos_view } from '../../../../00_utilities/permisos/types';


const CRUD = crudHOC(null,Tabla);

class UltimosMovimientosAdhesivosMedios extends Component {
    constructor(props) {
        super(props);
        this.plural_name = 'Ultimos Movimientos Adhesivos';
    }

    componentDidMount() {
        this.props.fetchAdhesivosMedios();
    }

    render() {
        const permisos_adhesivos_movimientos_medios = permisosAdapter(adhesivos_movimientos_permisos_view);
        const permmisos = {...permisos_adhesivos_movimientos_medios, add : false}
        const { adhesivos } = this.props;
        return (
            <CRUD
                method_pool={[]}
                list={adhesivos}
                permisos_object={permmisos}
                plural_name={this.plural_name}
                {...this.props}
            />
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        adhesivos: state.medios_adhesivos
    }
}

export default connect(mapPropsToState, actions)(UltimosMovimientosAdhesivosMedios);