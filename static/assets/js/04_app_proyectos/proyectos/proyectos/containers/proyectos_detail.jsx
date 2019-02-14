import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import TablaProyectoLiterales from '../../literales/components/proyectos_literales_tabla';
import FormEditProyecto from '../../proyectos/components/proyectos_general';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    PROYECTOS as permisos_view,
    CLIENTES as clientes_permisos_view,
    LITERALES as literales_permisos_view,
    COTIZACIONES as cotizaciones_permisos_view,
    ARCHIVOS_PROYECTOS as archivos_proyecto_permisos_view,
    ARCHIVOS_LITERALES as archivos_literales_permisos_view,
} from "../../../../00_utilities/permisos/types";
import LiteralModalCreate from './../../literales/components/literal_nuevo_modal';
import LiteralDetail from '../../literales/components/literal_detail';
import ProyectoInfo from '../../proyectos/components/proyecto_datos';
import PanelArchivosProyecto from '../../archivos/proyectos/panel_archivos_proyectos';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            select_literal_id: null,
            mostrar_literal_info: false
        });
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onLiteralSelect = this.onLiteralSelect.bind(this);
        this.onUpdateProyecto = this.onUpdateProyecto.bind(this);
        this.clearCurrentLiteral = this.clearCurrentLiteral.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearProyectos();
    }

    clearCurrentLiteral() {
        this.setState({select_literal_id: null, mostrar_literal_info: true});
    }

    onUpdateProyecto(proyecto) {
        this.props.updateProyecto(proyecto.id, proyecto);
    }

    onLiteralSelect(select_literal_id) {
        this.setState({
            select_literal_id,
            mostrar_literal_info: true
        });
    }

    onTabClick(tab_index) {
        const {id} = this.props.match.params;
        if (tab_index === 1) {
            const cargarCotizacioneParaCrearLiterales = () => this.props.fetchCotizacionesPidiendoCarpeta();
            this.props.fetchLiteralesXProyecto(id, {callback: cargarCotizacioneParaCrearLiterales});
        }
    }


    cargarDatos() {
        const {id} = this.props.match.params;
        const cargarCotizacioneParaCrearLiterales = () => this.props.fetchCotizacionesPidiendoCarpeta();
        const cargarLiterales = () => this.props.fetchLiteralesXProyecto(id, {callback: cargarCotizacioneParaCrearLiterales});
        this.props.fetchProyecto(id, {callback: cargarLiterales});
    }

    render() {
        const {
            object,
            mis_permisos,
            literales_list,
            contizaciones_list,
        } = this.props;
        const permisos = permisosAdapter(permisos_view);
        const permisos_literales = permisosAdapter(literales_permisos_view);
        const cotizacion_permisos = permisosAdapter(cotizaciones_permisos_view);
        const archivos_proyecto_permisos = permisosAdapter(archivos_proyecto_permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        const {select_literal_id} = this.state;
        const item_seleccionado = select_literal_id ? literales_list[select_literal_id] : null;

        let cotizacion_pendiente_por_literal = null;
        const cotizacion_pendiente_por_literal_list = _.map(
            _.pickBy(contizaciones_list, c => parseInt(c.crear_literal_id_proyecto) === object.id), e => e
        );
        if (cotizacion_pendiente_por_literal_list.length > 0) {
            cotizacion_pendiente_por_literal = cotizacion_pendiente_por_literal_list[0]
        }

        let cotizaciones_proyecto_list = _.map(_.pickBy(literales_list, e => e.cotizacion), e => {
            return (
                {
                    tipo: 'L',
                    cotizacion: e.cotizacion,
                    cotizacion_nro: e.cotizacion_nro,
                }
            )
        });

        if (object.cotizacion) {
            cotizaciones_proyecto_list = [...cotizaciones_proyecto_list, {
                tipo: 'P',
                cotizacion: object.cotizacion,
                cotizacion_nro: object.cotizacion_nro
            }];
        }

        return (
            <ValidarPermisos can_see={permisos.list} nombre='detalles de proyecto'>
                <div className="row">
                    <div className="col-12">
                        <ProyectoInfo cotizaciones_proyecto_list={cotizaciones_proyecto_list}
                                      proyecto={object}
                                      cotizaciones_permisos={cotizacion_permisos}/>
                    </div>
                    <div className="col-12">
                        <Tabs>
                            <TabList>
                                <Tab onClick={() => {
                                    this.onTabClick(1);
                                }}>Literales</Tab>
                                {
                                    permisos.change &&
                                    <Tab>Editar</Tab>
                                }
                                {
                                    archivos_proyecto_permisos.list &&
                                    <Tab>Documentos</Tab>
                                }
                            </TabList>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-12 col-lg-3">
                                        <LiteralModalCreate
                                            permisos_object={permisos_literales}
                                            cotizacion_pendiente_por_literal={null}
                                            {...this.props}
                                        />
                                        {
                                            cotizacion_pendiente_por_literal &&
                                            <LiteralModalCreate
                                                callback={() => this.cargarDatos()}
                                                permisos_object={permisos_literales}
                                                cotizacion_pendiente_por_literal={{
                                                    cotizacion: cotizacion_pendiente_por_literal.id,
                                                    descripcion: cotizacion_pendiente_por_literal.descripcion_cotizacion
                                                }}
                                                {...this.props}
                                            />
                                        }
                                        <TablaProyectoLiterales
                                            lista_literales={_.map(literales_list, e => e)}
                                            onSelectItem={this.onLiteralSelect}
                                            select_literal_id={select_literal_id}
                                            proyecto={object}
                                            permisos={permisos}
                                        />
                                    </div>
                                    {
                                        item_seleccionado &&
                                        <div className="col-12 col-lg-9">
                                            <LiteralDetail
                                                mis_permisos={mis_permisos}
                                                callbackCargarDatosProyecto={() => this.cargarDatos()}
                                                clearCurrentLiteral={this.clearCurrentLiteral}
                                                id_literal={select_literal_id}
                                                proyecto={object}
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
                            {
                                archivos_proyecto_permisos.list &&
                                <TabPanel>
                                    <PanelArchivosProyecto proyecto={object} mis_permisos={mis_permisos}/>
                                </TabPanel>
                            }
                        </Tabs>
                    </div>
                </div>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        literales_list: state.literales,
        object: state.proyectos[id],
        contizaciones_list: state.cotizaciones,
        clientes_list: state.clientes,
    }
}

export default connect(mapPropsToState, actions)(Detail)