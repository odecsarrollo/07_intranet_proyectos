import React, {Component} from 'react';
import TareasPendientesList from '../tareas_fases/tareas_pendientes';
import LiteralesSeguimiento from '../literales_seguimiento/literales_seguimiento';
import MatrixProyectos from '../matrix_proyectos/matrix_proyectos';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CargarDatos from '../../../00_utilities/components/system/cargar_datos';
import {permisosAdapterDos} from "../../../00_utilities/common";
import ValidarPermisos from "../../../permisos/validar_permisos";
import {
    FASES_LITERALES as fases_literales_view
} from '../../../permisos'


const table_style = {
    th: {
        padding: 0,
        margin: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
    },
    td: {
        padding: 0,
        margin: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
    },
    table: {
        fontSize: '12px',
        width: '100%'
    }
};

const tab_style = {
    div:{
        marginTop: '50px'
    }
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0,
            labelModo: 'Mis Tareas'
        };
        this.handleChange = this.handleChange.bind(this)
        this.cargarDatos = this.cargarDatos.bind(this);
        this.plural_name = 'Literales';
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
            this.props.fetchMisPendientesTareasFases();
            this.setState({
                labelModo: 'Mis Tareas'
            });
        } else if (index === 1) {
            this.props.fetchMisPendientesTareasFases();
            this.setState({
                labelModo: 'Para Supervisar'
            });
        } else if (index === 2) {
            this.props.fetchLiteralesConSeguimiento();
        } else if (index === 3) {
            this.props.fetchPendientesTareasFases();
        }
    }

    componentDidMount() {
               this.props.fetchMisPermisosxListado(
            [
                fases_literales_view
            ], {callback: () => this.cargarDatos()}
        );
    }

    render() {
        const {slideIndex, labelModo} = this.state;
        const {fases_tareas, literales, mis_permisos} = this.props;
        const permisos_literales = permisosAdapterDos(mis_permisos, fases_literales_view)
        const can_see = permisos_literales.list;

        return (
            <ValidarPermisos can_see={can_see} nombre={this.plural_name}>
                <Tabs
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleChange}
                    value={slideIndex}
                >
                    <Tab label="Mis Tareas"/>
                    <Tab label="Supervisar"/>
                    <Tab label="Seguimiento Literales"/>
                    <Tab label="Prueba"/>
                </Tabs>

                    {
                        slideIndex === 0 &&
                            <TareasPendientesList
                                {...this.props}
                                table_style={table_style}
                                fases_tareas = {_.pickBy(fases_tareas, e => e.soy_asignado)}
                                label_modo = {labelModo}
                                modo={1}
                        />
                    }
                    {
                        slideIndex === 1 &&
                          <TareasPendientesList
                                {...this.props}
                                table_style={table_style}
                                fases_tareas = {_.pickBy(fases_tareas, e => e.soy_responsable && !e.soy_asignado)}
                                label_modo = {labelModo}
                                modo={2}
                            />
                    }
                    {
                        slideIndex === 2 &&
                            <LiteralesSeguimiento
                                {...this.props}
                                table_style={table_style}
                                literales = {literales}
                            />
                    }
                    {
                        slideIndex === 3 &&
                            <MatrixProyectos
                                {...this.props}
                                table_style={table_style}
                                fases_tareas = {fases_tareas}
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
        fases_tareas: state.fases_tareas,
        literales: state.literales,
    }
}

export default connect(mapPropsToState, actions)(Dashboard)