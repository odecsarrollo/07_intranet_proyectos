import React, {Component} from 'react';
import * as actions from "../../../../01_actions/01_index";
import {connect} from "react-redux";
import UploadDocumentoForm from '../forms/upload_documento_form';
import ArchivosList from '../components/archivos_list';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
        this.props.fetchArchivosLiterales_x_literal(id_literal)
    }

    onSelectArchivo(item_seleccionado) {
        this.setState({item_seleccionado, adicionar_documento: true})
    }

    onDeleteArchivo(archivo_id) {
        const {id_literal} = this.props;
        this.props.deleteArchivoLiteral(
            archivo_id,
            {callback: () => this.props.fetchArchivosLiterales_x_literal(id_literal)}
        )
    }

    onUploadArchivo(e) {
        const {id_literal, notificarAction} = this.props;
        const file = e.archivo[0];
        if (file) {
            let formData = new FormData();
            formData.append('archivo', file);
            formData.append('nombre', e.nombre_archivo);
            this.props.uploadArchivoLiteral(
                id_literal,
                formData,
                {
                    callback:
                        () => {
                            this.props.fetchArchivosLiterales_x_literal(
                                id_literal,
                                {
                                    callback:
                                        () => {
                                            notificarAction(`La ha subido el archivo para el literal`);
                                            this.setState({adicionar_documento: false});
                                        }
                                }
                            )
                        }
                }
            )
        }
    }

    onSubmitUploadArchivo(valores) {
        const {id} = valores;
        if (id) {
            delete valores.archivo;
            this.props.updateArchivoLiteral(
                id,
                valores,
                {
                    callback:
                        () => {
                            this.setState({adicionar_documento: false});
                        }
                }
            )
        } else {
            this.onUploadArchivo(valores);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id_literal !== nextProps.id_literal) {
            this.cargarDatos(nextProps.id_literal);
        }
    }

    render() {
        const {archivos_literal, permisos} = this.props;
        const {adicionar_documento, item_seleccionado} = this.state;
        return (
            <div>
                {
                    permisos.add &&
                    <FontAwesomeIcon
                        className='puntero'
                        icon={`${adicionar_documento ? 'minus' : 'plus'}-circle`}
                        onClick={() => this.setState((s) => ({
                            adicionar_documento: !s.adicionar_documento,
                            item_seleccionado: null
                        }))}
                    />
                }
                {
                    adicionar_documento &&
                    <UploadDocumentoForm
                        onSubmit={this.onSubmitUploadArchivo}
                        item_seleccionado={item_seleccionado}
                    />
                }
                <ArchivosList
                    lista={archivos_literal}
                    permisos={permisos}
                    onDeleteArchivo={this.onDeleteArchivo}
                    onSelectElemento={this.onSelectArchivo}
                />
            </div>
        )
    }
}

function mapPropsToState(state) {
    return {
        archivos_literal: state.archivos_literales
    }
}

export default connect(mapPropsToState, actions)(PanelArchivosLiterales);