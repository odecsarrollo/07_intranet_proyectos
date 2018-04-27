import React, {Fragment} from 'react';
import Form from './forms/proyecto_edit_form';

const FormEditProyecto = (props) => {
    return (
        <Fragment>
            <Form
                {...props}
            />
        </Fragment>
    )
};

export default FormEditProyecto;