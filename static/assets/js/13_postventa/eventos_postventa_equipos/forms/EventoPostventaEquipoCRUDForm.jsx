import Button from "@material-ui/core/Button";
import React, {memo, useState, Fragment} from 'react';
import Typography from "@material-ui/core/Typography";
import {reduxForm} from 'redux-form';
import DialogSeleccionar from "../../../00_utilities/components/ui/search_and_select/SearchAndSelect";
import * as actions from "../../../01_actions/01_index";
import validate from './validate';
import {MyFormTagModal} from '../../../00_utilities/components/ui/forms/MyFormTagModal';
import {useDispatch} from "react-redux";
import {MyCombobox, MyDateTimePickerField, MyTextFieldSimple} from "../../../00_utilities/components/ui/forms/fields";

let EventoPostventaEquipoCRUDForm = memo(props => {
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
    } = props;
    const dispatch = useDispatch();
    const [open_buscar_equipo, setOpenBuscarEquipo] = useState(false);
    const [listado_equipos, setListadoEquipos] = useState([]);
    const [equipo, setEquipo] = useState(null);
    const buscarProyecto = (busqueda) => {
        dispatch(actions.fetchEquiposProyectosxIdentificador(busqueda, {
            callback: response => setListadoEquipos(response, 'id')
        }));
    };
    const cargarEquipoSeleccionado = (equipo_id) => dispatch(actions.fetchEquipoProyecto(equipo_id, {
        callback: (resp) => {
            setEquipo(resp);
            setOpenBuscarEquipo(false);
        }
    }))
    const lista_tipos = [
        {id: 'MONTAJE', name: 'Montaje'},
        {id: 'MODIFICACION', name: 'Modificación'},
        {id: 'GARANTIA', name: 'Garantía'},
        {id: 'AJUSTE', name: 'Ajuste'},
        {id: 'ASISTENCIA_TECNICA', name: 'Asistencia Técnica'},
        {id: 'REPARACION', name: 'Reparación'},
    ];
    return (
        <MyFormTagModal
            onCancel={onCancel}
            onSubmit={handleSubmit(v => onSubmit({...v, equipo: equipo.id}))}
            reset={reset}
            initialValues={initialValues}
            submitting={submitting}
            modal_open={modal_open}
            pristine={pristine}
            element_type={singular_name}
        >
            {open_buscar_equipo && <DialogSeleccionar
                placeholder='Equipo a buscar'
                id_text='id'
                selected_item_text='to_string'
                onSearch={buscarProyecto}
                onSelect={(id) => {
                    cargarEquipoSeleccionado(id);
                }}
                onCancelar={() => setOpenBuscarEquipo(false)}
                listado={listado_equipos}
                open={open_buscar_equipo}
                select_boton_text='Seleccionar'
                titulo_modal={'Seleccionar Equipo'}
                min_caracteres={8}
            />}
            {!equipo && <Button
                color='primary'
                variant="contained"
                onClick={() => setOpenBuscarEquipo(true)}
            >
                Seleccionar Equipo
            </Button>}
            {equipo && <Fragment>
                <Typography variant="h6" gutterBottom color="primary">Equipo (<span className='puntero'
                                                                                    onClick={() => setOpenBuscarEquipo(true)}>Cambiar</span>)</Typography>
                <div className='row' style={{border: '1px solid black', borderRadius: '15px'}}>
                    <div className="col-12 col-md-6">
                        <Typography variant="body1" gutterBottom color="primary"><span>Literal: </span></Typography>
                        <Typography variant="body1" gutterBottom color="secondary">{equipo.id_literal}</Typography>
                    </div>
                    <div className="col-12 col-md-6">
                        <Typography variant="body1" gutterBottom color="primary"><span>Nro. Equipo: </span></Typography>
                        <Typography variant="body1" gutterBottom color="secondary">{equipo.identificador}</Typography>
                    </div>
                    <div className="col-12">
                        <Typography variant="body1" gutterBottom color="primary"><span>Nombre: </span></Typography>
                        <Typography variant="body1" gutterBottom color="secondary">{equipo.nombre}</Typography>
                    </div>
                    <div className="col-12">
                        <Typography variant="body1" gutterBottom color="primary"><span>Tipo Equipo: </span></Typography>
                        <Typography
                            variant="body1" gutterBottom
                            color="secondary">{equipo.tipo_equipo_clase.to_string}
                        </Typography>
                    </div>
                </div>
                <MyDateTimePickerField
                    className='col-12'
                    name='fecha_solicitud'
                    label='Fecha Solicitud'
                    label_space_xs={4}
                    dropUp={false}
                />
                <MyCombobox
                    className="col-12 col-md-12"
                    name='tipo'
                    busy={false}
                    autoFocus={false}
                    data={lista_tipos}
                    textField='name'
                    filter='contains'
                    valuesField='id'
                    placeholder='Tipo de Orden de Servicio'
                />
                <MyTextFieldSimple
                    name='descripcion'
                    multiline={true}
                    rows={4}
                    nombre='Descripción'
                    className='col-12'
                />
            </Fragment>}
        </MyFormTagModal>
    )
});

EventoPostventaEquipoCRUDForm = reduxForm({
    form: "eventoPostventaEquipoCRUDForm",
    validate: validate,
    enableReinitialize: true
})(EventoPostventaEquipoCRUDForm);

export default EventoPostventaEquipoCRUDForm;