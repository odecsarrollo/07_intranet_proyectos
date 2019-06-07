import React, {Component} from 'react';
import Tabla from '../01_tabla/adhesivos_ultimos_movimientos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(null, Tabla);

class UltimosMovimientosAdhesivosMedios extends Component {
    constructor(props) {
        super(props);
        this.plural_name = 'Inventario Adhesivos';
    }

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                method_pool={[]}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                {...this.props}
            />
        )
    }
}

export default UltimosMovimientosAdhesivosMedios;