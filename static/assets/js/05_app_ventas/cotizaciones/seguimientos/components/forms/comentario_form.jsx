import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple, MyDropdownList} from '../../../../../00_utilities/components/ui/forms/fields';
import FlatButton from 'material-ui/FlatButton';
import {connect} from "react-redux";
import validate from './validate';


class Form extends Component {
    render() {
        const {
            pristine,
            submitting,
            onSubmit,
            reset,
            handleSubmit
        } = this.props;
        return (
            <form onSubmit={handleSubmit((v) => {
                onSubmit(v);
                reset();
            })}>
                <div className="row pl-3 pr-5">
                    <MyTextFieldSimple
                        className="col-12"
                        nombre='Comentario'
                        name='observacion'
                        multiLine={true}
                        rows={2}
                    />
                    <FlatButton
                        label='Comentar'
                        primary={true}
                        type='submit'
                        disabled={submitting || pristine}
                    />
                </div>
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
    form: "comentarioForm",
    validate,
    enableReinitialize: true
})(Form);

Form = (connect(mapPropsToState, null)(Form));

export default Form;