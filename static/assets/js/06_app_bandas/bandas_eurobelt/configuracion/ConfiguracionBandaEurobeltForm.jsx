import React, {memo} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox} from '../../../00_utilities/components/ui/forms/fields';
import validate from './validate';
import BotoneriaModalForm from "../../../00_utilities/components/ui/forms/botoneria_modal_form";
import Typography from "@material-ui/core/Typography";

let Form = memo(props => {
    const {
        handleSubmit,
        pristine,
        submitting,
        reset,
        initialValues,
        categorias,
        proveedores,
        onSubmit
    } = props;
    return (
        <div className="col-12">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-12">
                        <Typography variant="body1" gutterBottom color="primary">
                            Categorías
                        </Typography>
                    </div>
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria_aleta'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría Aleta'
                    />
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria_empujador'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría Empujador'
                    />
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria_varilla'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría Varilla'
                    />
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria_banda'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría Banda'
                    />
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria_tapa'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría Tapa'
                    />
                    <MyCombobox
                        className="col-6 col-md-4"
                        name='categoria_modulo'
                        busy={false}
                        autoFocus={false}
                        data={_.map(_.orderBy(categorias, ['nombre'], ['asc']), e => {
                            return {
                                'name': e.nombre,
                                'id': e.id
                            }
                        })}
                        textField='name'
                        filter='contains'
                        valuesField='id'
                        placeholder='Categoría Módulo'
                    />
                    <div className="col-12 mt-4">
                        <Typography variant="body1" gutterBottom color="primary">
                            Fabricante
                        </Typography>
                    </div>
                    <div className="col-12">
                        <MyCombobox
                            className="col-6 col-md-4"
                            name='fabricante'
                            busy={false}
                            autoFocus={false}
                            data={_.map(_.orderBy(proveedores, ['nombre'], ['asc']), e => {
                                return {
                                    'name': e.nombre,
                                    'id': e.id
                                }
                            })}
                            textField='name'
                            filter='contains'
                            valuesField='id'
                            placeholder='Fabricante'
                        />
                    </div>
                </div>
                <BotoneriaModalForm
                    mostrar_submit={true}
                    mostrar_limpiar={true}
                    mostrar_cancelar={false}
                    pristine={pristine}
                    reset={reset}
                    submitting={submitting}
                    initialValues={initialValues}
                />
            </form>
        </div>
    )
});


Form = reduxForm({
    form: "configuracionBandasEurobelForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;