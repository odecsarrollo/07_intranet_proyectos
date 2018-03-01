import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import * as actions from "../../../../../../01_actions/01_index";
import CargarDatos from "../../../../../../00_utilities/components/system/cargar_datos";
import {Titulo, SinObjeto} from "../../../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../../../00_utilities/permisos/validar_permisos";
import {permisosAdapter} from "../../../../../../00_utilities/common";
import {
    COLABORADORES as permisos_view
} from "../../../../../../00_utilities/permisos/types";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.cargarDatos = this.cargarDatos.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearPermisos()
    }

    cargarDatos() {
        const {id} = this.props.match.params;
        const {noCargando, cargando, notificarErrorAjaxAction} = this.props;
        cargando();
        const success_callback = () => {
            noCargando();
        };
        const cargarColaborador = () => this.props.fetchColaborador(id, success_callback, notificarErrorAjaxAction);
        this.props.fetchMisPermisos(cargarColaborador, notificarErrorAjaxAction);

    }

    render() {
        const {object, mis_permisos} = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);


        if (!object) {
            return <SinObjeto/>
        }

        return (
            <ValidarPermisos can_see={permisos.detail} nombre='detalles de colaobrador'>
                <Titulo>Detalle {object.nombres} {object.apellidos}</Titulo>
                <div className="row">
                    <div className="col-md-6">
                        <span className="texto-atributo">
                            <strong>Cédula: </strong>{object.cedula}
                        </span>
                        <br/>
                        <span className="texto-atributo">
                                <strong>Centro de Costos: </strong>
                            {
                                object.centro_costo_nombre ?
                                    object.centro_costo_nombre :
                                    'Sin centro de Costo'
                            }
                                </span>
                        <br/>
                        <span className="texto-atributo">
                                <strong>Nombre de Usuario: </strong>
                            {
                                object.usuario_username ?
                                    object.usuario_username :
                                    'Sin usuario'
                            }
                                </span>
                    </div>
                    <div className="col-md-6">
                            <span className="texto-atributo">
                                <strong>Cargo: </strong>
                                {
                                    object.cargo ?
                                        object.cargo_descripcion :
                                        'Sin cargo'
                                }
                                </span>
                        <br/>
                        <span className="texto-atributo">
                                <strong>Cargo Tipo: </strong>
                            {
                                object.cargo_tipo ?
                                    object.cargo_tipo :
                                    'Sin cargo tipo'
                            }
                                </span>
                        <br/>
                    </div>
                    <div className="col-12">
                        {object.es_cguno &&
                        <Fragment>
                        <span className="texto-atributo">
                                <strong>En CGUno: </strong>
                                <i className='fas fa-check'
                                   style={{color: 'green'}}
                                >
                                </i>
                                </span>
                            <br/>
                        </Fragment>
                        }
                        {object.es_salario_fijo &&
                        <Fragment>
                        <span className="texto-atributo">
                                <strong>Es Salario Fijo: </strong>
                                <i className='fas fa-check'
                                   style={{color: 'green'}}
                                >
                                </i>
                                </span>
                            <span> {object.nro_horas_mes} horas trabajadas al mes</span>
                            <br/>
                        </Fragment>
                        }
                        {object.en_proyectos &&
                        <Fragment>
                        <span className="texto-atributo">
                                <strong>Esta en proyectos: </strong>
                                <i className='fas fa-check'
                                   style={{color: 'green'}}
                                >
                                </i>
                                </span>
                            <br/>
                        </Fragment>
                        }
                        {object.autogestion_horas_trabajadas &&
                        <Fragment>
                        <span className="texto-atributo">
                                <strong>Autogestiona horas trabajadas: </strong>
                                <i className='fas fa-check'
                                   style={{color: 'green'}}
                                >
                                </i>
                                </span>
                            <br/>
                        </Fragment>
                        }
                    </div>
                    <div className="col-6"></div>
                    <div className="col-6"></div>
                    <div className="col-6"></div>
                    <div className="col-6"></div>
                    <div className="col-6"></div>
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
        object: state.colaboradores[id]
    }
}

export default connect(mapPropsToState, actions)(Detail)