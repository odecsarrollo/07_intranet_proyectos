import React, {Fragment, Component} from 'react';
import {fechaFormatoUno, pesosColombianos} from "../../../../00_utilities/common";
import TablaProyectoLiteralesMateriales from '../../literales/components/proyectos_literales_materiales_tabla';
import TablaProyectoLiteralesManoObra from '../../literales/components/proyectos_literales_mano_obra_tabla';
import InformacionLiteralGeneral from '../../literales/components/proyectos_literales_general';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {Link} from 'react-router-dom';

class LiteralDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_index: 0
        };
        this.onUpdateLiteral = this.onUpdateLiteral.bind(this);
        this.onDeleteLiteral = this.onDeleteLiteral.bind(this);
        this.onTabClick = this.onTabClick.bind(this);
    }

    componentWillUnmount() {
        this.limpiarInformacionLiteral();
    }

    limpiarInformacionLiteral() {
        this.props.clearHorasColaboradoresProyectosIniciales();
        this.props.clearHorasHojasTrabajos();
        this.props.clearItemsLiterales();
        this.props.clearItemsListadosMateriales();
    }

    componentDidMount() {
        const {
            notificarErrorAjaxAction,
            cargando,
            noCargando,
            literal,
            fetchItemsLiterales
        } = this.props;
        cargando();
        fetchItemsLiterales(literal.id, () => noCargando(), notificarErrorAjaxAction);
    }

    onTabClick(tab_index) {
        const {
            notificarErrorAjaxAction,
            cargando,
            noCargando,
            literal,
        } = this.props;
        this.setState({tab_index});
        cargando();
        this.limpiarInformacionLiteral();
        switch (tab_index) {
            case 0:
                const {fetchItemsLiterales} = this.props;
                fetchItemsLiterales(literal.id, () => noCargando(), notificarErrorAjaxAction);
                break;
            case 1:
                const {
                    fetchHorasColaboradoresProyectosInicialesxLiteral,
                    fetchHorasHojasTrabajosxLiteral
                } = this.props;
                const cargarHorasManoObraInicialLiteral = () => fetchHorasColaboradoresProyectosInicialesxLiteral(literal.id, () => noCargando(), notificarErrorAjaxAction);
                fetchHorasHojasTrabajosxLiteral(literal.id, () => cargarHorasManoObraInicialLiteral(), notificarErrorAjaxAction);
                break;
            case 2:
                const {fetchItemsListadosMateriales_por_literal} = this.props;
                fetchItemsListadosMateriales_por_literal(literal.id, () => noCargando(), notificarErrorAjaxAction);
                break;
        }
    }

    onUpdateLiteral(literal) {
        const {cargando, noCargando, notificarErrorAjaxAction, setCurrentLiteral} = this.props;
        cargando();
        this.props.updateLiteral(
            literal.id,
            literal,
            (response) => {
                noCargando();
                setCurrentLiteral(response);
            }, notificarErrorAjaxAction);
    }

    onDeleteLiteral(literal) {
        const {cargando, noCargando, notificarErrorAjaxAction, setCurrentLiteral} = this.props;
        cargando();
        this.props.deleteLiteral(
            literal.id,
            () => {
                noCargando();
                setCurrentLiteral(null);
            }, notificarErrorAjaxAction
        );
    }

    render() {
        const {
            literal,
            permisos,
            proyecto,
            items_literales,
            horas_hojas_trabajos_list,
            horas_colaboradores_proyectos_iniciales_list,
            permisos_literales,
        } = this.props;
        return (
            <Fragment>
                <div className="row">
                    <div className="col-12">
                        <h4 className="h4-responsive">Literal: <small>{literal.id_literal}</small>
                        </h4>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                <h5 className='h5-response'>{literal.descripcion}</h5>
                            </div>
                            {
                                literal.cotizacion &&
                                <Fragment>
                                    <div className="col-12 col-md-6">
                                        <h6 className='h6-response'>Cotización: <small>
                                            <Link
                                                to={`/app/proyectos/cotizaciones/cotizaciones/detail/${literal.cotizacion}`}>
                                                {literal.cotizacion_nro}
                                            </Link>
                                        </small>
                                        </h6>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <h6 className='h6-response'>Fecha Entrega: <small>
                                            {fechaFormatoUno(literal.cotizacion_fecha_entrega)}
                                        </small>
                                        </h6>
                                    </div>
                                </Fragment>
                            }
                            {
                                permisos.costo_materiales &&
                                <div className="col-12 col-md-4">
                                    <h6 className='h6-response'>Costo
                                        Materiales: <small>{pesosColombianos(literal.costo_materiales)}</small>
                                    </h6>
                                </div>
                            }
                            {permisos.costo_mano_obra &&
                            <div className="col-12 col-md-4">
                                <h6 className='h6-response'>Costo
                                    Mano
                                    Obra: <small>{pesosColombianos(Number(literal.costo_mano_obra) + Number(literal.costo_mano_obra_inicial))}</small>
                                </h6>
                            </div>
                            }
                            {
                                permisos.costo &&
                                <div className="col-12 col-md-4">
                                    <h6 className='h6-response'>Costo
                                        Total: <small>{pesosColombianos(Number(literal.costo_mano_obra_inicial) + Number(literal.costo_mano_obra) + Number(literal.costo_materiales))}</small>
                                    </h6>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <Tabs>
                    <TabList>
                        <Tab onClick={() => this.onTabClick(0)}>Materiales</Tab>
                        <Tab onClick={() => this.onTabClick(1)}>Mano Obra</Tab>
                        {permisos_literales.change && <Tab>Editar</Tab>}
                    </TabList>
                    <TabPanel>
                        <TablaProyectoLiteralesMateriales
                            onTabClick={this.onTabClick}
                            items_literales={items_literales}
                            can_see_ultimo_costo_item_biable={permisos.ultimo_costo_item_biable}
                            {...this.props}
                        />
                    </TabPanel>
                    <TabPanel>
                        <TablaProyectoLiteralesManoObra
                            horas_mano_obra_literales={horas_hojas_trabajos_list}
                            horas_colaboradores_proyectos_iniciales_list={horas_colaboradores_proyectos_iniciales_list}
                        />
                    </TabPanel>
                    {permisos_literales.change &&
                    <TabPanel>
                        <InformacionLiteralGeneral
                            proyecto={proyecto}
                            literal={literal}
                            onUpdateLiteral={this.onUpdateLiteral}
                            onDeleteLiteral={this.onDeleteLiteral}
                        />
                    </TabPanel>
                    }
                </Tabs>
            </Fragment>
        )
    }
};

export default LiteralDetail;