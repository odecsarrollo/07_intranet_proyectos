import React, {memo, useState} from 'react';
import {formValueSelector, reduxForm} from 'redux-form';
import {connect, useSelector, useDispatch} from "react-redux";
import {MyFormTagModal} from '../../../../00_utilities/components/ui/forms/MyFormTagModal';
import DialogSeleccionar from "../../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import validate from './validate';
import BaseForm from './BaseProyectoForm';
import Typography from "@material-ui/core/Typography";
import * as actions from "../../../../01_actions/01_index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const selector = formValueSelector('proyectoCrearDesdeCotizacionModalForm');
let ProyectoCrearDesdeCotizacionModalForm = memo(props => {
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
        permisos_object,
        clientes_list,
    } = props;
    const dispatch = useDispatch();
    const myValues = useSelector(state => selector(state, 'nro_automatico', ''));
    const [open_relacionar, setOpenRelacionar] = useState(false);
    const relacionarQuitarProyecto = (proyecto_id) => {
        dispatch(actions.relacionarQuitarProyectoaCotizacion(initialValues.cotizacion, proyecto_id, {callback: onCancel}))
    };
    const buscarProyecto = (busqueda) => {
        dispatch(actions.fetchProyectosxParametro(busqueda));
    };
    let proyectos_list = useSelector(state => state.proyectos);
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit((v) => onSubmit({...v, cotizacion_relacionada_id: initialValues.cotizacion}))}
            reset={reset}
            initialValues={null}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {open_relacionar &&
            <DialogSeleccionar
                placeholder='Proyecto a buscar'
                id_text='id'
                selected_item_text='id_proyecto'
                onSearch={buscarProyecto}
                onSelect={relacionarQuitarProyecto}
                onCancelar={() => setOpenRelacionar(false)}
                onMount={() => dispatch(actions.clearProyectos())}
                onUnMount={() => dispatch(actions.fetchProyectosConsecutivo())}
                listado={_.map(proyectos_list)}
                open={open_relacionar}
                select_boton_text='Relacionar'
                titulo_modal={'Relacionar Proyecto'}
            />}
            <div className="m-2">
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px'
                }}>
                    <FontAwesomeIcon
                        className='puntero'
                        icon='link'
                        size='2x'
                        onClick={() => {
                            setOpenRelacionar(true);
                            dispatch(actions.clearProyectos())
                        }}
                    />
                </div>
                <Typography variant="body1" gutterBottom color="secondary">
                    {initialValues.cliente_nombre}
                </Typography>
                <Typography variant="body1" gutterBottom color="secondary">
                    {initialValues.nombre}
                </Typography>
                <Typography variant="body1" gutterBottom color="secondary">
                    {initialValues.cotizacion_nro}
                </Typography>
                <BaseForm
                    myValues={myValues}
                    clientes_list={clientes_list}
                    permisos_object={permisos_object}
                    initialValues={initialValues}
                />
            </div>
        </MyFormTagModal>
    )
});

function mapPropsToState(state, ownProps) {
    const {initialValues = null} = ownProps;
    let item = {};
    if (initialValues) {
        item = {
            costo_presupuestado: initialValues.costo_presupuestado,
            orden_compra_fecha: initialValues.orden_compra_fecha,
            fecha_entrega_pactada: initialValues.fecha_entrega_pactada,
            valor_cliente: initialValues.valor_orden_compra,
            cotizacion: initialValues.id,
            abierto: true,
            cotizacion_nro: `${initialValues.unidad_negocio}-${initialValues.nro_cotizacion}`,
            en_cguno: 0,
            nombre: initialValues.descripcion_cotizacion,
            cliente_nombre: initialValues.cliente_nombre,
        };
    }
    return {
        initialValues: item
    }
}

ProyectoCrearDesdeCotizacionModalForm = reduxForm({
    form: "proyectoCrearDesdeCotizacionModalForm",
    validate,
    enableReinitialize: true
})(ProyectoCrearDesdeCotizacionModalForm);

ProyectoCrearDesdeCotizacionModalForm = (connect(mapPropsToState, null)(ProyectoCrearDesdeCotizacionModalForm));

export default ProyectoCrearDesdeCotizacionModalForm;