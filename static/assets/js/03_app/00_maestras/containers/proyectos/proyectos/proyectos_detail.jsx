import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import TablaProyectoLiterales from './../../../components/proyectos/proyectos/proyectos_literales_tabla';
import ProyectoLiteralDetail from './../../../components/proyectos/proyectos/proyectos_literales_detail';
import CargarDatos from '../../../../components/cargar_datos';
import {SinPermisos} from '../../../../components/utiles';
import {tengoPermiso} from "../../../../../01_actions/00_general_fuctions";

class ProyectoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_literal_info: false,
            cargando: false,
            cargando_literales: false
        });
        this.error_callback = this.error_callback.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onLiteralSelect = this.onLiteralSelect.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        this.setState({cargando: true});
        const {match: {params: {id}}} = this.props;
        const {item_seleccionado} = this.state;
        this.props.fetchProyecto(id, null, this.error_callback);
        if (item_seleccionado) {
            this.props.fetchLiteral(
                item_seleccionado.id,
                response => {
                    this.props.fetchItemsLiterales(
                        response.id,
                        () => {
                            this.setState({item_seleccionado: response, mostrar_literal_info: true, cargando: false});
                        },
                        this.error_callback
                    );
                },
                this.error_callback
            );
        } else {
            this.setState({cargando: false})
        }
    }

    onLiteralSelect(item) {
        this.setState({cargando_literales: true});
        this.props.fetchLiteral(
            item.id,
            response => {
                this.props.fetchItemsLiterales(response.id,
                    () => {
                        this.setState({
                            item_seleccionado: response,
                            mostrar_literal_info: true,
                            cargando_literales: false
                        });
                    },
                    this.error_callback
                );
            },
            this.error_callback
        );
    }

    render() {
        const {proyecto, items_literales, mis_permisos} = this.props;
        const {item_seleccionado} = this.state;
        if (!proyecto) {
            return (<div>Cargando ...</div>)
        }
        return (
            <SinPermisos
                nombre='Proyecto Detalle'
                cargando={this.state.cargando}
                mis_permisos={mis_permisos}
                can_see={tengoPermiso(mis_permisos, 'detail_proyecto')}
            >
                <div className="row">
                    <div className="col-12">
                        <h3 className="h3-responsive">Proyecto: <small>{proyecto.id_proyecto}</small></h3>
                    </div>
                    <div className="col-12 col-lg-4">
                        <h5 className='h5-responsive'>Literales</h5>
                        <TablaProyectoLiterales
                            lista_literales={proyecto.mis_literales}
                            onSelectItem={this.onLiteralSelect}
                            item_seleccionado={item_seleccionado}
                        />
                    </div>
                    {
                        item_seleccionado &&
                        <div className="col-12 col-lg-8">
                            <SinPermisos
                                nombre='Literales'
                                cargando={this.state.cargando_literales}
                                mis_permisos={mis_permisos}
                                can_see={true}
                            >
                                <ProyectoLiteralDetail
                                    literal={item_seleccionado}
                                    items_literales={items_literales}
                                />
                            </SinPermisos>
                        </div>
                    }
                    <CargarDatos cargarDatos={this.cargarDatos}/>
                </div>
            </SinPermisos>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {match: {params: {id}}} = ownProps;
    return {
        proyecto: state.proyectos[id],
        items_literales: state.items_literales,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(ProyectoDetail);