import React from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';

const BotoneriaModalForm = (props) => {
    const {
        submit_text_boton = null,
        pristine,
        submitting,
        reset,
        initialValues = null,
        onCancel = null,
        mostrar_submit = true,
        mostrar_limpiar = true
    } = props;
    return (
        <div>
            {mostrar_submit && <Button
                    color="primary"
                    variant="contained"
                    type='submit'
                    className='ml-3'
                    disabled={submitting || pristine}
                >
                    {submit_text_boton ? submit_text_boton : initialValues ? 'Guardar ' : 'Crear '}
                </Button>}
            {mostrar_limpiar && <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={reset}
                disabled={submitting || pristine}
            >
                Limpiar
            </Button>}
            {onCancel && <Button
                color="secondary"
                variant="contained"
                className='ml-3'
                onClick={() => onCancel()}
            >
                {submitting || pristine ? 'Cerrar' : 'Cancelar'}
            </Button>}
        </div>
    )
};


BotoneriaModalForm.propTypes = {
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    reset: PropTypes.func,
    initialValues: PropTypes.any,
    onCancel: PropTypes.func
};
export default BotoneriaModalForm;