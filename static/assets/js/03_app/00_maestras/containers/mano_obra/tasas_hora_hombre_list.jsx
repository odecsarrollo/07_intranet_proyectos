import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../../01_actions/01_index';
import TextField from 'material-ui/TextField';
import TablaTasaHoraHombres from '../../components/mano_obra/tasas_hora_hombre_tabla';
import TasaHoraHombreForm from '../../components/mano_obra/tasas_hora_hombre_form';
import CargarDatos from '../../../components/cargar_datos';

import {tengoPermiso} from './../../../../01_actions/00_general_fuctions';

class TasaHoraHombreLista extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            busqueda: "",
            item_seleccionado: null,
            mostrar_form: false
        })
    }

    componentDidMount() {
        this.cargarDatos()
    }

    onSubmit(values) {

        // console.log(values.fecha.getYear())
        // console.log(values.fecha.getMonth())
        // console.log(values.fecha.getDate())

        console.log(values);

        const {id} = values;
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const callback = (response) => {
            this.props.fetchTasaHoraHombre(response.id);
            this.setState({mostrar_form: false, item_seleccionado: null});
            this.props.notificarAction(`El registro de la tasa hora hombre ${response.id_proyecto} ha sido exitoso!`);
        };
        if (id) {
            this.props.updateTasaHoraHombre(
                id,
                values,
                callback,
                error_callback
            )
        } else {
            this.props.createTasaHoraHombre(values, callback, error_callback)
        }
    }

    onCancel() {
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onDelete(id) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        const {item_seleccionado} = this.state;
        const {deleteTasaHoraHombre} = this.props;
        deleteTasaHoraHombre(id, () => {
                this.props.notificarAction(`Se ha eliminado la tasa hora hombre ${item_seleccionado.id_proyecto}!`);
            }, error_callback
        );
        this.setState({item_seleccionado: null, mostrar_form: false});
    }

    onSelectItem(item_seleccionado) {
        const error_callback = (error) => {
            this.props.notificarErrorAjaxAction(error);
        };
        this.props.fetchTasaHoraHombre(
            item_seleccionado.id,
            response => {
                this.setState({item_seleccionado: response, mostrar_form: true})
            },
            error_callback
        );
    }

    cargarDatos() {
        this.props.fetchTasasHorasHombres();
        this.props.fetchColaboradoresGestionHorasTrabajadas();
        this.props.fetchMisPermisos();
    }

    render() {
        const {busqueda, item_seleccionado, mostrar_form} = this.state;
        const {
            lista_objetos,
            mis_permisos,
            colaboradores
        } = this.props;

        if (!mis_permisos) {
            return (<div>Cargando...</div>)
        }
        else if (!tengoPermiso(mis_permisos, 'list_tasas_horas_hombres')) {
            return (<div>No tiene suficientes permisos.</div>)
        }

        let items_tabla_list = lista_objetos;
        if (!busqueda.toUpperCase().includes('TODO')) {
            items_tabla_list = _.pickBy(lista_objetos, objeto => {
                return (
                    objeto.mes.toString().toUpperCase().includes(busqueda.toUpperCase()) ||
                    objeto.colaborador_nombre.toUpperCase().includes(busqueda.toUpperCase()) ||
                    objeto.ano.toString().toUpperCase().includes(busqueda.toUpperCase()) ||
                    `${objeto.ano.toString()}${objeto.mes.toString()}`.toString().toUpperCase().includes(busqueda.toUpperCase()) ||
                    `${objeto.ano.toString()}${objeto.mes.toString()}${objeto.colaborador_nombre}`.toString().toUpperCase().includes(busqueda.toUpperCase()) ||
                    `${objeto.ano.toString()}${objeto.colaborador_nombre}`.toString().toUpperCase().includes(busqueda.toUpperCase())
                )
            });
        }
        return (
            <div className="row">
                <div className="col-12">
                    <h3 className="h3-responsive">Tasas Horas Hombres</h3>
                    {
                        tengoPermiso(mis_permisos, 'add_tasahora') &&
                        <button
                            className="btn btn-primary"
                            style={{cursor: "pointer"}}
                            onClick={() => {
                                this.setState({item_seleccionado: null, mostrar_form: true})
                            }}
                        >
                            <i className="fas fa-plus"
                               aria-hidden="true"></i>
                        </button>
                    }
                </div>
                <div className="col-12">
                    <TextField
                        floatingLabelText="A buscar"
                        fullWidth={true}
                        onChange={e => {
                            this.setState({busqueda: e.target.value});
                        }}
                        autoComplete="off"
                        value={busqueda}
                    />
                </div>
                {
                    mostrar_form &&
                    (
                        tengoPermiso(mis_permisos, 'add_tasahora') ||
                        tengoPermiso(mis_permisos, 'change_tasahora')
                    ) &&
                    <div className="col-12 pl-3">
                        <TasaHoraHombreForm
                            onSubmit={this.onSubmit.bind(this)}
                            item_seleccionado={item_seleccionado}
                            onCancel={this.onCancel.bind(this)}
                            onDelete={this.onDelete.bind(this)}
                            colaboradores={colaboradores}
                            can_delete={tengoPermiso(mis_permisos, 'delete_tasahora')}
                        />
                    </div>
                }
                <div className="col-12">
                    <h5>Tasas Horas Hombres</h5>
                    <TablaTasaHoraHombres
                        lista={items_tabla_list}
                        can_change={tengoPermiso(mis_permisos, 'change_tasahora')}
                        item_seleccionado={item_seleccionado}
                        onSelectItem={this.onSelectItem.bind(this)}
                    />
                </div>
                <CargarDatos cargarDatos={this.cargarDatos.bind(this)}/>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        lista_objetos: state.tasas_horas_hombres,
        colaboradores: state.colaboradores,
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(TasaHoraHombreLista);