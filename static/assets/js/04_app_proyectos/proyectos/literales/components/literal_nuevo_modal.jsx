import React, {Component, Fragment} from 'react'
import Button from '@material-ui/core/Button';
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
            notificarErrorAjaxAction,
            callback = null
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
            () => {
                this.setState({modal_open: false});
                if (callback) {
                    callback()
                }
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
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            this.setState({item_seleccionado: cotizacion_pendiente_por_literal, modal_open: true});
                        }}
                    >
                        {cotizacion_pendiente_por_literal ? 'Add. Lit. Cotización' : 'Nuevo'}
                    </Button>
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