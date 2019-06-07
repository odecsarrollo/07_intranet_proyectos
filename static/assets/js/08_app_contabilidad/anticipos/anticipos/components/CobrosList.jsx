import React, {Component} from 'react';
import CreateForm from './forms/AnticipoForm';
import Tabla from './CobrosTabla';
import crudHOC from '../../../../00_utilities/components/hoc_crud';


const CRUD = crudHOC(CreateForm, Tabla);

class List extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Cobros';
        this.singular_name = 'Cobros';
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        //const {id} = this.props.match.params;
        //this.props.fetchContactosClientes_por_cliente(id);
    }

    render() {
        const {object_list, permisos_object} = this.props;
        const method_pool = {
            fetchObjectMethod: this.props.fetchProformaAnticipo,
            deleteObjectMethod: this.props.deleteProformaAnticipo,
            createObjectMethod: this.props.createProformaAnticipo,
            updateObjectMethod: this.props.updateProformaAnticipo,
        };
        return (
            <CRUD
                method_pool={method_pool}
                list={object_list}
                permisos_object={permisos_object}
                plural_name={this.plural_name}
                singular_name={this.singular_name}
                {...this.props}
            />
        )
    }
}

export default List;