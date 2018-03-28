import React, {Component} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import CargarDatos from "../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto, AtributoTexto, AtributoBooleano} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../00_utilities/common";
import {
    COLABORADORES as permisos_view
} from "../../../../00_utilities/permisos/types";

import BuscadorProyectos from '../components/buscardor_proyectos';
import ProyectoBox from '../components/proyecto_box';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
        this.modificarAutorizacionProyecto = this.modificarAutorizacionProyecto.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos();
        this.props.clearColaboradores();
        this.props.clearProyectos();
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarAction, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };
        const cargarProyectosAbiertos = () => this.props.fetchProyectosAbiertos(id, success_callback, notificarErrorAjaxAction);
        const cargarColaborador = () => this.props.fetchColaborador(id, cargarProyectosAbiertos, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarColaborador, notificarErrorAjaxAction);

    }

    modificarAutorizacionProyecto(literal_id, tipo) {
        const {id} = this.props.match.params;
        this.props.modificarAutorizacionLiteralColaborador(id, literal_id, tipo);
    }

    render() {
        const {object, mis_permisos, proyectos_list} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        let literales_actuales = _.map(proyectos_list, e => {
            return ({
                id_proyecto: e.id_proyecto,
                literales: e.mis_literales.filter(e => object.literales_autorizados.includes(e.id))
            })
        });
        literales_actuales = _.orderBy(_.pickBy(literales_actuales, e => e.literales.length > 0),['id_proyecto']);

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de colaborador'>
                <Titulo>Detalle {object.nombres} {object.apellidos}</Titulo>
                <div className="row">
                    <BuscadorProyectos
                        literales_colaborador_list={object.literales_autorizados}
                        proyectos_list={proyectos_list}
                        modificarAutorizacionProyecto={this.modificarAutorizacionProyecto}
                    />
                    {_.map(literales_actuales, p =>
                        <ProyectoBox
                            key={p.id_proyecto}
                            proyecto={p}
                            modificarAutorizacionProyecto={this.modificarAutorizacionProyecto}
                        />
                    )}
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
        object: state.colaboradores[id],
        proyectos_list: state.proyectos,
    }
}

export default connect(mapPropsToState, actions)(Detail)