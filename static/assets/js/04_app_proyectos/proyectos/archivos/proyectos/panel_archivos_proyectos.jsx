import React, {Component, Fragment} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import UploadDocumentoForm from '../forms/upload_documento_form';
import ArchivosList from '../components/archivos_list';
import {permisosAdapter} from "../../../../00_utilities/common";
import {
    ARCHIVOS_PROYECTOS as permisos_view,
} from "../../../../00_utilities/permisos/types";

class PanelArchivosProyectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            adicionar_documento: false,
            item_seleccionado: null,
        };
        this.onSubmitUploadArchivo = this.onSubmitUploadArchivo.bind(this);
        this.onDeleteArchivo = this.onDeleteArchivo.bind(this);
        this.onSelectArchivo = this.onSelectArchivo.bind(this);
    }

    componentDidMount() {
        this.cargarDatos();
    }

    cargarDatos() {
        const {
            noCargando,
            cargando,
            notificarErrorAjaxAction,
            fetchArchivosProyectos_x_proyecto,
            proyecto,
            fetchMisPermisos
        } = this.props;
        cargando();
        const cargarArchivosProyecto = () => fetchArchivosProyectos_x_proyecto(proyecto.id, () => noCargando(), notificarErrorAjaxAction)
        fetchMisPermisos(cargarArchivosProyecto, notificarErrorAjaxAction);
    }

    onSelectArchivo(item_seleccionado) {
        this.setState({item_seleccionado, adicionar_documento: true})
    }

    onDeleteArchivo(archivo_id) {
        const {
            notificarErrorAjaxAction,
            deleteArchivoProyecto,
            cargando,
            noCargando,
            proyecto,
            fetchArchivosProyectos_x_proyecto
        } = this.props;
        cargando();
        const success = () => {
            fetchArchivosProyectos_x_proyecto(proyecto.id, () => noCargando(), notificarErrorAjaxAction);
        };
        deleteArchivoProyecto(archivo_id, success, notificarErrorAjaxAction)
    }

    onUploadArchivo(e, callback = null) {
        const {notificarAction, notificarErrorAjaxAction, proyecto, cargando, noCargando, uploadArchivoProyecto} = this.props;
        cargando();
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            uploadArchivoProyecto(
                proyecto.id,
                formData,
                () => {
                    this.props.fetchArchivosProyectos_x_proyecto(
                        proyecto.id,
                        res => {
                            if (callback) {
                                callback(res);
                            }
                            notificarAction(`La ha subido el archivo para el proyecto `);
                            noCargando();
                        }
                    )
                },
                notificarErrorAjaxAction
            )
        }
    }

    onSubmitUploadArchivo(valores) {
        const {noCargando, cargando, notificarErrorAjaxAction, updateArchivoProyecto} = this.props;
        const {id} = valores;
        cargando();
        if (id) {
            delete valores.archivo;
            updateArchivoProyecto(
                id,
                valores,
                () => {
                    this.setState({adicionar_documento: false});
                    noCargando();
                },
                notificarErrorAjaxAction
            )
        } else {
            this.onUploadArchivo(
                valores,
                () => {
                    this.setState({adicionar_documento: false});
                    noCargando();
                }
            );
        }
    }

    render() {
        const {archivos_proyecto, mis_permisos} = this.props;
        const {adicionar_documento, item_seleccionado} = this.state;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        return (
            <Fragment>
                {
                    permisos.add &&
                    <i className={`fas fa-${adicionar_documento ? 'minus' : 'plus'}-circle puntero`}
                       onClick={() => this.setState((s) => ({
                           adicionar_documento: !s.adicionar_documento,
                           item_seleccionado: null
                       }))}>
                    </i>
                }
                {
                    adicionar_documento &&
                    <UploadDocumentoForm
                        onSubmit={this.onSubmitUploadArchivo}
                        item_seleccionado={item_seleccionado}
                    />
                }
                <ArchivosList
                    permisos={permisos}
                    lista={archivos_proyecto}
                    onDeleteArchivo={this.onDeleteArchivo}
                    onSelectElemento={this.onSelectArchivo}
                />
            </Fragment>
        )
    }
}

function mapPropsToState(state) {
    return {
        mis_permisos: state.mis_permisos,
        archivos_proyecto: state.archivos_proyecto
    }
}

export default connect(mapPropsToState, actions)(PanelArchivosProyectos);