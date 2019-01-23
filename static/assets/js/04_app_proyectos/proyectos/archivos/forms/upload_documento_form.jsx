import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyFieldFileInput} from '../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {FlatIconModal} from '../../../../00_utilities/components/ui/icon/iconos_base';
import validate from './validate';

class Form extends Component {
    render() {
        const {
            handleSubmit,
            onSubmit,
            submitting,
            pristine,
            initialValues,
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
                        <MyFieldFileInput name="archivo" className='col-12'/>
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
        initialValues: item_seleccionado
    }
}

Form = reduxForm({
    form: "uploadArchivoForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;