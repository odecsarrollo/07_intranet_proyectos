import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    PROFORMAS_ANTICIPOS as proforma_anticipos_view
} from "../../../../00_utilities/permisos/types";

import BloqueProformaConfiguracion from "../../configuracion/components/ProformaConfiguracion";
import BloqueProformaCobros from "../../anticipos/components/CobrosList";

class ItemsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Anticipos';
        this.singular_name = 'Anticipo';
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        if (index === 0) {
            this.props.fetchProformasAnticipos()
        }
        if (index === 1) {
            this.props.fetchProformaConfiguracion()
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
        const {slideIndex} = this.state;
        const {contabilidad_proforma_configuracion, contabilidad_proforma_anticipos, mis_permisos} = this.props;
        const can_see = true;
        const permisos_anticipos = permisosAdapter(proforma_anticipos_view);
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Titulo>{this.singular_name}</Titulo>
                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Anticipos"/>
                    <Tab label="Configuracion"/>
                </Tabs>
                {
                    slideIndex === 0 &&
                    <BloqueProformaCobros
                        {...this.props}
                        object_list={contabilidad_proforma_anticipos}
                        permisos_object={permisos_anticipos}
                    />
                }
                {
                    slideIndex === 1 &&
                    _.size(contabilidad_proforma_configuracion) > 0 &&
                    <BloqueProformaConfiguracion
                        {...this.props}
                        item_seleccionado={_.map(contabilidad_proforma_configuracion)[0]}
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
        contabilidad_proforma_configuracion: state.contabilidad_proforma_configuracion,
        contabilidad_proforma_anticipos: state.contabilidad_proforma_anticipos,
    }
}

export default connect(mapPropsToState, actions)(ItemsDashboard)