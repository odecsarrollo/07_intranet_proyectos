import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import {
    COLABORADORES as bloque_1_permisos,
    //PERMISOS_2 as bloque_2_permisos,
} from "../../../../../../00_utilities/permisos/types";

import BloqueTabColaboradores from '../../colaboradores/components/colaborador_bloque';
import BloqueTabCentrosCostosColaboradores from '../../centros_costos_colaboradores/components/centros_costos_colaboradores_bloque';

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
    slide: {
        padding: 10,
    },
};


class ListadoElementos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Gestion Colaboradores';
        this.singular_name = 'Gestion Colaborador';
        this.cargarDatos = this.cargarDatos.bind(this);

    }

    handleChange = (value) => {
        this.setState({
            slideIndex: value,
        });
    };

    componentDidMount() {
        this.cargarDatos();
    }


    componentWillUnmount() {
        this.props.clearColaboradores();
        this.props.clearCentrosCostosColaboradores();
    }

    cargarDatos() {
        const {notificarErrorAjaxAction, cargando, noCargando} = this.props;
        cargando();
        const cargarBloques2 = () => this.props.fetchCentrosCostosColaboradores(() => noCargando(), notificarErrorAjaxAction);
        const cargarBloques1 = () => this.props.fetchColaboradores(cargarBloques2, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarBloques1, notificarErrorAjaxAction)
    }

    render() {
        const {bloque_1_list, bloque_2_list, mis_permisos} = this.props;

        const can_see =
            permisosAdapter(mis_permisos, bloque_1_permisos).list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>

                <Tabs
                    onChange={this.handleChange}
                    value={this.state.slideIndex}
                >
                    <Tab label="Colaboradores" value={0}/>
                    <Tab label="Centros de Costos" value={1}/>
                </Tabs>

                <SwipeableViews
                    index={this.state.slideIndex}
                    onChangeIndex={this.handleChange}
                >
                    <div style={styles.slide}>
                        <h2 style={styles.headline}>Colaboradores</h2>
                        <BloqueTabColaboradores
                            {...this.props}
                            list={bloque_1_list} mis_permisos={mis_permisos}
                            centros_costos_list={bloque_2_list}
                        />
                    </div>
                    <div style={styles.slide}>
                        <h2 style={styles.headline}>Centros Costos</h2>
                        <BloqueTabCentrosCostosColaboradores {...this.props} list={bloque_2_list}
                                                             mis_permisos={mis_permisos}/>
                    </div>
                </SwipeableViews>

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