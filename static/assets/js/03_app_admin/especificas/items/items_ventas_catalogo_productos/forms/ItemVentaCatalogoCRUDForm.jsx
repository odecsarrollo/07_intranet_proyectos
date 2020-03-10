import React, {memo, useEffect} from 'react';
import {reduxForm} from 'redux-form';
import * as actions from '../../../../../01_actions/01_index';
import {
    MyTextFieldSimple,
    MyCheckboxSimple,
    MyCombobox
} from '../../../../../00_utilities/components/ui/forms/fields';
import {useDispatch, useSelector} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';

let Form = memo(props => {
    const dispatch = useDispatch();
    const margenes_proveedores = useSelector(state => state.margenes_proveedores);
    const proveedores_importaciones = useSelector(state => state.proveedores_importaciones);
    const unidades_medida = useSelector(state => state.unidades_medidas);
    useEffect(() => {
        const cargarUnidadesMedidas = () => {
            if (!initialValues || (initialValues && initialValues.origen === 'LP_INTRANET')) {
                dispatch(actions.fetchUnidadesMedidasCatalogos())
            }
        };
        const cargarProveedores = () => dispatch(actions.fetchProveedoresImportaciones({callback: cargarUnidadesMedidas}));
        dispatch(actions.fetchMargenesProvedores({callback: cargarProveedores}));
        return () => {
            dispatch(actions.clearUnidadesMedidasCatalogos());
            dispatch(actions.clearMargenesProvedores());
            dispatch(actions.clearProveedoresImportaciones());
        }
    }, []);
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
    const editable = initialValues ? initialValues.origen !== 'SIS_INF' : true;
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
                className="col-12"
                nombre='Nombre'
                name='nombre_catalogo'
                disabled={!editable}
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-5 pl-2"
                disabled={!editable}
                nombre='Referencia'
                name='referencia_catalogo'
                case='U'/>
            <MyTextFieldSimple
                className="col-12 col-md-4 pl-2"
                disabled={!editable}
                nombre='U.M'
                name='unidad_medida_catalogo'
                case='U'/>
            <MyTextFieldSimple
                disabled={!editable}
                className="col-12 col-md-3 pl-2"
                nombre='Costo'
                name='costo_catalogo'
                case='U'/>
            <MyCombobox
                data={_.map(unidades_medida, u => {
                    return (
                        {
                            name: `${u.to_string}`,
                            id: u.id
                        }
                    )
                })}
                name='unidad_medida_en_inventario'
                readOnly={!editable}
                textField='name'
                valuesField='id'
                className='col-12'
                placeholder='Unidad de Medida en Inventario'
                filter='contains'
            />
            <MyCombobox
                data={_.map(proveedores_importaciones, u => {
                    return (
                        {
                            name: `${u.to_string}`,
                            id: u.id
                        }
                    )
                })}
                name='proveedor_importacion'
                textField='name'
                valuesField='id'
                className='col-12'
                placeholder='Proveedor'
                filter='contains'
            />
            <MyCombobox
                data={_.map(margenes_proveedores, u => {
                    return (
                        {
                            name: `${u.to_string}`,
                            id: u.id
                        }
                    )
                })}
                name='margen'
                textField='name'
                valuesField='id'
                className='col-12'
                placeholder='Margen'
                filter='contains'
            />
            <MyCheckboxSimple
                className='col-12'
                label='Activo'
                name='activo'
            />
            {
                initialValues &&
                <div className="col-12">
                    Procedencia: {initialValues.origen}
                </div>
            }
        </MyFormTagModal>
    )
});

Form = reduxForm({
    form: "itemVentaCatalogoForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;