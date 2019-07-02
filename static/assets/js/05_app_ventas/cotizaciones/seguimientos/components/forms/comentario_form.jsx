import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';
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
                        multiline={true}
                        rows={2}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                        disabled={submitting || pristine}
                    >
                        Comentar
                    </Button>
                </div>
            </form>
        )
    }
}


Form = reduxForm({
    form: "comentarioForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;