import React, {Fragment, Component} from 'react';
import {pesosColombianos, fechaFormatoUno} from "../../../../00_utilities/common";
import {Link} from 'react-router-dom'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {
    FlatIconModalCancel
} from '../../../../00_utilities/components/ui/icon/iconos';
import {
    MyDialogButtonDelete
} from '../../../../00_utilities/components/ui/dialog';

class PanelRelacion extends Component {
    constructor(props) {
        super(props);
        this.state = {campo_busqueda: ''}
    }

    render() {
        const {listado, buscarMetodo, onActualizarProyecto} = this.props;
        const {campo_busqueda} = this.state;
        return (
            <Fragment>
                <TextField
                    id="text-field-controlled"
                    value={campo_busqueda}
                    onChange={(v) => this.setState({campo_busqueda: v.target.value})}
                />
                {
                    campo_busqueda.length > 5 &&
                    <button type="button"
                            onClick={() => buscarMetodo(campo_busqueda)}>
                        Buscar
                    </button>
                }
                <div className="row">
                    {listado.map(e => {
                        return (
                            <div key={e.id} className='col-3 text-center'>
                                <span className='puntero' onClick={() => onActualizarProyecto(e.id)}>
                                {e.id_mostrar}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </Fragment>
        )
    }
}

class DialogRelacionarProyecto extends Component {
    constructor(props) {
        super(props);
        this.state = {campo_busqueda: ''};
        this.buscarProyecto = this.buscarProyecto.bind(this);
        this.buscarLiteral = this.buscarLiteral.bind(this);
    }

    componentWillUnmount() {
        this.props.clearProyectos();
        this.props.clearLiterales();
    }

    componentWillMount() {
        this.props.clearProyectos();
        this.props.clearLiterales();
    }

    buscarProyecto(busqueda) {
        const {
            fetchProyectosxParametro,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchProyectosxParametro(busqueda, () => noCargando(), notificarErrorAjaxAction)
    }

    buscarLiteral(busqueda) {
        const {
            fetchLiteralesxParametro,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchLiteralesxParametro(busqueda, () => noCargando(), notificarErrorAjaxAction)
    }

    render() {
        const {
            open,
            actions,
            proyectos_list,
            literales_list,
            onActualizarProyecto,
            onActualizarLiteral
        } = this.props;
        const proyecto_listado_nuevo = _.map(_.orderBy(proyectos_list, ['id_proyecto'], ['asc']), e => ({
            id: e.id,
            id_mostrar: e.id_proyecto,
        }));
        const literales_listado_nuevo = _.map(_.orderBy(literales_list, ['id_literal'], ['asc']), e => ({
            id: e.id,
            id_mostrar: e.id_literal,
        }));
        return (
            <Dialog
                title='Relacionar Proyecto'
                actions={actions}
                modal={true}
                open={open}
            >
                <Tabs>
                    <TabList>
                        <Tab>Proyectos</Tab>
                        <Tab>Literales</Tab>
                    </TabList>
                    <TabPanel>
                        <PanelRelacion
                            listado={proyecto_listado_nuevo}
                            buscarMetodo={this.buscarProyecto}
                            onActualizarProyecto={onActualizarProyecto}
                        />
                    </TabPanel>
                    <TabPanel>
                        <PanelRelacion
                            listado={literales_listado_nuevo}
                            buscarMetodo={this.buscarLiteral}
                            onActualizarProyecto={onActualizarLiteral}
                        />
                    </TabPanel>
                </Tabs>
            </Dialog>
        )
    }
}

class CotizacionInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            relacionar_proyecto: false
        };
        this.onActualizarProyecto = this.onActualizarProyecto.bind(this);
        this.onActualizarLiteral = this.onActualizarLiteral.bind(this);
        this.onEliminarProyectoCotizacion = this.onEliminarProyectoCotizacion.bind(this);
        this.onEliminarLiteralCotizacion = this.onEliminarLiteralCotizacion.bind(this);
    }

    onActualizarProyecto(id) {
        this.setState({relacionar_proyecto: false});
        const {
            object,
            fetchProyecto,
            updateProyecto,
            fetchCotizacion,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchProyecto(
            id,
            proyecto => {
                updateProyecto(
                    id,
                    {...proyecto, cotizacion: object.id},
                    () => {
                        fetchCotizacion(object.id,
                            () => noCargando(),
                            notificarErrorAjaxAction
                        )
                    },
                    notificarErrorAjaxAction
                )
            },
            notificarErrorAjaxAction
        );
    }

    onActualizarLiteral(id) {
        this.setState({relacionar_proyecto: false});
        const {
            object,
            fetchLiteral,
            updateLiteral,
            fetchCotizacion,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchLiteral(
            id,
            literal => {
                updateLiteral(
                    id,
                    {...literal, cotizacion: object.id},
                    () => {
                        fetchCotizacion(object.id,
                            () => noCargando(),
                            notificarErrorAjaxAction
                        )
                    },
                    notificarErrorAjaxAction
                )
            },
            notificarErrorAjaxAction
        );
    }

    onEliminarProyectoCotizacion(id) {
        this.setState({relacionar_proyecto: false});
        const {
            object,
            fetchProyecto,
            updateProyecto,
            fetchCotizacion,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchProyecto(
            id,
            proyecto => {
                updateProyecto(
                    id,
                    {...proyecto, cotizacion: null},
                    () => {
                        fetchCotizacion(object.id,
                            () => noCargando(),
                            notificarErrorAjaxAction
                        )
                    },
                    notificarErrorAjaxAction
                )
            },
            notificarErrorAjaxAction
        );
    }

    onEliminarLiteralCotizacion(id) {
        this.setState({relacionar_proyecto: false});
        const {
            object,
            fetchLiteral,
            updateLiteral,
            fetchCotizacion,
            noCargando,
            cargando,
            notificarErrorAjaxAction
        } = this.props;
        cargando();
        fetchLiteral(
            id,
            literal => {
                updateLiteral(
                    id,
                    {...literal, cotizacion: null},
                    () => {
                        fetchCotizacion(object.id,
                            () => noCargando(),
                            notificarErrorAjaxAction
                        )
                    },
                    notificarErrorAjaxAction
                )
            },
            notificarErrorAjaxAction
        );
    }

    render() {
        const {object, permisos_proyecto, permisos_cotizacion} = this.props;
        const {relacionar_proyecto} = this.state;
        const actions = [
            <FlatIconModalCancel onClick={() => this.setState({relacionar_proyecto: false})}/>,
        ];
        return (
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4">
                    <strong>Unidad Negocio: </strong> {object.unidad_negocio}
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <strong>Cliente: </strong> {object.cliente_nombre}
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                    <strong>Contacto: </strong> {object.contacto}
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 col-md-4">
                            <strong>Fecha Entrega
                                Cotización: </strong>{object.fecha_entrega_pactada_cotizacion ? fechaFormatoUno(object.fecha_entrega_pactada_cotizacion) : 'Sin Definir'}
                        </div>
                        <div className="col-12 col-md-4">
                            <strong>Valor Orden Compra: </strong>{pesosColombianos(object.valor_orden_compra)}
                        </div>
                        <div className="col-12 col-md-4">
                            <strong>Nro Orden Compra: </strong>{object.orden_compra_nro}
                        </div>
                        <div className="col-12 col-md-4">
                            <strong>Fecha Orden
                                Compra: </strong>{object.orden_compra_fecha ? fechaFormatoUno(object.orden_compra_fecha) : 'Sin Definir'}
                        </div>
                        <div className="col-12 col-md-4">
                            <strong>Valor Ofertado: </strong>{pesosColombianos(object.valor_ofertado)}
                        </div>
                        <div className="col-12 col-md-4">
                            <strong>Costo Presupuestado: </strong>{pesosColombianos(object.costo_presupuestado)}
                        </div>
                        <div className="col-12 col-md-4">
                            <strong>Fecha Entrega
                                Proyecto: </strong>{object.fecha_entrega_pactada ? fechaFormatoUno(object.fecha_entrega_pactada) : 'Sin Definir'}
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-3">
                    <strong>Descripción: </strong> {object.descripcion_cotizacion}<br/>
                    <strong>Observación: </strong> {object.observacion}<br/>
                    <strong>Estado: </strong> {object.estado} <br/>
                    <strong>Contacto: </strong>
                    {
                        object.contacto_cliente &&
                        <Fragment>
                            <Link
                                to={`/app/ventas/clientes/clientes/detail/${object.cliente}`}>{object.contacto_cliente_nombre}
                            </Link><br/>
                        </Fragment>
                    }
                    <strong>Proyecto: </strong>
                    {
                        permisos_proyecto.detail &&
                        (object.mi_proyecto || object.mi_literal_id_literal) ?
                            <Fragment>
                                <Link
                                    to={`/app/proyectos/proyectos/detail/${object.mi_proyecto}`}>{object.id_proyecto}
                                </Link>
                                <Link
                                    to={`/app/proyectos/proyectos/detail/${object.mi_literal_proyecto_id}`}>{object.mi_literal_id_literal}
                                </Link>
                            </Fragment> :
                            <Fragment>
                                {object.id_proyecto}
                                {object.mi_literal_id_literal}
                            </Fragment>
                    }
                    {
                        (object.mi_proyecto || object.mi_literal_id_literal) &&
                        permisos_cotizacion.change &&
                        <MyDialogButtonDelete
                            element_name={''}
                            element_type={`la relación de la cotizacion con el ${object.mi_proyecto ? 'proyecto' : 'literal'} ${object.mi_proyecto ? object.id_proyecto : object.mi_literal_id_literal}`}
                            onDelete={() => {
                                object.mi_proyecto ? this.onEliminarProyectoCotizacion(object.mi_proyecto) : this.onEliminarLiteralCotizacion(object.mi_literal)
                            }}
                        />
                    }
                    {
                        (!object.mi_proyecto && !object.mi_literal_id_literal) &&
                        permisos_cotizacion.change &&
                        !relacionar_proyecto &&
                        <span>{object.id_proyecto ? object.id_proyecto :
                            <span className='puntero'
                                  onClick={() => this.setState({relacionar_proyecto: true})}>Relacionar</span>}</span>
                    }

                    <br/>
                    {object.responsable &&
                    <Fragment><strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                        <br/></Fragment>}
                </div>
                {
                    relacionar_proyecto &&
                    <DialogRelacionarProyecto
                        onActualizarProyecto={this.onActualizarProyecto}
                        onActualizarLiteral={this.onActualizarLiteral}
                        actions={actions}
                        open={relacionar_proyecto}
                        {...this.props}
                    />
                }
            </div>
        )
    }

}

export default CotizacionInfo;