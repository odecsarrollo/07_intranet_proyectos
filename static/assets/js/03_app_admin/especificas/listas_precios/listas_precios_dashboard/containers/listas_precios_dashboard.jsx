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
    FORMAS_PAGOS as formas_pagos_canales_permisos_view
} from "../../../../../00_utilities/permisos/types";

import BloqueFormasPagosCanal from "../../formas_pagos_canal/components/forma_pago_list";

class ItemsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Listado de Precio';
        this.singular_name = 'Listados de Precios';
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            const cargarCanales = () => this.props.fetchCanalesDistribuciones();
            this.props.fetchFormasPagos({callback: cargarCanales});
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
        const {formas_pagos_canales, canales} = this.props;
        const {slideIndex} = this.state;
        const permisos_formas_pagos_canales = permisosAdapter(formas_pagos_canales_permisos_view);

        const can_see = permisos_formas_pagos_canales.list;
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
                    <BloqueFormasPagosCanal
                        object_list={formas_pagos_canales}
                        canales_list={canales}
                        permisos_object={permisos_formas_pagos_canales}
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
        formas_pagos_canales: state.formas_pagos_canales,
        canales: state.clientes_canales
    }
}

export default connect(mapPropsToState, actions)(ItemsDashboard)