import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter, pesosColombianos} from "../../../../../../00_utilities/common";
import TablaProyectoLiterales from '../components/proyectos_literales_tabla';
import TablaProyectoLiteralesMateriales from '../components/proyectos_literales_materiales_tabla';
import TablaProyectoLiteralesManoObra from '../components/proyectos_literales_mano_obra_tabla';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    PROYECTOS as permisos_view
} from "../../../../../../00_utilities/permisos/types";

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
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearProyectos();
        this.props.clearItemsLiterales();
        this.props.clearLiterales();
    }

    onLiteralSelect(item) {
        const {cargando, noCargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const cargarHorasManoObraLiteral = (literal_id) => this.props.fetchHorasHojasTrabajosxLiteral(literal_id, () => noCargando(), notificarErrorAjaxAction);
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
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };

        const cargarLiterales = () => this.props.fetchLiteralesXProyecto(id, success_callback, notificarErrorAjaxAction);
        const cargarProyecto = () => this.props.fetchProyecto(id, cargarLiterales, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarProyecto, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos, items_literales, horas_hojas_trabajos_list, literales_list} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        const {item_seleccionado} = this.state;
        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de proyecto'>
                <Titulo>Detalle {object.id_proyecto}</Titulo>
                <div className="row">
                    <div className="col-12">
                        <h3 className="h3-responsive">Proyecto: <small>{object.id_proyecto}</small></h3>
                    </div>
                    <div className="col-12 col-lg-4">
                        <h5 className='h5-responsive'>Literales</h5>
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

                            <div className="row">
                                <div className="col-12">
                                    <h4 className="h4-responsive">Literal: <small>{item_seleccionado.id_literal}</small>
                                    </h4>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className='h5-response'>{item_seleccionado.descripcion}</h5>
                                        </div>
                                        {
                                            permisos.costo_materiales &&
                                            <div className="col-12">
                                                <h6 className='h6-response'>Costo
                                                    Materiales: <small>{pesosColombianos(item_seleccionado.costo_materiales)}</small>
                                                </h6>
                                            </div>
                                        }
                                        {permisos.costo_mano_obra &&
                                        <div className="col-12">
                                            <h6 className='h6-response'>Costo
                                                Mano
                                                Obra: <small>{pesosColombianos(Number(item_seleccionado.costo_mano_obra)+Number(item_seleccionado.costo_mano_obra_inicial))}</small>
                                            </h6>
                                        </div>
                                        }
                                        {
                                            permisos.costo &&
                                            <div className="col-12">
                                                <h6 className='h6-response'>Costo
                                                    Total: <small>{pesosColombianos(Number(item_seleccionado.costo_mano_obra_inicial) + Number(item_seleccionado.costo_mano_obra) + Number(item_seleccionado.costo_materiales))}</small>
                                                </h6>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <Tabs>
                                <TabList>
                                    <Tab>Materiales</Tab>
                                    <Tab>Mano Obra</Tab>
                                </TabList>
                                <TabPanel>
                                    <div className="col-12">
                                        <TablaProyectoLiteralesMateriales
                                            items_literales={items_literales}
                                            can_see_ultimo_costo_item_biable={permisos.ultimo_costo_item_biable}
                                        />
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <TablaProyectoLiteralesManoObra
                                        horas_mano_obra_literales={horas_hojas_trabajos_list}
                                    />
                                </TabPanel>
                            </Tabs>
                        </div>
                    }
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
        object: state.proyectos[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)