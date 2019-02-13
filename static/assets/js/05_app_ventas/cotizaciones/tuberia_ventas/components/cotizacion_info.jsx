import React, {Fragment, Component} from 'react';
import {pesosColombianos, fechaFormatoUno} from "../../../../00_utilities/common";
import {Link} from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import MyDialogButtonDelete from '../../../../00_utilities/components/ui/dialog/delete_dialog';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

class ItemProyecto extends Component {
    constructor(props) {
        super(props);
        this.state = {seleccionado: false}
    }

    render() {
        const {
            proyecto,
            onActualizarProyecto,
            solicitarCrearLiteral,
            tipo
        } = this.props;
        const {seleccionado} = this.state;
        return (
            <div className='col-3 text-center' style={{border: seleccionado ? '1px solid red' : ''}}>
                <span className='puntero'
                      onClick={() => {
                          tipo === 'proyectos' ? this.setState(s => ({seleccionado: !s.seleccionado})) : onActualizarProyecto(proyecto.id)
                      }}
                >
                    {proyecto.id_mostrar}
                </span>
                {
                    seleccionado &&
                    <Fragment>
                        <div style={{color: 'orange'}}>
                            <div>
                                <Button
                                    className='mb-2'
                                    color="primary"
                                    variant="contained"
                                    onClick={() => onActualizarProyecto(proyecto.id)}
                                >
                                    Relacionar
                                </Button>

                            </div>
                            <div>
                                <Button
                                    className='mb-2'
                                    color="primary"
                                    variant="contained"
                                    onClick={() => solicitarCrearLiteral(true, proyecto.id)}
                                >
                                    Apertura Literal
                                </Button>
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        )
    }
}

class PanelRelacion extends Component {
    constructor(props) {
        super(props);
        this.state = {campo_busqueda: ''}
    }

    render() {
        const {
            listado,
            buscarMetodo,
            onActualizarProyecto,
            placeHolder = '',
            cotizacion,
            solicitarCrearLiteral = null,
            tipo
        } = this.props;
        const {campo_busqueda} = this.state;
        return (
            <Fragment>
                {
                    !cotizacion.abrir_carpeta &&
                    !cotizacion.crear_literal &&
                    <TextField
                        id="text-field-controlled"
                        placeholder={placeHolder}
                        value={campo_busqueda}
                        onChange={(v) => this.setState({campo_busqueda: v.target.value})}
                    />
                }
                {
                    !cotizacion.abrir_carpeta &&
                    !cotizacion.crear_literal &&
                    campo_busqueda.length > 5 &&
                    <Fragment>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => buscarMetodo(campo_busqueda)}
                            className='ml-3'
                        >
                            Buscar
                        </Button>
                        <div className="row">
                            {listado.map(e => {
                                return (
                                    <ItemProyecto
                                        tipo={tipo}
                                        cotizacion={cotizacion}
                                        key={e.id} proyecto={e}
                                        onActualizarProyecto={onActualizarProyecto}
                                        solicitarCrearLiteral={solicitarCrearLiteral}
                                    />
                                )
                            })}
                        </div>
                    </Fragment>
                }
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
        this.solicitarAbrirCarpeta = this.solicitarAbrirCarpeta.bind(this);
        this.solicitarCrearLiteral = this.solicitarCrearLiteral.bind(this);
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
        this.props.fetchProyectosxParametro(busqueda)
    }

    buscarLiteral(busqueda) {
        this.props.fetchLiteralesxParametro(busqueda)
    }

    solicitarAbrirCarpeta(abrir_carpeta) {
        const {
            object
        } = this.props;
        this.props.fetchCotizacion(
            object.id,
            {
                callback:
                    cotizacion => {
                        this.props.updateCotizacion(
                            cotizacion.id,
                            {...cotizacion, abrir_carpeta}
                        )
                    }
            }
        )
    }

    solicitarCrearLiteral(crear_literal, crear_literal_id_proyecto) {
        const {object} = this.props;
        this.props.fetchCotizacion(
            object.id,
            {
                callback:
                    cotizacion => {
                        this.props.updateCotizacion(
                            cotizacion.id,
                            {...cotizacion, crear_literal, crear_literal_id_proyecto}
                        )
                    }
            }
        )
    }

