import React, {Component, Fragment} from 'react'
import {ContainerNuevoButton} from '../../../../00_utilities/components/ui/icon/iconos';
import CreateForm from '../../literales/components/forms/literal_general_model_form';

class LiteralModalCreate extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            item_seleccionado: null,
            modal_open: false
        });
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(item) {
        const {
            cargando,
            noCargando,
            object,
            literales_list,
            setCurrentLiteral,
            notificarErrorAjaxAction,
        } = this.props;
        cargando();
        this.props.clearHorasColaboradoresProyectosIniciales();
        this.props.clearHorasHojasTrabajos();
        this.props.clearItemsLiterales();

        const id_literal = `${object.id_proyecto}${item.id_literal_posfix ? `-${item.id_literal_posfix}` : ''}`;
        const existe_literal = _.map(literales_list, e => e.id_literal).includes(id_literal);
        const nuevo_literal = {...item, proyecto: object.id, id_literal, en_cguno: false};
        const crearLiteral = () => this.props.createLiteral(
            nuevo_literal,
            (response) => {
                this.setState({modal_open: false});
                setCurrentLiteral(response);
                noCargando()
            },
            notificarErrorAjaxAction
        );
        if (!existe_literal) {
            this.props.fetchLiteralesXProyecto(object.id, crearLiteral, notificarErrorAjaxAction);
        } else {
            notificarErrorAjaxAction('Ya existe este literal');
        }
    }

    render() {
        const {
            permisos_object,
            cotizacion_pendiente_por_literal = null
        } = this.props;
        const {
            item_seleccionado,
            modal_open
        } = this.state;
        return (
            <Fragment>
                {
                    permisos_object.add &&
                    <ContainerNuevoButton
                        texto={cotizacion_pendiente_por_literal ? 'Add. Lit. Cotización' : 'Nuevo'}
                        onClick={() => {
                            this.setState({item_seleccionado: cotizacion_pendiente_por_literal, modal_open: true});
                        }}
                    />
                }
                {
                    modal_open &&
                    <CreateForm
                        {...this.props}
                        item_seleccionado={item_seleccionado}
                        modal_open={modal_open}
                        onCancel={() => this.setState({modal_open: false, item_seleccionado: null})}
                        onSubmit={this.onSubmit}
                        setSelectItem={this.setSelectItem}
                    />
                }
            </Fragment>
        )
    }
}

export default LiteralModalCreate;