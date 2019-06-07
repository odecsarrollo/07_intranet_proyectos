import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import EtiquetasMedios from '../components/etiquetas_medios/EtiquetasMediosList';
import StickersMedios from '../components/stickers_medios/StickersMediosList';
import MovimientosEtiquetaMedios from '../components/adhesivos_movimientos_medios/AdhesivosMovimientosList'
import UltimosMovimientosAdhesivosMedios
    from '../components/adhesivos_inventarios/AdhesivosInventarioList';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {permisosAdapterDos} from "../../../00_utilities/common";

import {
    ADHESIVO_MEDIOS_CATALOGOS as adhesivo_permisos_view,
    ADHESIVOS_MOVIMIENTOS_MEDIOS as adhesivo_movimientos_permisos_view,
} from '../../../00_utilities/permisos/types';
import ValidarPermisos from "../../../00_utilities/permisos/validar_permisos";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
        };
        this.plural_name = 'Panel Adhesivos';
        this.singular_name = 'Panel Adhesivos';
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    cargarDatos() {
        const {slideIndex} = this.state;
        this.cargarElementos(slideIndex)
    }

    cargarElementos(value = null) {
        let index = value !== null ? value : this.state.slideIndex;
        const cargarAdhesivos = () => this.props.fetchAdhesivosMedios();
        if (index === 0) {
            this.props.fetchAdhesivosMovimientosMedios({callback: cargarAdhesivos});
        } else if (index === 1) {
            this.props.fetchAdhesivoTipo(1);
        } else if (index === 2) {
            this.props.fetchAdhesivoTipo(2);
        } else if (index === 3) {
            cargarAdhesivos();
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
                adhesivo_permisos_view,
                adhesivo_movimientos_permisos_view
            ], {callback: () => this.cargarDatos()}
        );
    }


    render() {
        const {mis_permisos, adhesivos, movimientos_adhesivos} = this.props;
        const {slideIndex} = this.state;
        const permisos_adhesivos = permisosAdapterDos(mis_permisos, adhesivo_permisos_view);
        const permisos_movimientos_adhesivos = permisosAdapterDos(mis_permisos, adhesivo_movimientos_permisos_view);
        const can_see =
            permisos_adhesivos.list ||
            permisos_adhesivos.list_inventario ||
            permisos_movimientos_adhesivos.list;
        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Movimientos"/>
                    <Tab label="Etiquetas"/>
                    <Tab label="Stickers"/>
                    <Tab label="Inventario"/>
                </Tabs>
                {
                    slideIndex === 0 &&
                    <MovimientosEtiquetaMedios
                        {...this.props}
                        object_list={movimientos_adhesivos}
                        permisos_object={permisos_movimientos_adhesivos}
                    />
                }
                {
                    slideIndex === 1 &&
                    <EtiquetasMedios
                        {...this.props}
                        object_list={adhesivos}
                        permisos_object={permisos_adhesivos}
                    />
                }
                {
                    slideIndex === 2 &&
                    <StickersMedios
                        {...this.props}
                        object_list={adhesivos}
                        permisos_object={permisos_adhesivos}
                    />
                }
                {
                    slideIndex === 3 &&
                    <UltimosMovimientosAdhesivosMedios
                        {...this.props}
                        object_list={adhesivos}
                        permisos_object={{...permisos_adhesivos, add: false}}
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
        adhesivos: state.medios_adhesivos,
        movimientos_adhesivos: state.medios_adhesivos_movimientos,
    }
}

export default connect(mapPropsToState, actions)(Dashboard)