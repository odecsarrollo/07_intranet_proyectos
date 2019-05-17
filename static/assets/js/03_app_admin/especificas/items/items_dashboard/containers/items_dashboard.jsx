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
    CATEGORIAS_PRODUCTOS as categorias_productos_permisos_view,
    ITEMS_VENTAS_CATALOGOS as items_ventas_permisos_view,
} from "../../../../../00_utilities/permisos/types";

import BloqueCategorias from "../../categorias/components/categorias_list";
import BloqueItemsVentas from "../../items_ventas_catalogo_productos/components/items_ventas_catalogos_servicios_list";

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

    componentWillUnmount() {
        this.props.clearBandaEurobeltCategorias();
        this.props.clearBandaEurobeltTipos();
        this.props.clearItemsVentasCatalogos();
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            const cargarCategoriasDos = () => this.props.fetchBandaEurobeltCategorias();
            const cargarTipos = () => this.props.fetchBandaEurobeltTipos({callback: cargarCategoriasDos});
            this.props.fetchCategoriasProductos({callback: cargarTipos});
        } else if (index === 1) {
            this.props.fetchItemsVentasCatalogos();
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
        const {
            categorias_productos,
            items_ventas,
        } = this.props;
        const {slideIndex} = this.state;
        const permisos_categorias_productos = permisosAdapter(categorias_productos_permisos_view);
        const permisos_items_ventas = permisosAdapter(items_ventas_permisos_view);

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
                    <Tab label="Items Ventas Catalogo"/>
                </Tabs>
                {
                    slideIndex === 0 &&
                    <BloqueCategorias
                        {...this.props}
                        object_list={categorias_productos}
                        permisos_object={permisos_categorias_productos}
                    />
                }
                {
                    slideIndex === 1 &&
                    <BloqueItemsVentas
                        {...this.props}
                        object_list={items_ventas}
                        permisos_object={permisos_items_ventas}
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
        tipos: state.banda_eurobelt_tipos,
        categorias_dos: state.banda_eurobelt_categorias_dos,
        proveedores_importaciones: state.proveedores_importaciones,
        margenes_proveedores: state.margenes_proveedores,
        categorias_productos: state.categorias_productos,
        items_ventas: state.catalogos_productos_items_ventas,
    }
}

export default connect(mapPropsToState, actions)(ItemsDashboard)