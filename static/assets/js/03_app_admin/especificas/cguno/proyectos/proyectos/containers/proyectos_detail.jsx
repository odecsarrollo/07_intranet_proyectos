import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {SinObjeto} from "../../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import TablaProyectoLiterales from '../../literales/components/proyectos_literales_tabla';
import FormEditProyecto from '../../proyectos/components/proyectos_general';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    PROYECTOS as permisos_view,
    LITERALES as literales_permisos_view
} from "../../../../../../00_utilities/permisos/types";
import LiteralModalCreate from './../../literales/components/literal_nuevo_modal';
import LiteralDetail from '../../literales/components/literal_detail';
import ProyectoInfo from '../../proyectos/components/proyecto_datos';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_literal_info: false
        });
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onLiteralSelect = this.onLiteralSelect.bind(this);
        this.onUpdateProyecto = this.onUpdateProyecto.bind(this);
        this.setCurrentLiteral = this.setCurrentLiteral.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearProyectos();
        this.props.clearLiterales();
        this.props.clearHorasColaboradoresProyectosIniciales();
        this.props.clearHorasHojasTrabajos();
        this.props.clearItemsLiterales();
    }

    setCurrentLiteral(item_seleccionado) {
        this.setState({item_seleccionado});
    }

    onUpdateProyecto(proyecto) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        this.props.updateProyecto(proyecto.id, proyecto, () => noCargando(), notificarErrorAjaxAction);
    }

    onLiteralSelect(item) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarHorasManoObraInicialLiteral = (literal_id) => this.props.fetchHorasColaboradoresProyectosInicialesxLiteral(literal_id, () => noCargando(), notificarErrorAjaxAction);
        const cargarHorasManoObraLiteral = (literal_id) => this.props.fetchHorasHojasTrabajosxLiteral(literal_id, () => cargarHorasManoObraInicialLiteral(literal_id), notificarErrorAjaxAction);
        const cargarItemsLiteral = (literal_id) => this.props.fetchItemsLiterales(literal_id, () => cargarHorasManoObraLiteral(literal_id), notificarErrorAjaxAction);
        this.props.fetchLiteral(
            item.id,
            (response) => {
                this.setState({
                    item_seleccionado: response,
                    mostrar_literal_info: true
                });
                cargarItemsLiteral(response.id);
            },
            notificarErrorAjaxAction
        );
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };

        const cargarLiterales = () => this.props.fetchLiteralesXProyecto(id, success_callback, notificarErrorAjaxAction);
        const cargarProyecto = () => this.props.fetchProyecto(id, cargarLiterales, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarProyecto, notificarErrorAjaxAction);

    }

    render() {
        const {
            object,
            mis_permisos,
            items_literales,
            horas_hojas_trabajos_list,
            literales_list,
            horas_colaboradores_proyectos_iniciales_list,
        } = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_literales = permisosAdapter(mis_permisos, literales_permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        const {item_seleccionado} = this.state;
        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de proyecto'>
                <div className="row">
                    <div className="col-12">
                        <ProyectoInfo proyecto={object}/>
                    </div>
                    <div className="col-12">
                        <Tabs>
                            <TabList>
                                <Tab>Literales</Tab>
                                {
                                    permisos.change &&
                                    <Tab>Editar</Tab>
                                }
                            </TabList>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-12 col-lg-4">
                                        <LiteralModalCreate
                                            permisos_object={permisos_literales}
                                            setCurrentLiteral={this.setCurrentLiteral}
                                            {...this.props}
                                        />
                                        <TablaProyectoLiterales
                                            lista_literales={_.map(literales_list, e => e)}
                                            onSelectItem={this.onLiteralSelect}
                                            item_seleccionado={item_seleccionado}
                                            proyecto={object}
                                            permisos={permisos}
                                        />
                                    </div>
                                    {
                                        item_seleccionado &&
                                        <div className="col-12 col-lg-8">
                                            <LiteralDetail
                                                setCurrentLiteral={this.setCurrentLiteral}
                                                literal={item_seleccionado}
                                                items_literales={items_literales}
                                                horas_hojas_trabajos_list={horas_hojas_trabajos_list}
                                                horas_colaboradores_proyectos_iniciales_list={horas_colaboradores_proyectos_iniciales_list}
                                                proyecto={object}
                                                permisos={permisos}
                                                permisos_literales={permisos_literales}
                                                {...this.props}
                                            />
                                        </div>
                                    }
                                </div>
                            </TabPanel>
                            {
                                permisos.change &&
                                <TabPanel>
                                    <FormEditProyecto
                                        onSubmit={this.onUpdateProyecto}
                                        proyecto={object}
                                        permisos_object={permisos}
                                        {...this.props}
                                    />
                                </TabPanel>
                            }
                        </Tabs>
                    </div>
                    <CargarDatos cargarDatos={this.cargarDatos}/>
                </div>
                <CargarDatos cargarDatos={this.cargarDatos}/>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        items_literales: state.items_literales,
        horas_hojas_trabajos_list: state.horas_hojas_trabajos,
        literales_list: state.literales,
        horas_colaboradores_proyectos_iniciales_list: state.horas_colaboradores_proyectos_iniciales,
        object: state.proyectos[id],
        clientes_list: state.clientes,
    }
}

export default connect(mapPropsToState, actions)(Detail)