import React, {useEffect, memo} from 'react';
import {reduxForm, formValueSelector} from 'redux-form';
import {useDispatch, useSelector} from "react-redux";
import validate from '../../tuberia_ventas/forms/validate';
import FormBaseCotizacion from './CotizacionFormBase';
import BotoneriaModalForm from '../../../../00_utilities/components/ui/forms/botoneria_modal_form';
import {MyCombobox} from '../../../../00_utilities/components/ui/forms/fields';
import * as actions from '../../../../01_actions/01_index';

const selector = formValueSelector('cotizacionEditForm');

let Form = memo(props => {
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        handleSubmit,
        permisos = null,
    } = props;
    const dispatch = useDispatch();
    const myValues = useSelector(state => selector(state, 'estado', 'valor_ofertado', 'cliente', 'unidad_negocio', 'cotizacion_inicial'));
    const usuarios_list = useSelector(state => state.usuarios);

    useEffect(() => {
        const fetchUsuarioxPermiso = () => dispatch(actions.fetchUsuariosxPermiso('gestionar_cotizacion'));
        dispatch(actions.fetchUsuario(initialValues.responsable, {callback: fetchUsuarioxPermiso}));
        return () => dispatch(actions.clearUsuarios());
    }, []);

    return (
        <form className="card" onSubmit={handleSubmit((v) => onSubmit({
            ...v,
            cotizacion_inicial: v.cotizacion_inicial ? v.cotizacion_inicial.id : null
        }))}>
            <div className="row pl-3 pr-5">
                <FormBaseCotizacion
                    item={initialValues}
                    myValues={myValues}
                    permisos={permisos}
                />
                {
                    _.size(usuarios_list) > 0 &&
                    <MyCombobox
                        data={_.map(usuarios_list, u => {
                            return (
                                {
                                    name: `${u.first_name} ${u.last_name}`,
                                    id: u.id
                                }
                            )
                        })}
                        label_space_xs={3}
                        label='Responsable Cotización'
                        name='responsable'
                        textField='name'
                        valuesField='id'
                        className='col-12'
                        placeholder='Responsable'
                        filter='contains'
                    />
                }
            </div>
            <BotoneriaModalForm
                conCerrar={false}
                mostrar_cancelar={false}
                pristine={pristine}
                reset={reset}
                submitting={submitting}
                initialValues={initialValues}
            />
        </form>
    )


});


Form = reduxForm({
    form: "cotizacionEditForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;