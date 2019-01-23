import React, {Component} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {MyTextFieldSimple, MyFieldFileInput} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {FlatIconModal} from '../../../../00_utilities/components/ui/icon/iconos_base';
import validate from './validate';

const selector = formValueSelector('uploadArchivoForm');

class Form extends Component {
    constructor(props) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    onChangeFile(f, v) {
        const archivo = v[0];
        const nombre_archivo = archivo.name.split('.')[0];
        this.props.change('nombre_archivo', nombre_archivo.toUpperCase());
    }

    render() {
        const {
            handleSubmit,
            onSubmit,
            submitting,
            pristine,
            initialValues
        } = this.props;
        return (
            <form onSubmit={handleSubmit((v) => onSubmit(v))}>
                <div className="row">
                    <MyTextFieldSimple
                        className="col-11"
                        nombre='Nombre'
                        name='nombre_archivo'
                        case='U'/>
                    {
                        !initialValues &&
                        <MyFieldFileInput
                            name="archivo"
                            className='col-12'
                            onChange={this.onChangeFile}
                        />
                    }
                </div>
                <FlatIconModal
                    text='Guardar'
                    primary={true}
                    disabled={submitting || pristine}
                    type='submit'
                />
            </form>
        )
    }
}

function mapPropsToState(state, ownProps) {
    const {item_seleccionado} = ownProps;
    return {
        initialValues: item_seleccionado,
        valores: selector(state, 'archivo', 'nombre_archivo'),
    }
}

Form = reduxForm({
    form: "uploadArchivoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;