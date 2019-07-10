import React, {Component, Fragment} from 'react';
import ReactFileReader from 'react-file-reader';
import Button from "@material-ui/core/Button";
import ErrorsFile from './errorFile';
import PropTypes from "prop-types";
import TipoDato from './tiposDatos';

class UploadFile extends Component {

    constructor(props) {
        super(props);
        const {objectCabecera} = this.props;
        this.state = {
            cabecera: this.extraerCabeceras(objectCabecera),
            listado_cargue: [],
            error_columnas: null,
            total_items: 0,
            archivo: null,
            is_open: false,
            errors: []
        };
        this.validarTipoDato = this.validarTipoDato.bind(this);
        this.inputFileChanged = this.inputFileChanged.bind(this);
        this.onCargarListado = this.onCargarListado.bind(this);
        this.extraerCabeceras = this.extraerCabeceras.bind(this);
        this.validarItemCarge = this.validarItemCarge.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.subirListado = this.subirListado.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.validaListado = this.validaListado.bind(this);

        this.STRING_ERROR = {
            campo_obligatorio : ' _ERROR_CAMPO_OBLIGATORIO',
            campo_unico : ' _ERROR_CAMPO_UNICO',
            campo_choice : '_ERROR_CHOICE_NO_EXISTE',
            TIPO_DATO: {
                string : '_ERROR_TYPE_STRING',
                int : '_ERROR_TYPE_NUMBER'
            }
        }
    }

    extraerCabeceras(objectCabecera) {
        return _.map(objectCabecera, item => item.campo);
    }

    validarTipoDato(value, tipo) {
        let response = {valido: true, error: ''};
        switch (tipo) {
            case TipoDato.string():
                if (!(typeof value === TipoDato.string())) {
                    return {...response, valido: false, error: this.STRING_ERROR.TIPO_DATO.string};
                }
                break;
            case TipoDato.int():
                value = parseInt(value);
                if (!/^([0-9])*$/.test(value)) {
                    return {...response, valido: false, error: this.STRING_ERROR.TIPO_DATO.int};
                }
                break;
            default:
                break;
        }
        return response;
    }

    validarItemCarge(item, listado_cargue) {
        const {objectCabecera} = this.props;
        const cabeceras = this.extraerCabeceras(objectCabecera);
        const cabeceras_obligatorias = this.extraerCabeceras(_.pickBy(objectCabecera, o => !o.null));
        const cabeceras_campos_unicos = this.extraerCabeceras(_.pickBy(objectCabecera, o => o.unique));
        let error_string = '';
        let objeto = {...item, errores: []};
        _.mapKeys(item, (value, key) => {
            //(key !== "index") && (key !== "es_valido") && (key !== "errores")
            if (cabeceras.includes(key)) {
                const cabecera = objectCabecera.filter(e => e.campo === key)[0];
                const cabecera_obligatoria = cabeceras_obligatorias.includes(key);
                const campo_unico = cabeceras_campos_unicos.includes(key);
                const tipo_dato = this.validarTipoDato(value, cabecera.tipo);
                if (cabecera_obligatoria) {
                    if (value === '') {
                        error_string = `${key} : ${this.STRING_ERROR.campo_obligatorio}`;
                        objeto = {...objeto, [key]: '', errores: [...objeto.errores, error_string]};
                    }
                }
                if (!tipo_dato.valido) {
                    error_string = `${key} : ${tipo_dato.error}`;
                    objeto = {...objeto, [key]: '', errores: [...objeto.errores, error_string]};
                }
                if (campo_unico) {
                    const repetidos = listado_cargue.filter(e => e[key] === value);
                    if (repetidos.length > 1) {
                        error_string = `${key} : ${this.STRING_ERROR.campo_unico}`;
                        objeto = {...objeto, errores: [...objeto.errores, error_string]};
                    }
                }
                if (cabecera.choices) {
                    const choicesId = _.map(cabecera.choices, e => e.id);
                    if (!choicesId.includes(parseInt(value)) || value === '') {
                        error_string = `${key} : ${this.STRING_ERROR.campo_choice}`;
                        objeto = {...objeto, errores: [...objeto.errores, error_string]};
                    }
                }
            }
        });
        if (objeto.errores.length > 0) {
            return {...objeto, es_valido: false};
        } else {
            return {...objeto, es_valido: true}
        }
    }

