import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import {MyCombobox, MyTextFieldSimple} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues,
            onSubmit,
            onCancel,
            handleSubmit,
            modal_open,
            singular_name,
            tipos,
            materiales,
            colores,
            series,
            categorias_dos,
            categorias
        } = this.props;
        return (
            <MyFormTagModal
                onCancel={onCancel}
                fullScreen={false}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyTextFieldSimple
                    className="col-6"
                    nombre='Referencia'
                    name='referencia'
                    case='U'
                />
                <MyCombobox
                    className="col-6"
                    name='serie'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(series, ['nombre'], ['asc']), e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Serie'
                />
                <MyCombobox
                    className="col-6"
                    name='tipo_banda'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(tipos, ['nombre'], ['asc']), e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Tipo Banda'
                />
                <MyCombobox
                    className="col-6"
                    name='material'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(materiales, ['nombre'], ['asc']), e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Material'
                />
                <MyCombobox
                    className="col-6"
                    name='categoria'
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
                    placeholder='Categoría'
                />
                <MyCombobox
                    className="col-6"
                    name='color'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(colores, ['nombre'], ['asc']), e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Color'
                />
                <MyCombobox
                    className="col-6"
                    name='categoria'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(categorias_dos, ['nombre'], ['asc']), e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Categoria'
                />
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Largo'
                    name='largo'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Ancho'
                    name='ancho'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Alto'
                    name='alto'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Diametro Varilla'
                    name='diametro_varilla'
                    type='number'/>
                <MyTextFieldSimple
                    className="col-12"
                    nombre='Costo'
                    name='costo'
                    type='number'/>
            </MyFormTagModal>
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
    form: "componenteForm",
    validate,
    enableReinitialize: true
})(Form);

export default (connect(mapPropsToState, null)(Form));