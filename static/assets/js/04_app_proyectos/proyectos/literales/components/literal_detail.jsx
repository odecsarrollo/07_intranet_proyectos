import React, {Fragment, Component} from 'react';
import {fechaFormatoUno, permisosAdapter, pesosColombianos} from "../../../../00_utilities/common";
import TablaProyectoLiteralesMateriales from '../../literales/components/proyectos_literales_materiales_tabla';
import TablaProyectoLiteralesManoObra from '../../literales/components/proyectos_literales_mano_obra_tabla';
import InformacionLiteralGeneral from '../../literales/components/proyectos_literales_general';
import SeguimientoLiteral from '../../seguimientos_proyectos/components/seguimiento_literal';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {
    LITERALES as literales_permisos_view,
    PROYECTOS as permisos_view,
    ARCHIVOS_LITERALES as archivos_literal_permisos_view,
} from "../../../../00_utilities/permisos/types";
import PanelArchivosLiteral from '../../archivos/literales/panel_archivos_literales';

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

    onTabClick(tab_index) {
        this.setState({tab_index});
    }

    componentDidMount() {
        this.cargarDatos();
    }

    componentWillUnmount() {
        this.props.clearLiterales();
    }

    cargarDatos() {
        const {id_literal} = this.props;
        this.props.fetchLiteral(id_literal);
        this.setState({tab_index: 2});
    }

    onUpdateLiteral(literal) {
        const {clearCurrentLiteral, callbackCargarDatosProyecto = null} = this.props;
        clearCurrentLiteral();
        const callback = () => () => {
            if (callbackCargarDatosProyecto) {
                callbackCargarDatosProyecto();
            }
        };
        this.props.updateLiteral(literal.id, literal, {callback});
    }

    onDeleteLiteral(literal) {
        const {
            clearCurrentLiteral = null,
            callbackCargarDatosProyecto = null
        } = this.props;
        const callback = () => {
            if (clearCurrentLiteral) {
                clearCurrentLiteral(null);
            }
            if (callbackCargarDatosProyecto) {
                callbackCargarDatosProyecto();
            }
        };
        this.props.deleteLiteral(literal.id, {callback});
    }

    render() {
        const {
            literal,
            proyecto,
            mis_permisos,
            id_literal
        } = this.props;
        const permisos = permisosAdapter(mis_permisos, permisos_view);
        const permisos_literales = permisosAdapter(mis_permisos, literales_permisos_view);
        const permisos_archivos_literal = permisosAdapter(mis_permisos, archivos_literal_permisos_view);
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
                                                to={`/app/ventas/cotizaciones/cotizaciones/detail/${literal.cotizacion}`}>
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
                        <Tab onClick={() => this.onTabClick(2)}>Seguimiento</Tab>
                        <Tab onClick={() => this.onTabClick(0)}>Materiales</Tab>
                        <Tab onClick={() => this.onTabClick(1)}>Mano Obra</Tab>
                        {permisos_literales.change && <Tab>Editar</Tab>}
                        {permisos_archivos_literal.list && <Tab onClick={() => this.onTabClick(3)}>Documentos</Tab>}
                    </TabList>
                    <TabPanel>
                        <SeguimientoLiteral id_literal={id_literal}/>
                    </TabPanel>
                    <TabPanel>
                        <TablaProyectoLiteralesMateriales id_literal={id_literal}/>
                    </TabPanel>
                    <TabPanel>
                        <TablaProyectoLiteralesManoObra id_literal={id_literal}/>
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
                    {
                        permisos_archivos_literal.list &&
                        <TabPanel>
                            <PanelArchivosLiteral id_literal={id_literal} permisos={permisos_archivos_literal}/>
                        </TabPanel>
                    }
                </Tabs>
            </Fragment>
        )
    }
};

function mapPropsToState(state, ownProps) {
    const {id_literal} = ownProps;
    return {
        mis_permisos: state.mis_permisos,
        literal: _.size(state.literales) > 0 ? state.literales[id_literal] : null
    }
}

export default connect(mapPropsToState, actions)(LiteralDetail);