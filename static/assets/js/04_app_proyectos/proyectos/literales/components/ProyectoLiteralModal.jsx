import React, {Component, Fragment, memo, useState} from 'react'
import {useDispatch} from 'react-redux';
import Button from '@material-ui/core/Button';
import CreateForm from './forms/ProyectoLiteralModalForm';
import * as actions from "../../../../01_actions/01_index";


const LiteralCreateForm = (props) => {
    const {cotizacion_pendiente_por_literal, permisos_object, proyecto} = props;
    const [item_seleccionado, setItemSeleccionado] = useState(null);
    const [modal_open, setModalOpen] = useState(false);
    const dispatch = useDispatch();

    const onSubmit = (item) => {
        const {
            proyecto,
            literales_list,
            notificarErrorAjaxAction,
            callback = null
        } = props;
        const id_literal = `${proyecto.id_proyecto}${item.id_literal_posfix ? `-${item.id_literal_posfix}` : ''}`;
        const existe_literal = _.map(literales_list, e => e.id_literal).includes(id_literal);

        const nuevo_literal = {...item, proyecto: proyecto.id, id_literal, en_cguno: false};
        const crearLiteral = () => dispatch(actions.createLiteral(
            nuevo_literal,
            {
                callback:
                    () => {
                        setModalOpen(false);
                        if (callback) {
                            callback()
                        }
                    }
            }
        ));
        if (!existe_literal) {
            return crearLiteral();
        } else {
            notificarErrorAjaxAction('Ya existe este literal');
        }
    };

    return (
        <Fragment>
            {
                permisos_object.add &&
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setItemSeleccionado(cotizacion_pendiente_por_literal);
                        setModalOpen(true);
                    }}
                >
                    {cotizacion_pendiente_por_literal ? 'Add. Lit. Cotización' : 'Nuevo'}
                </Button>
            }
            {
                modal_open &&
                <CreateForm
                    proyecto={proyecto}
                    //{...this.props}
                    //initialValues={item_seleccionado}
                    modal_open={modal_open}
                    onCancel={() => {
                        setItemSeleccionado(null);
                        setModalOpen(false);
                    }}
                    onSubmit={onSubmit}
                    //setSelectItem={this.setSelectItem}
                />
            }
        </Fragment>
    )
};

export default LiteralCreateForm;