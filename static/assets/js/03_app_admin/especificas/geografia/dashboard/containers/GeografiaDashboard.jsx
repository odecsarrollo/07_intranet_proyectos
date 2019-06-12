import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapterDos} from "../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    CIUDADES as ciudades_permisos_view,
    DEPARTAMENTOS as departamentos_permisos_view,
    PAISES as paises_permisos_view,
} from "../../../../../00_utilities/permisos/types";
import BloquePaises from "../../paises/components/PaisList";
import BloqueDepartamentos from "../../departamentos/components/DepartamentoList";
import BloqueCiudades from "../../ciudades/components/CiudadList";
import BloqueCiudadesCatalogos from "../../ciudades_cargue_catalogo/components/CiudadCargueCatalogoList";

class GeografiaDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Panel Geografia';
        this.singular_name = 'Panel Geografia';
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            this.props.fetchPaises();
        } else if (index === 1) {
            const cargar_departamentos = () => this.props.fetchDepartamentos();
            this.props.fetchPaises({callback: cargar_departamentos});
        } else if (index === 2) {
            const cargar_ciudades = () => this.props.fetchCiudades();
            const cargar_departamentos = () => this.props.fetchDepartamentos({callback: cargar_ciudades});
            this.props.fetchPaises({callback: cargar_departamentos});
        } else if (index === 3) {
            const cargar_ciudades = () => this.props.fetchCiudades();
            this.props.fetchCiudadesCarguesCatalogos({callback: cargar_ciudades})
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
        this.props.fetchMisPermisosxListado(
            [
                ciudades_permisos_view,
                departamentos_permisos_view,
                paises_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    render() {
        const {ciudades, departamentos, paises, ciudades_catalogos, mis_permisos} = this.props;
        const {slideIndex} = this.state;
        const permisos_ciudades = permisosAdapterDos(mis_permisos, ciudades_permisos_view);
        const permisos_departamentos = permisosAdapterDos(mis_permisos, departamentos_permisos_view);
        const permisos_paises = permisosAdapterDos(mis_permisos, paises_permisos_view);

        const can_see =
            permisos_ciudades.list ||
            permisos_departamentos.list ||
            permisos_paises.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>

                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Paises"/>
                    <Tab label="Departamentos"/>
                    <Tab label="Ciudades"/>
                    <Tab label="Ciudades Sistemas Informacion"/>
                </Tabs>

                {
                    slideIndex === 0 &&
                    <BloquePaises
                        object_list={paises}
                        permisos_object={permisos_paises}
                        {...this.props}
                    />
                }
                {
                    slideIndex === 1 &&
                    <BloqueDepartamentos
                        object_list={departamentos}
                        permisos_object={permisos_departamentos}
                        paises_list={paises}
                        {...this.props}
                    />
                }
                {
                    slideIndex === 2 &&
                    <BloqueCiudades
                        object_list={ciudades}
                        permisos_object={permisos_ciudades}
                        departamentos_list={departamentos}
                        paises_list={paises}
                        {...this.props}
                    />
                }
                {
                    slideIndex === 3 &&
                    <BloqueCiudadesCatalogos
                        object_list={ciudades_catalogos}
                        permisos_object={permisos_departamentos}
                        paises_list={paises}
                        ciudades_list={ciudades}
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
        ciudades: state.geografia_ciudades,
        ciudades_catalogos: state.ciudades_catalogos,
        departamentos: state.geografia_departamentos,
        paises: state.geografia_paises,
    }
}

export default connect(mapPropsToState, actions)(GeografiaDashboard)