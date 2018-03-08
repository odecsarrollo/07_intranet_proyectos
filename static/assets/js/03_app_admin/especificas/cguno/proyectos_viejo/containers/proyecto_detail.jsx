import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../01_actions/01_index";
import CargarDatos from "../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../00_utilities/permisos/validar_permisos";
import {tengoPermiso} from "../../../../../00_utilities/common";
import TablaProyectoLiterales from '../../proyectos/proyectos/components/proyectos_literales_tabla';
import ProyectoLiteralDetail from '../../proyectos/proyectos/components/proyectos_literales_detail';
import {
    PERMISO_DETAIL_PROYECTO as can_detail_permiso,
    PERMISO_VALOR_PROYECTO as can_valor_proyecto_permiso,
    PERMISO_COSTO_PROYECTO as can_costo_proyecto_permiso,
    PERMISO_COSTO_PRESUPUESTADO_PROYECTO as can_costo_presupuestado_proyecto_permiso,
    PERMISO_COSTO_MATERIALES_PROYECTO as can_costo_materiales_proyecto_permiso,
    PERMISO_COSTO_MANO_OBRA_PROYECTO as can_costo_mano_obra_proyectos_permiso,
    PERMISO_ULTIMO_COSTO_ITEM_BIABLE as can_ultimo_costo_item_biable_permiso

} from "../../../../../00_utilities/permisos/types";


class ProyectosDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_literal_info: false
        });
        this.error_callback = this.error_callback.bind(this);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.onLiteralSelect = this.onLiteralSelect.bind(this);
        this.notificar = this.notificar.bind(this);
    }

    error_callback(error) {
        this.props.notificarErrorAjaxAction(error);
    }

    notificar(mensaje) {
        this.props.notificarAction(mensaje);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearProyectos()
    }

    onLiteralSelect(item) {
        this.props.cargando();
        const cargarItemsLiteral = (response) => this.props.fetchItemsLiterales(response.id, () => this.props.noCargando(), this.error_callback);
        const cargarLiteral = () => this.props.fetchLiteral(
            item.id,
            (response) => {
                this.setState({
                    item_seleccionado: response,
                    mostrar_literal_info: true
                });
                cargarItemsLiteral(response);
            },
            this.error_callback
        );
        this.props.fetchMisPermisos(cargarLiteral, this.error_callback);
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando} = this.props;
        const {item_seleccionado} = this.state;
        cargando();
        this.props.fetchProyecto(id, () => noCargando(), this.error_callback);
        if (item_seleccionado) {
            const cargarItemsLiteral = (response) => this.props.fetchItemsLiterales(response.id, () => this.props.noCargando(), this.error_callback);
            const cargarLiteral = () => this.props.fetchLiteral(
                item_seleccionado.id,
                (response) => {
                    this.setState({
                        item_seleccionado: response,
                        mostrar_literal_info: true
                    });
                    cargarItemsLiteral(response);
                },
                this.error_callback
            );
            this.props.fetchMisPermisos(cargarLiteral, this.error_callback)
        } else {
            this.props.fetchMisPermisos(() => this.props.noCargando(), this.error_callback)
        }

    }

    render() {
        const {proyecto, mis_permisos, items_literales} = this.props;
        const {item_seleccionado} = this.state;
        const can_detail = tengoPermiso(mis_permisos, can_detail_permiso);
        const can_see_costo_mano_obra = tengoPermiso(mis_permisos, can_costo_mano_obra_proyectos_permiso);
        const can_see_costo_materiales = tengoPermiso(mis_permisos, can_costo_materiales_proyecto_permiso);
        const can_see_costo_presupuestado = tengoPermiso(mis_permisos, can_costo_presupuestado_proyecto_permiso);
        const can_see_precio = tengoPermiso(mis_permisos, can_valor_proyecto_permiso);
        const can_see_costo_total = tengoPermiso(mis_permisos, can_costo_proyecto_permiso);
        const can_see_ultimo_costo_item_biable = tengoPermiso(mis_permisos, can_ultimo_costo_item_biable_permiso);

        if (!proyecto) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={can_detail} nombre='detalles de proyecto'>
                <Titulo>Detalle {proyecto.id_proyecto}</Titulo>
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
                            proyecto={proyecto}
                            can_see_costo_mano_obra={can_see_costo_mano_obra}
                            can_see_costo_materiales={can_see_costo_materiales}
                            can_see_costo_total={can_see_costo_total}
                        />
                    </div>
                    {
                        item_seleccionado &&
                        <div className="col-12 col-lg-8">
                            <ProyectoLiteralDetail
                                literal={item_seleccionado}
                                items_literales={items_literales}
                                can_see_costo_mano_obra={can_see_costo_mano_obra}
                                can_see_costo_materiales={can_see_costo_materiales}
                                can_see_costo_total={can_see_costo_total}
                                can_see_ultimo_costo_item_biable={can_see_ultimo_costo_item_biable}
                            />
                        </div>
                    }
                    <CargarDatos cargarDatos={this.cargarDatos}/>
                </div>
            </ValidarPermisos>
        )
    }

}

function mapPropsToState(state, ownProps) {
    const {id} = ownProps.match.params;
    return {
        mis_permisos: state.mis_permisos,
        items_literales: state.items_literales,
        proyecto: state.proyectos[id]
    }
}

export default connect(mapPropsToState, actions)(ProyectosDetail)