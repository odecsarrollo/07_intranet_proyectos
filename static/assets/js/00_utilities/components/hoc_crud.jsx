import React, {Component} from 'react'
import ValidarPermisos from "../permisos/validar_permisos";
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExcelDownload from "../../00_utilities/components/system/ExcelDownload";

const style = {
    seleccionar_todo: {
        position: 'absolute',
        bottom: 0,
        right: 50,
        zIndex: 10000
    }
};

function crudHOC(CreateForm, Tabla) {
    class CRUD extends Component {
        constructor(props) {
            super(props);
            this.state = ({
                item_seleccionado: null,
                modal_open: false,
                data_to_excel: {},
            });
            this.onSubmit = this.onSubmit.bind(this);
            this.onDelete = this.onDelete.bind(this);
            this.onSelectForDelete = this.onSelectForDelete.bind(this);
            this.onSelectItemEdit = this.onSelectItemEdit.bind(this);
            this.setSelectItem = this.setSelectItem.bind(this);
            this.onSelectDataToExcel = this.onSelectDataToExcel.bind(this);
        }


        onSelectDataToExcel(item) {
            let {data_to_excel} = this.state;
            if (data_to_excel[item.id]) {
                data_to_excel = _.omit(data_to_excel, item.id);
            } else {
                data_to_excel = {...data_to_excel, [item.id]: item}
            }
            this.setState({data_to_excel})
        }

        onSelectForDelete() {
            const {method_pool: {selectForDeleteObjectMethod}} = this.props;
            if (selectForDeleteObjectMethod) {
                console.log('lo hizo')
            }
        }

        onDelete(item) {
            const {method_pool, notificarAction, singular_name, posDeleteMethod = null} = this.props;
            if (method_pool.deleteObjectMethod === null) {
                console.log('No se ha asignado ningún método para DELETE')
            } else {
                const callback = () => {
                    const {to_string} = item;
                    const options = {
                        title: 'Eliminación Exitosa'
                    };
                    notificarAction(`Se ha eliminado con éxito ${singular_name.toLowerCase()} ${to_string}`, options);
                    this.setState({modal_open: false, item_seleccionado: null});
                    if (posDeleteMethod) {
                        posDeleteMethod(item);
                    }
                };
                return method_pool.deleteObjectMethod(item.id, {callback});
            }
        }

        onSubmit(item, uno = null, dos = null, cerrar_modal = true) {
            const es_form_data = item instanceof FormData;
            const form_data_id = es_form_data ? item.get('id') : null;
            const {method_pool, notificarAction, singular_name, posCreateMethod = null, posUpdateMethod = null} = this.props;
            const callback = (response) => {
                const {to_string} = response;
                const options = {
                    title: item.id ? 'Actualizacion Exitosa' : 'Creación Exitosa'
                };
                notificarAction(`Se ha ${item.id ? 'actualizado' : 'creado'} con éxito ${singular_name.toLowerCase()} ${to_string}`, options);
                this.setState({modal_open: !cerrar_modal, item_seleccionado: cerrar_modal ? null : response});

                if (item.id && posUpdateMethod) {
                    return posUpdateMethod(response);
                }
                if (!item.id && posCreateMethod) {
                    return posCreateMethod(response);
                }
            };
            if (item.id || (es_form_data && form_data_id)) {
                if (method_pool.updateObjectMethod === null) {
                    console.log('No se ha asignado ningún método para UPDATE')
                } else {
                    if (es_form_data) {
                        return method_pool.updateObjectMethod(form_data_id, item, {callback});
                    }
                    return method_pool.updateObjectMethod(item.id, item, {callback});
                }
            } else {
                if (method_pool.createObjectMethod === null) {
                    console.log('No se ha asignado ningún método para CREATE')
                } else {

                    return method_pool.createObjectMethod(item, {callback});
                }
            }
        }

        onSelectItemEdit(item) {
            const {method_pool} = this.props;
            const callback = (response) => this.setState({modal_open: true, item_seleccionado: response});
            if (method_pool.fetchObjectMethod === null) {
                console.log('No se ha asignado ningún método para FETCH OBJECT')
            } else {

                return method_pool.fetchObjectMethod(item.id, {callback});
            }
        }

        setSelectItem(item_seleccionado) {
            this.setState({item_seleccionado})
        }

        render() {
            const {
                list,
                plural_name,
                permisos_object,
                con_titulo = true
            } = this.props;
            const {
                item_seleccionado,
                modal_open,
                data_to_excel,
            } = this.state;
            const list_array = _.map(list, e => e);

            const onSeleccionarTodo = () => {
                if (_.size(data_to_excel) === _.size(list)) {
                    this.setState({data_to_excel: {}})
                } else {
                    this.setState({data_to_excel: list})
                }

            };

            return (
                <ValidarPermisos can_see={permisos_object.list} nombre={plural_name}>
                    {
                        con_titulo &&
                        <Typography variant="h5" gutterBottom color="primary">
                            {plural_name}
                        </Typography>
                    }
                    {
                        permisos_object.add &&
                        <Button
                            color='primary'
                            className='ml-3'
                            onClick={() => {
                                this.setState({item_seleccionado: null, modal_open: true});
                            }}
                        >
                            Nuevo
                        </Button>
                    }
                    {
                        _.size(data_to_excel) > 0 &&
                        <ExcelDownload
                            data={_.map(data_to_excel)}
                            name={plural_name ? plural_name : 'documento'}
                            file_name={plural_name ? plural_name : 'documento'}
                        />
                    }
                    {
                        modal_open &&
                        <CreateForm
                            {...this.props}
                            initialValues={item_seleccionado ? list[item_seleccionado.id] : null}
                            modal_open={modal_open}
                            onCancel={() => this.setState({modal_open: false, item_seleccionado: null})}
                            onSubmit={this.onSubmit}
                            setSelectItem={this.setSelectItem}
                        />
                    }
                    <div>
                        <span
                            style={style.seleccionar_todo}
                            className='puntero'
                            onClick={onSeleccionarTodo}
                        >
                            {_.size(data_to_excel) === _.size(list) ? 'Quitar Selección' : 'Seleccionar Todo'}
                        </span>
                        <Tabla
                            {...this.props}
                            data_to_excel={data_to_excel}
                            onSelectDataToExcel={this.onSelectDataToExcel}
                            data={list_array}
                            updateItem={this.onSubmit}
                            onDelete={this.onDelete}
                            onSelectForDelete={this.onSelectForDelete}
                            onSelectItemEdit={this.onSelectItemEdit}
                        />
                    </div>
                </ValidarPermisos>
            )
        }
    }

    return CRUD;
}


crudHOC.propTypes = {
    plural_name: PropTypes.string,
    singular_name: PropTypes.string,
    method_pool: PropTypes.any,
    permisos_object: PropTypes.any,
    list: PropTypes.any
};

export default crudHOC;