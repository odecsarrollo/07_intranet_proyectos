import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyTextFieldSimple,
    MyFieldFileInput,
    MyCombobox
} from '../../../../00_utilities/components/ui/forms/fields';
import Button from '@material-ui/core/Button';
import validate from './validate';

let Form = memo(props => {
    const {
        handleSubmit,
        onSubmit,
        submitting,
        pristine,
        tiene_tipo = false,
        tipos_list,
        initialValues
    } = props;
    const onChangeFile = (f, v) => {
        const archivo = v[0];
        const nombre_archivo = archivo.name.split('.')[0];
        props.change('nombre_archivo', nombre_archivo.toUpperCase());
    };
    return (
        <form onSubmit={handleSubmit((v) => onSubmit(v))}>
            <div className="row">
                {tiene_tipo && tipos_list &&
                <MyCombobox
                    label_space_xs={3}
                    className='col-12 col-md-6'
                    name='tipo'
                    label='Tipo'
                    busy={false}
                    autoFocus={false}
                    data={tipos_list}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Seleccionar Tipo...'
                />}
                <MyTextFieldSimple
                    className="col-11 col-md-7"
                    nombre='Nombre'
                    name='nombre_archivo'
                    case='U'/>
                {
                    !initialValues &&
                    <MyFieldFileInput
                        name="archivo"
                        className='col-12'
                        onChange={onChangeFile}
                    />
                }
            </div>
            <Button
                color="primary"
                variant="contained"
                type='submit'
                disabled={submitting || pristine}
            >
                Guardar
            </Button>
        </form>
    )
});

Form = reduxForm({
    form: "uploadArchivoForm",
    validate,
    enableReinitialize: true
})(Form);


export default Form;