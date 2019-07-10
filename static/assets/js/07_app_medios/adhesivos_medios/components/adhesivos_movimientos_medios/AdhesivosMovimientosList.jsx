import React, {Component} from 'react';
import CreateForm from '../00_forms/adhesivos_movimientos_form';
import Tabla from '../01_tabla/adhesivos_movimientos_tabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


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

    render() {
        const {object_list, permisos_object} = this.props;
        return (
            <CRUD
                posCreateMethod={() => this.props.fetchAdhesivosMedios()}
                method_pool={this.method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

export default MovimientosEtiquetaMedios;