    inputFileChanged(files) {
        const reader = new FileReader();
        const scope = this;
        this.setState({archivo: files[0]});
        reader.onload = () => {
            const {cabecera} = this.state;
            const separado_lineas = reader.result.split('\n');
            const cabecera_archivo = _.split(separado_lineas[0], ';').map(e => _.trim(e));
            const columnas_iguales = _.isEqual(cabecera_archivo, cabecera);
            scope.setState({error_columnas: columnas_iguales ? null : true});
            if (columnas_iguales) {
                let resultado = _.map(separado_lineas, e => {
                    const lineas = _.split(_.deburr(e), ';');
                    let objeto = {};
                    cabecera.map(c => {
                        const index = _.indexOf(cabecera, c);
                        objeto = {...objeto, [c]: _.trim(lineas[index])}
                    });
                    return objeto
                });
                scope.onCargarListado(resultado)
            }
        };
        reader.readAsText(files[0]);
    }

    onCargarListado(listado_cargue) {
        let lc = listado_cargue;
        let index = 1;
        _.remove(lc, e => {
            let index = lc.indexOf(e);
            return index === 0 || index === (lc.length - 1);
        });
        lc = _.map(lc, e => {
            e = {...e, index: index};
            e = {...this.validarItemCarge(e, lc)};
            index++;
            return e;
        });

        const cargue_valido = lc.filter(e => e.es_valido);
        const cargue_invalido = lc.filter(e => !e.es_valido);
        if (cargue_invalido.length > 0) {
            this.setState({
                is_open: true,
                errors: cargue_invalido,
                para_subir: cargue_valido,
                listado_cargue: lc,
            });
        } else if (cargue_valido.length > 0) {
            this.subirListado();
        }
    }


    subirListado() {
        const {listado_cargue} = this.state;
        let data = listado_cargue.filter(x => x.es_valido);
        //this.props.createLoadeableFile(data);
        this.setState({
            is_open: false
        });
    }

    changeValue(event) {
        const {listado_cargue, errors} = this.state;
        const index = parseInt(event.target.id);
        let lc = this.validaListado(event, {...listado_cargue}, index, listado_cargue);
        let err = this.validaListado(event, {...errors}, index, lc);
        this.setState({
            listado_cargue: lc,
            errors: err
        });
    }

    validaListado(event, lista, index, listado_cargue) {
        return _.map(lista, e => {
            if (e.index === index) {
                e = {...e, [event.target.name]: event.target.value};
            }
            e = {...this.validarItemCarge(e, listado_cargue)};
            return e;
        });
    }


    handleCloseModal() {
        this.setState({
            is_open: false
        });
    }

    render() {
        const {archivo, is_open, errors, listado_cargue} = this.state;
        const {objectCabecera} = this.props;
        return (
            <Fragment>
                {is_open &&
                <ErrorsFile
                    is_open={is_open}
                    errors_file={errors}
                    objectCabecera={objectCabecera}
                    total_items={listado_cargue.length}
                    handleCloseModal={this.handleCloseModal}
                    change_values={this.changeValue}
                    subirListado={this.subirListado}
                />
                }
                <ReactFileReader
                    handleFiles={files => {
                        this.inputFileChanged(files);
                    }} fileTypes='.csv'>
                    <Fragment>
                        <Button color='primary' ref="input_reader">Archivo de Cargue</Button>
                        {
                            archivo &&
                            <div style={{fontSize: '0.8rem'}}>
                                <strong>Nombre Archivo: </strong>{archivo.name}<br/>
                                <strong>Tamaño: </strong>{archivo.size / 1000} kb
                            </div>
                        }
                    </Fragment>
                </ReactFileReader>
            </Fragment>
        )
    }
}

UploadFile.propTypes = {
    objectCabecera: PropTypes.any,
    createLoadeableFile: PropTypes.any
};

export default UploadFile;