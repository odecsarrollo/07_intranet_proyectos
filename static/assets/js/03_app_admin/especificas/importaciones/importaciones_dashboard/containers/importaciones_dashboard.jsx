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
    MONEDAS_CAMBIOS as monedas_cambios_permisos_view,
    PROVEEDORES_IMPORTACIONES as proveedores_permisos_view,
    MARGENES_PROVEEDORES as margenes_permisos_view,
} from "../../../../../00_utilities/permisos/types";

import BloqueMonedas from "../../monedas/components/monedas_list";
import BloqueProveedores from "../../proveedores/components/proveedores_list";
import BloqueMargenes from "../../margenes_x_proveedor_x_categoria/components/margenes_list";

class ItemsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Importaciones';
        this.singular_name = 'Importación';
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            this.props.fetchMonedasCambios();
        }
        if (index === 1) {
            const cargarMonedas = () => this.props.fetchMonedasCambios();
            this.props.fetchProveedoresImportaciones({callback: cargarMonedas});
        }
        if (index === 2) {
            const cargarCategorias = () => this.props.fetchCategoriasProductos();
            const cargarProveedores = () => this.props.fetchProveedoresImportaciones({callback: cargarCategorias});
            this.props.fetchMargenesProvedores({callback: cargarProveedores});
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
        const {monedas_cambios, proveedores_importaciones, margenes_proveedores, categorias_productos} = this.props;
        const {slideIndex} = this.state;
        const permisos_monedas_cambios = permisosAdapter(monedas_cambios_permisos_view);
        const permisos_proveedores = permisosAdapter(proveedores_permisos_view);
        const permisos_margenes = permisosAdapter(margenes_permisos_view);

        const can_see = permisos_monedas_cambios.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>
                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Monedas de Cambio"/>
                    <Tab label="Proveedores"/>
                    <Tab label="Margenes x Proveedor x Categoría"/>
                </Tabs>
                {
                    slideIndex === 0 &&
                    <BloqueMonedas
                        object_list={monedas_cambios}
                        permisos_object={permisos_monedas_cambios}
                        {...this.props}
                    />
                }
                {
                    slideIndex === 1 &&
                    <BloqueProveedores
                        object_list={proveedores_importaciones}
                        permisos_object={permisos_proveedores}
                        monedas_list={monedas_cambios}
                        {...this.props}
                    />
                }
                {
                    slideIndex === 2 &&
                    <BloqueMargenes
                        object_list={margenes_proveedores}
                        permisos_object={permisos_margenes}
                        categoria_list={categorias_productos}
                        proveedor_list={proveedores_importaciones}
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
        monedas_cambios: state.monedas_cambios,
        proveedores_importaciones: state.proveedores_importaciones,
        margenes_proveedores: state.margenes_proveedores,
        categorias_productos: state.categorias_productos,
    }
}

export default connect(mapPropsToState, actions)(ItemsDashboard)