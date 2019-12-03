import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import validate from './validate';
import {MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        handleSubmit,
        onSubmit
    } = props;
    return (
        <form className='p-4' onSubmit={handleSubmit(v => onSubmit(v))}>
            <div className="row">
                <MyTextFieldSimple
                    className="col-3"
                    nombre='Año'
                    name='ano'
                />
                <MyTextFieldSimple
                    className="col-3 ml-2"
                    nombre='Mes'
                    name='mes'
                />
                <div className="cal-6">
                    <Button
                        color="primary"
                        variant="contained"
                        type='submit'
                        className='ml-3'
                        disabled={submitting || pristine}
                    >
                        Generar
                    </Button>

                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={reset}
                        className='ml-3'
                        disabled={submitting || pristine}
                    >
                        Limpiar
                    </Button>
                </div>
            </div>
        </form>
    )

});


Form = reduxForm({
    form: "tuberiaVentasForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;