    render() {
        const {
            open,
            proyectos_list,
            literales_list,
            onActualizarProyecto,
            cancelarRelacionar,
            onActualizarLiteral,
            object
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
                open={open}
            >
                <DialogTitle id="responsive-dialog-title">
                    Relacionar Proyecto
                </DialogTitle>
                <DialogContent>
                    <Tabs>
                        <TabList>
                            <Tab>Proyectos</Tab>
                            <Tab>Literales</Tab>
                        </TabList>
                        <TabPanel>
                            <PanelRelacion
                                tipo='proyectos'
                                placeHolder='Digite el proyecto a buscar'
                                listado={proyecto_listado_nuevo}
                                buscarMetodo={this.buscarProyecto}
                                onActualizarProyecto={onActualizarProyecto}
                                cotizacion={object}
                                solicitarCrearLiteral={this.solicitarCrearLiteral}
                            />
                        </TabPanel>
                        <TabPanel>
                            <PanelRelacion
                                tipo='literales'
                                placeHolder='Digite el literal a buscar'
                                listado={literales_listado_nuevo}
                                buscarMetodo={this.buscarLiteral}
                                onActualizarProyecto={onActualizarLiteral}
                                cotizacion={object}
                            />
                        </TabPanel>
                    </Tabs>
                    {
                        !object.crear_literal &&
                        <Button
                            color={object.abrir_carpeta ? 'secondary' : 'primary'}
                            variant="contained"
                            onClick={
                                () => this.solicitarAbrirCarpeta(!object.abrir_carpeta)
                            }>
                            {object.abrir_carpeta ? 'Cancelar Apertura de Carpeta' : 'Solicitar Apertura Carpeta'}
                        </Button>
                    }
                    {
                        object.crear_literal &&
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={
                                () => this.solicitarCrearLiteral(!object.crear_literal, null)
                            }>
                            Cancelar Creacion Literal
                        </Button>
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => cancelarRelacionar()}
                    >
                        Cancelar
                    </Button>
                </DialogActions>
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
            object
        } = this.props;
        this.props.fetchProyecto(
            id,
            {
                callback:
                    proyecto => {
                        this.props.updateProyecto(
                            id,
                            {...proyecto, cotizacion: object.id},
                            {
                                callback: () => {
                                    this.props.fetchCotizacion(object.id)
                                }
                            }
                        )
                    }
            }
        );
    }

    onActualizarLiteral(id) {
        this.setState({relacionar_proyecto: false});
        const {object} = this.props;
        this.props.fetchLiteral(
            id,
            {
                callback:
                    literal => {
                        this.props.updateLiteral(
                            id,
                            {...literal, cotizacion: object.id},
                            {
                                callback:
                                    () => {
                                        this.props.fetchCotizacion(object.id)
                                    }
                            }
                        )
                    }
            }
        );
    }

    onEliminarProyectoCotizacion(id) {
        this.setState({relacionar_proyecto: false});
        const {object} = this.props;
        this.props.fetchProyecto(
            id,
            {
                callback:
                    proyecto => {
                        this.props.updateProyecto(
                            id,
                            {...proyecto, cotizacion: null},
                            {
                                callback:
                                    () => {
                                        this.props.fetchCotizacion(object.id)
                                    }
                            }
                        )
                    }
            }
        );
    }

    onEliminarLiteralCotizacion(id) {
        this.setState({relacionar_proyecto: false});
        const {object} = this.props;
        this.props.fetchLiteral(
            id,
            {
                callback:
                    literal => {
                        this.props.updateLiteral(
                            id,
                            {...literal, cotizacion: null},
                            {
                                callback:
                                    () => {
                                        this.props.fetchCotizacion(object.id)
                                    }
                            }
                        )
                    }
            }
        );
    }

    render() {
        const {object, permisos_proyecto, permisos_cotizacion} = this.props;
        const {relacionar_proyecto} = this.state;
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
                    {
                        object.estado === 'Cierre (Aprobado)' &&
                        <Fragment>
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
                                    className=''
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
                                          style={{color: 'red'}}
                                          onClick={() => this.setState({relacionar_proyecto: true})}
                                    >
                                {(object.crear_literal || object.abrir_carpeta) ? 'Solicitud pendiente...' : 'Relacionar'}
                            </span>
                                }</span>
                            }
                            <br/>
                        </Fragment>
                    }
                    {object.responsable &&
                    <Fragment><strong>Encargado: </strong> {object.responsable_nombres} {object.responsable_apellidos}
                        <br/></Fragment>}
                </div>
                {
                    relacionar_proyecto &&
                    <DialogRelacionarProyecto
                        cancelarRelacionar={() => this.setState({relacionar_proyecto: false})}
                        onActualizarProyecto={this.onActualizarProyecto}
                        onActualizarLiteral={this.onActualizarLiteral}
                        open={relacionar_proyecto}
                        {...this.props}
                    />
                }
            </div>
        )
    }

}

export default CotizacionInfo;