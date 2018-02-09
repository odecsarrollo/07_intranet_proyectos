import React, {Component} from 'react';

export default class BotoneriaForm extends Component {
    constructor(props) {
        super(props);
        this.state = ({mostrar_avanzado: false})
    }

    render() {
        const {
            pristine,
            submitting,
            reset,
            initialValues = null,
            onCancel,
            onDelete,
            can_delete = true,
            texto_botones = null
        } = this.props;
        const {mostrar_avanzado} = this.state;

        return (
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        {
                            !pristine &&
                            !submitting &&
                            <button type="button" className="btn btn-limpiar" onClick={reset}
                                    disabled={pristine || submitting}>
                                Limpiar
                            </button>
                        }
                        {
                            !pristine &&
                            !submitting &&
                            <button type="submit" className="btn btn-guardar" disabled={pristine || submitting}>
                                {initialValues ? 'Editar ' : 'Crear '} {texto_botones && texto_botones}
                            </button>
                        }
                        <button type="button" className="btn btn-cancelar" onClick={() => {
                            onCancel()
                        }}>
                            Cancelar
                        </button>
                    </div>
                    <div className="col-12 text-right">
                        {
                            initialValues &&
                            can_delete &&
                            <span
                                style={{cursor: "pointer"}}
                                onClick={() => {
                                    this.setState({mostrar_avanzado: !mostrar_avanzado})
                                }}
                            >
                            {mostrar_avanzado ? 'Menos...' : 'Mas...'}
                            </span>
                        }
                        {
                            mostrar_avanzado &&
                            initialValues &&
                            can_delete &&

                            <div className="col-12 text-right">
                                <button type="button" className="btn btn-eliminar" onClick={() => {
                                    onDelete(initialValues.id)
                                }}>
                                    Eliminar
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
