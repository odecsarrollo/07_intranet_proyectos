import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import UploadDocumentoForm from '../forms/upload_documento_form';
import ArchivosList from '../components/archivos_list';

class PanelArchivosLiterales extends Component {
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
        const {id_literal} = this.props;
        this.cargarDatos(id_literal);
    }

    cargarDatos(id_literal) {
        const {noCargando, cargando, notificarErrorAjaxAction, fetchArchivosLiterales_x_literal} = this.props;
        cargando();
        fetchArchivosLiterales_x_literal(id_literal, () => noCargando(), notificarErrorAjaxAction)
    }

    onSelectArchivo(item_seleccionado) {
        this.setState({item_seleccionado, adicionar_documento: true})
    }

    onDeleteArchivo(archivo_id) {
        const {
            notificarErrorAjaxAction,
            deleteArchivoLiteral,
            cargando,
            noCargando,
            id_literal,
            fetchArchivosLiterales_x_literal
        } = this.props;
        cargando();
        const success = () => {
            fetchArchivosLiterales_x_literal(id_literal, () => noCargando(), notificarErrorAjaxAction);
        };
        deleteArchivoLiteral(archivo_id, success, notificarErrorAjaxAction)
    }

    onUploadArchivo(e, callback = null) {
        const {notificarAction, notificarErrorAjaxAction, id_literal, cargando, noCargando, uploadArchivoLiteral} = this.props;
        cargando();
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            uploadArchivoLiteral(
                id_literal,
                formData,
                () => {
                    this.props.fetchArchivosLiterales_x_literal(
                        id_literal,
                        res => {
                            if (callback) {
                                callback(res);
                            }
                            notificarAction(`La ha subido el archivo para la prueba arreglar texto `);
                            noCargando();
                        }
                    )
                },
                notificarErrorAjaxAction
            )
        }
    }

    onSubmitUploadArchivo(valores) {
        const {noCargando, cargando, notificarErrorAjaxAction, updateArchivoLiteral} = this.props;
        const {id} = valores;
        cargando();
        if (id) {
            delete valores.archivo;
            updateArchivoLiteral(
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

    componentWillReceiveProps(nextProps) {
        if (this.props.id_literal !== nextProps.id_literal) {
            this.cargarDatos(nextProps.id_literal);
        }
    }

    render() {
        const {archivos_literal} = this.props;
        const {adicionar_documento, item_seleccionado} = this.state;
        return (
            <div>
                <i className={`fas fa-${adicionar_documento ? 'minus' : 'plus'}-circle puntero`}
                   onClick={() => this.setState((s) => ({
                       adicionar_documento: !s.adicionar_documento,
                       item_seleccionado: null
                   }))}>
                </i>
                {
                    adicionar_documento &&
                    <UploadDocumentoForm
                        onSubmit={this.onSubmitUploadArchivo}
                        item_seleccionado={item_seleccionado}
                    />
                }
                <ArchivosList
                    lista={archivos_literal}
                    onDeleteArchivo={this.onDeleteArchivo}
                    onSelectElemento={this.onSelectArchivo}
                />
            </div>
        )
    }
}

function mapPropsToState(state) {
    return {
        mis_permisos: state.mis_permisos,
        archivos_literal: state.archivos_literales
    }
}

export default connect(mapPropsToState, actions)(PanelArchivosLiterales);