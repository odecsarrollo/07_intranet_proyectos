import React, {memo, useEffect, useState, Fragment} from 'react';
import * as actions from '../../../../01_actions/01_index';
import {useDispatch, useSelector} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {MyCombobox, MyTextFieldSimple} from '../../../../00_utilities/components/ui/forms/fields';
import validate from './validate_crear_cotizacion';
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import CrearUbicacionForm from './CrearUbicacionForm';
import CrearContactoForm from './CrearContactoForm';

const selector = formValueSelector('cotizacionComponentesForm');

let CotizacionCRUDFormDialog = memo(props => {
    const dispatch = useDispatch();
    const {
        pristine,
        submitting,
        reset,
        initialValues,
        onSubmit,
        onCancel,
        handleSubmit,
        modal_open,
        singular_name
    } = props;

    const [crear_contacto, setCrearContacto] = useState(false);
    const [crear_ubicacion, setCrearUbicacion] = useState(false);
    const myValues = useSelector(state => selector(state, 'cliente', ''));
    const {cliente} = myValues;
    useEffect(() => {
        const cargarContactosClientes = () => dispatch(actions.fetchContactosClientes());
        const cargarCiudades = () => dispatch(actions.fetchCiudades({callback: cargarContactosClientes}));
        dispatch(actions.fetchClientes({callback: cargarCiudades}));
        return () => {
            dispatch(actions.clearContactosClientes());
            dispatch(actions.clearCiudades());
            dispatch(actions.clearClientes());
        }
    }, []);
    const ciudades = useSelector(state => state.geografia_ciudades);
    const clientes = useSelector(state => state.clientes);
    const clientes_contactos = useSelector(state => state.clientes_contactos);
    const onSubmitCiudad = (v) => dispatch(
        actions.createCiudadCotizacion(
            v,
            {
                callback: (res) => {
                    setCrearUbicacion(false);
                    props.change('ciudad', res.id);
                }
            })
    );
    const onSubmitContacto = (v) =>
        dispatch(actions.createContactoClienteCotizacionComponentes(v, {
            callback: (res) => dispatch(
                actions.fetchCliente(
                    res.cliente,
                    {
                        callback: () => {
                            props.change('contacto', res.id);
                            setCrearContacto(false);
                        }
                    }
                )
            )
        }));
    return (
        <Fragment>
            {crear_ubicacion && <CrearUbicacionForm
                modal_open={crear_ubicacion}
                onCancel={() => setCrearUbicacion(false)}
                onSubmit={onSubmitCiudad}
                singular_name='Ubicación'
            />}
            {crear_contacto && <CrearContactoForm
                initialValues={{cliente}}
                modal_open={crear_contacto}
                onCancel={() => setCrearContacto(false)}
                onSubmit={onSubmitContacto}
                singular_name='Contacto'
                clientes={clientes}
            />}
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit(onSubmit)}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyCombobox
                    label='Moneda'
                    className="col-12"
                    name='moneda'
                    busy={false}
                    autoFocus={false}
                    data={[
                        {'name': 'COP', 'id': 'COP'},
                        {'name': 'USD', 'id': 'USD'}
                    ]}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Seleccione Moneda...'
                />
                <MyCombobox
                    label='Cliente'
                    className="col-12"
                    name='cliente'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(clientes, ['nombre'], ['asc']), e => {
                        return {
                            'name': e.nombre,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Cliente'
                />
                <MyTextFieldSimple
                    multiline
                    rows={4}
                    className='col-12'
                    name='observaciones'
                    nombre='Observaciones'
                />
                <MyCombobox
                    label='Contacto'
                    className="col-12"
                    name='contacto'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(_.pickBy(clientes_contactos, c => c.cliente === cliente), ['nombres', 'apellidos'], ['asc', 'asc']), e => {
                        return {
                            'name': `${e.nombres} ${e.apellidos}`,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Contacto'
                />
                <div className="col-12 text-right">
                    <span className='puntero' onClick={() => setCrearContacto(true)}>Crear Contacto...</span>
                </div>
                <MyCombobox
                    label='Ciudad'
                    className="col-12"
                    name='ciudad'
                    busy={false}
                    autoFocus={false}
                    data={_.map(_.orderBy(ciudades, ['nombre'], ['asc']), e => {
                        return {
                            'name': `${e.nombre} - ${e.departamento_nombre} - ${e.pais_nombre}`,
                            'id': e.id
                        }
                    })}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Ciudad'
                />
                <div className="col-12 text-right">
                    <span className='puntero' onClick={() => setCrearUbicacion(true)}>Crear Ciudad...</span>
                </div>
            </MyFormTagModal>
        </Fragment>
    )
});

CotizacionCRUDFormDialog = reduxForm({
    form: "cotizacionComponentesForm",
    validate: validate,
    enableReinitialize: true
})(CotizacionCRUDFormDialog);

export default CotizacionCRUDFormDialog;