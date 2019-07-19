import React, {memo} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {MyTextFieldSimple, MyFieldFileInput} from '../../../../00_utilities/components/ui/forms/fields';
import {useSelector} from "react-redux";
import Button from '@material-ui/core/Button';

const selector = formValueSelector('uploadArchivoForm');

let CobroDetailDocumentoUploadForm = memo(props => {
    const valores = useSelector(state => selector(state, 'archivo', 'nombre_archivo'));
    const onChangeFile = (f, v) => {
        const archivo = v[0];
        const nombre_archivo = archivo.name.split('.')[0];
        props.change('nombre_archivo', nombre_archivo.toUpperCase());
    };

    const {
        handleSubmit,
        onSubmit,
        submitting,
        pristine,
        initialValues
    } = props;
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

CobroDetailDocumentoUploadForm = reduxForm({
    form: "uploadArchivoForm",
    enableReinitialize: true
})(CobroDetailDocumentoUploadForm);


export default CobroDetailDocumentoUploadForm;