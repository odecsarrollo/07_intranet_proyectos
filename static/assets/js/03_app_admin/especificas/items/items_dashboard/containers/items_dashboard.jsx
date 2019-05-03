import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    CATEGORIAS_PRODUCTOS as categorias_productos_permisos_view
} from "../../../../../00_utilities/permisos/types";

import BloqueCategorias from "../../categorias/components/categorias_list";

class ItemsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Panel Items';
        this.singular_name = 'Panel Items';
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            this.props.fetchCategoriasProductos();
        }
    }

    handleChange = (event, value) => {
        if (value !== this.state.slideIndex) {
            this.cargarElementos(value);
        }
        this.setState({
            slideIndex: value,
        });
    };

    componentDidMount() {
        this.cargarDatos();
    }

    render() {
        const {categorias_productos} = this.props;
        const {slideIndex} = this.state;
        const permisos_categorias_productos = permisosAdapter(categorias_productos_permisos_view);

        const can_see = permisos_categorias_productos.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>
                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Categorías"/>
                </Tabs>
                {
                    slideIndex === 0 &&
                    <BloqueCategorias
                        object_list={categorias_productos}
                        permisos_object={permisos_categorias_productos}
                        {...this.props}
                    />
                }
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
        categorias_productos: state.categorias_productos
    }
}

export default connect(mapPropsToState, actions)(ItemsDashboard)