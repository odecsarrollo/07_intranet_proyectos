import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../../permisos/validar_permisos";
import {permisosAdapterDos} from "../../../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    COLABORADORES as bloque_1_permisos,
    CENTROS_COSTOS_COLABORADORES as bloque_2_permisos,
} from "../../../../../../permisos";

import BloqueColaboradores from '../../colaboradores/components/ColaboradorList';
import BloqueCentrosCostos from '../../centros_costos/components/CentroCostoList';


class ListadoElementos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Panel Colaboradores';
        this.singular_name = 'Panel Colaboradores';
        this.cargarDatos = this.cargarDatos.bind(this);

    }

    handleChange = (event, value) => {
        if (value !== this.state.slideIndex) {
            this.cargarElementos(value);
        }
        this.setState({
            slideIndex: value,
        });
    };

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            const cargarColaboradores = () => this.props.fetchColaboradores();
            this.props.fetchCentrosCostosColaboradores({callback: cargarColaboradores});
        } else if (index === 1) {
            this.props.fetchCentrosCostosColaboradores();
        }
    }

    componentDidMount() {
        this.props.fetchMisPermisosxListado(
            [
                bloque_1_permisos,
                bloque_2_permisos
            ], {callback: () => this.cargarDatos()}
        );
    }


    componentWillUnmount() {
        this.props.clearColaboradores();
        this.props.clearCentrosCostosColaboradores();
    }


    render() {
        const {bloque_1_list, bloque_2_list, mis_permisos} = this.props;
        const {slideIndex} = this.state;
        const permisos_object_1 = permisosAdapterDos(mis_permisos, bloque_1_permisos);
        const permisos_object_2 = permisosAdapterDos(mis_permisos, bloque_2_permisos);

        const can_see =
            permisos_object_1.list ||
            permisos_object_2.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>

                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Colaboradores"/>
                    <Tab label="Centros Costos"/>
                </Tabs>

                {
                    slideIndex === 0 &&
                    <BloqueColaboradores
                        object_list={bloque_1_list}
                        permisos_object={permisos_object_1}
                        {...this.props}
                        centros_costos_list={bloque_2_list}
                    />
                }
                {
                    slideIndex === 1 &&
                    <BloqueCentrosCostos
                        object_list={bloque_2_list}
                        permisos_object={{...permisos_object_2, add: false, delete: false, change: false}}
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
        bloque_1_list: state.colaboradores,
        bloque_2_list: state.centros_costos_colaboradores,
    }
}

export default connect(mapPropsToState, actions)(ListadoElementos)