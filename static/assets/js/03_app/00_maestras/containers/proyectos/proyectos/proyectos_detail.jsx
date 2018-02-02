import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../../01_actions/01_index';
import TablaProyectoLiterales from './../../../components/proyectos/proyectos/proyectos_literales_tabla';
import ProyectoLiteralDetail from './../../../components/proyectos/proyectos/proyectos_literales_detail';
import CargarDatos from '../../../../components/cargar_datos';

class ProyectoDetail extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_literal_info: false
        })
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };

        const {match: {params: {id}}} = this.props;
        const {item_seleccionado} = this.state;

        this.props.fetchProyecto(id, null, error_callback);
        if (item_seleccionado) {
            this.props.fetchLiteral(
                item_seleccionado.id,
                response => {
                    this.setState({item_seleccionado: response, mostrar_literal_info: true});
                    this.props.fetchItemsLiterales(response.id, null, error_callback);
                },
                error_callback
            );
        }
    }

    onLiteralSelect(item) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        this.props.fetchLiteral(
            item.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_literal_info: true});
                this.props.fetchItemsLiterales(response.id, null, error_callback);
            },
            error_callback
        );
    }

    render() {
        const {proyecto, items_literales} = this.props;
        const {item_seleccionado} = this.state;
        if (!proyecto) {
            return (<div>Cargando ...</div>)
        }
        return (
            <div className="row">
                <div className="col-12">
                    <h3 className="h3-responsive">Proyecto: <small>{proyecto.id_proyecto}</small></h3>
                </div>
                <div className="col-12 col-md-4 col-lg-3">
                    <h5 className='h5-responsive'>Literales</h5>
                    <TablaProyectoLiterales
                        lista_literales={proyecto.mis_literales}
                        onSelectItem={this.onLiteralSelect.bind(this)}
                        item_seleccionado={item_seleccionado}
                    />
                </div>
                {
                    item_seleccionado &&
                    <div className="col-12 col-md-8 col-lg-9">
                        <ProyectoLiteralDetail
                            literal={item_seleccionado}
                            items_literales={items_literales}
                        />
                    </div>
                }
                <CargarDatos cargarDatos={this.cargarDatos.bind(this)}/>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {match: {params: {id}}} = ownProps;
    return {
        proyecto: state.proyectos[id],
        items_literales: state.items_literales
    }
}

export default connect(mapPropsToState, actions)(ProyectoDetail);