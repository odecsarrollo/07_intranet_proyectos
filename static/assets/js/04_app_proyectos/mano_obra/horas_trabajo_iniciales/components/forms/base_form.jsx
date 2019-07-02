import React, {Component, Fragment} from 'react';
import {reduxForm} from 'redux-form';
import {
    MyCombobox,
    MyTextFieldSimple,
} from '../../../../../00_utilities/components/ui/forms/fields';
import {connect} from "react-redux";
import {MyFormTagModal} from '../../../../../00_utilities/components/ui/forms/MyFormTagModal';
import validate from './validate';


class Form extends Component {
    cargarMaestrarFormulario() {
        const {
            proyectos_list,
            colaboradores_list,
            centros_costos_list,
        } = this.props;
        if (_.size(proyectos_list) === 0 || _.size(colaboradores_list) === 0 || _.size(centros_costos_list) === 0) {
            const cargarProyectos = () => this.props.fetchProyectos();
            const cargarColaboradores = () => this.props.fetchColaboradoresEnProyectos({callback: cargarProyectos});
            this.props.fetchCentrosCostosColaboradores({callback: cargarColaboradores});
        }
    }

    componentDidMount() {
        this.cargarMaestrarFormulario()
    }

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
            proyectos_list,
            literales_list,
            colaboradores_list,
            centros_costos_list,
        } = this.props;

        let proyectos_list_array = _.map(_.sortBy(proyectos_list, ['id_proyecto'], ['asc']), e => e);
        let proyecto_literales = null;
        if (literales_list) {
            proyecto_literales =
                _.map(literales_list, e => {
                    return ({
                        id: e.id,
                        descripcion: `${e.id_literal} - ${e.descripcion}`
                    })
                });
        }

        return (
            <MyFormTagModal
                onCancel={onCancel}
                onSubmit={handleSubmit((e) => {
                    const cantidad_minutos = (Number(e.horas * 60) + Number(e.minutos));
                    onSubmit({...e, cantidad_minutos});
                })}
                reset={reset}
                initialValues={initialValues}
                submitting={submitting}
                modal_open={modal_open}
                pristine={pristine}
                element_type={singular_name}
            >
                <MyCombobox
                    data={proyectos_list_array}
                    className='col-12'
                    valuesField='id'
                    textField='id_proyecto'
                    autoFocus={true}
                    onSelect={(e) => {
                        this.props.fetchLiteralesXProyecto(e.id);
                    }}
                    name='proyecto'
                    onChange={v => v.id}
                    placeholder='Proyecto'
                    caseSensitive={false}
                    minLength={3}
                    filter='contains'
                />
                {
                    literales_list &&
                    <Fragment>
                        <MyCombobox
                            data={_.orderBy(proyecto_literales, ['descripcion'], ['asc'])}
                            className='col-12'
                            valuesField='id'
                            textField='descripcion'
                            name='literal'
                            placeholder='Literales'
                            caseSensitive={false}
                            minLength={3}
                            filter='contains'
                        />
                        <MyCombobox
                            data={_.orderBy(_.map(colaboradores_list, c => {
                                return {
                                    id: c.id,
                                    full_name: `${c.nombres} ${c.apellidos}`
                                }
                            }), ['full_name'], ['asc'])}
                            className='col-12'
                            valuesField='id'
                            textField='full_name'
                            autoFocus={true}
                            name='colaborador'
                            placeholder='Colaborador'
                            caseSensitive={false}
                            minLength={3}
                            filter='contains'
                        />
                        <MyCombobox
                            data={_.orderBy(centros_costos_list, ['nombre'], ['asc'])}
                            className='col-12'
                            valuesField='id'
                            textField='nombre'
                            autoFocus={true}
                            name='centro_costo'
                            placeholder='Centro de Costo'
                            caseSensitive={false}
                            minLength={3}
                            filter='contains'
                        />
                        <div className='col-12'>
                            <div className="row">
                                <MyTextFieldSimple
                                    name='horas'
                                    nombre='Horas'
                                    className='col-6'
                                />
                                <MyTextFieldSimple
                                    name='minutos'
                                    nombre='Minutos'
                                    className='col-6'
                                />
                            </div>
                        </div>

                        <MyTextFieldSimple
                            name='valor'
                            nombre='Costo'
                            className='col-6'
                        />
                    </Fragment>
                }
                <div style={{height: '300px'}}>

                </div>
            </MyFormTagModal>
        )
    }
}

Form = reduxForm({
    form: "horasInicialesProyectosForm",
    validate,
    enableReinitialize: true
})(Form);

export default Form;