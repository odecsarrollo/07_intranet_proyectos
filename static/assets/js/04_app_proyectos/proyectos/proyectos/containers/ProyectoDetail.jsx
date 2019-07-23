import React, {Component, useState, useEffect, memo} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../../01_actions/01_index";
import {SinObjeto} from "../../../../00_utilities/templates/fragmentos";
import ValidarPermisos from "../../../../permisos/validar_permisos";
import {permisosAdapterDos} from "../../../../00_utilities/common";
import TablaProyectoLiterales from '../../literales/components/ProyectoLiteralTabla';
import FormProyecto from '../components/forms/ProyectoDetailForm';
import FacturasProyecto from '../components/ProyectoFacturaList';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    PROYECTOS,
    LITERALES,
    COTIZACIONES,
    ARCHIVOS_PROYECTOS,
} from "../../../../permisos";
import LiteralModalCreate from '../../literales/components/ProyectoLiteralModal';
import LiteralDetail from '../../literales/components/LiteralDetail';
import ProyectoInfo from '../../proyectos/components/proyecto_datos';
import PanelArchivosProyecto from '../../archivos/proyectos/ProyectoDocumentoList';
import useTengoPermisos from "../../../../00_utilities/hooks/useTengoPermisos";

const style = {
    tabla: {
        fontSize: '9px',
        tr: {
            td: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            td_numero: {
                margin: 0,
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 4,
                paddingRight: 4,
                textAlign: 'right',
            },
            th_numero: {
                margin: 0,
                textAlign: 'right',
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
            th: {
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 4,
            },
        }
    }
};

const Detail = memo((props) => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const [select_literal_id, setSelectLiteralId] = useState(null);
    const [mostrar_literal_info, setMostrarLiteralInfo] = useState(false);
    const cotizaciones = useSelector(state => state.cotizaciones);
    useEffect(() => {
        cargarDatos();
        return () => dispatch(actions.clearProyectos());
    }, []);

    const permisos = useTengoPermisos(PROYECTOS);
    const permisos_literales = useTengoPermisos(LITERALES);
    const cotizacion_permisos = useTengoPermisos(COTIZACIONES);
    const permisos_archivos_proyecto = useTengoPermisos(ARCHIVOS_PROYECTOS);
    const cargarDatos = () => {
        const cargarCotizacioneParaCrearLiterales = () => dispatch(actions.fetchCotizacionesPidiendoCarpeta());
        dispatch(actions.fetchProyecto(id, {callback: cargarCotizacioneParaCrearLiterales}));
    };

    const proyecto = useSelector(state => state.proyectos[id]);
    if (!proyecto) {
        return <SinObjeto/>
    }
    const literales = _.mapKeys(proyecto.mis_literales, 'id');

    let facturas = [];
    proyecto.mis_literales.map(l => {
        if (l.facturas) {
            l.facturas.map(f => {
                facturas = [...facturas, {...f, literal_nombre: l.id_literal}];
            })
        }
    });

    const literal_seleccionado = select_literal_id ? literales[select_literal_id] : null;

    const onLiteralSelect = (select_literal_id) => {
        setMostrarLiteralInfo(true);
        setSelectLiteralId(select_literal_id);
    };

    const clearCurrentLiteral = () => {
        setMostrarLiteralInfo(true);
        setSelectLiteralId(null);
    };

    const onUpdateProyecto = (proyecto) => {
        dispatch(actions.updateProyecto(proyecto.id, proyecto));
    };


    return (
        <div className="row">
            <div className="col-12">
                <ProyectoInfo
                    cotizaciones_proyecto_list={cotizaciones}
                    proyecto={proyecto}
                    cotizaciones_permisos={cotizacion_permisos}
                />
            </div>
            <div className="col-12">
                <Tabs>
                    <TabList>
                        <Tab onClick={() => cargarDatos()}>Literales</Tab>
                        {
                            permisos.change &&
                            <Tab>Editar</Tab>
                        }
                        {
                            permisos_archivos_proyecto.list &&
                            <Tab>Documentos</Tab>
                        }
                        {
                            facturas.length > 0 &&
                            <Tab>Facturas</Tab>
                        }
                    </TabList>
                    <TabPanel>
                        <div className="row">
                            <div className="col-12 col-lg-3">
                                <LiteralModalCreate
                                    proyecto={proyecto}
                                    permisos_object={permisos_literales}
                                    cotizacion_pendiente_por_literal={null}
                                    callback={cargarDatos}
                                />
                                {/*{*/}
                                {/*    cotizacion_pendiente_por_literal &&*/}
                                {/*    <LiteralModalCreate*/}
                                {/*        callback={() => this.cargarDatos()}*/}
                                {/*        permisos_object={permisos_literales}*/}
                                {/*        cotizacion_pendiente_por_literal={{*/}
                                {/*            cotizacion: cotizacion_pendiente_por_literal.id,*/}
                                {/*            descripcion: cotizacion_pendiente_por_literal.descripcion_cotizacion*/}
                                {/*        }}*/}
                                {/*        {...this.props}*/}
                                {/*    />*/}
                                {/*}*/}
                                <TablaProyectoLiterales
                                    style={style}
                                    lista_literales={literales}
                                    onSelectItem={onLiteralSelect}
                                    select_literal_id={select_literal_id}
                                    proyecto={proyecto}
                                    permisos={permisos}
                                />
                            </div>
                            {
                                literal_seleccionado &&
                                <div className="col-12 col-lg-9">
                                    <LiteralDetail
                                        callbackCargarDatosProyecto={cargarDatos}
                                        clearCurrentLiteral={clearCurrentLiteral}
                                        literal={literal_seleccionado}
                                        proyecto={proyecto}
                                    />
                                </div>
                            }
                        </div>
                    </TabPanel>
                    {
                        permisos.change &&
                        <TabPanel>
                            <FormProyecto
                                onSubmit={onUpdateProyecto}
                                initialValues={proyecto}
                                permisos_object={permisos}
                            />
                        </TabPanel>
                    }
                    {
                        permisos_archivos_proyecto.list &&
                        <TabPanel>
                            <PanelArchivosProyecto
                                proyecto={proyecto}
                                permisos_archivos_proyecto={permisos_archivos_proyecto}
                                cargarProyecto={cargarDatos}
                            />
                        </TabPanel>
                    }
                    {
                        facturas.length > 0 &&
                        <TabPanel>
                            <FacturasProyecto facturas={facturas} style={style}/>
                        </TabPanel>
                    }
                </Tabs>
            </div>
        </div>
    );
});

class DetailA extends Component {
    render() {
        const {
            object,
            mis_permisos,
            literales_list,
            contizaciones_list,
        } = this.props;
        console.log('hola')
        const permisos = permisosAdapterDos(mis_permisos, permisos_view);
        const permisos_literales = permisosAdapterDos(mis_permisos, literales_permisos_view);
        const cotizacion_permisos = permisosAdapterDos(mis_permisos, cotizaciones_permisos_view);
        const archivos_proyecto_permisos = permisosAdapterDos(mis_permisos, archivos_proyecto_permisos_view);

        if (!object) {
            return <SinObjeto/>
        }

        const {select_literal_id} = this.state;
        const item_seleccionado = select_literal_id ? literales_list[select_literal_id] : null;

        let cotizacion_pendiente_por_literal = null;
        const cotizacion_pendiente_por_literal_list = _.map(
            _.pickBy(contizaciones_list, c => parseInt(c.crear_literal_id_proyecto) === object.id), e => e
        );
        if (cotizacion_pendiente_por_literal_list.length > 0) {
            cotizacion_pendiente_por_literal = cotizacion_pendiente_por_literal_list[0]
        }

        let cotizaciones_proyecto_list = _.map(_.pickBy(literales_list, e => e.cotizacion), e => {
            return (
                {
                    tipo: 'L',
                    cotizacion: e.cotizacion,
                    cotizacion_nro: e.cotizacion_nro,
                }
            )
        });

        if (object.cotizacion) {
            cotizaciones_proyecto_list = [...cotizaciones_proyecto_list, {
                tipo: 'P',
                cotizacion: object.cotizacion,
                cotizacion_nro: object.cotizacion_nro
            }];
        }

        return (
            <ValidarPermisos can_see={permisos.list} nombre='detalles de proyecto'>
                <div className="row">
                    <div className="col-12">
                        <ProyectoInfo cotizaciones_proyecto_list={cotizaciones_proyecto_list}
                                      proyecto={object}
                                      cotizaciones_permisos={cotizacion_permisos}/>
                    </div>
                    <div className="col-12">
                        <Tabs>
                            <TabList>
                                <Tab>Literales</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-12 col-lg-3">

                                        <TablaProyectoLiterales
                                            lista_literales={object.mis_literales}
                                            lista_literales2={_.map(literales_list, e => e)}
                                            onSelectItem={this.onLiteralSelect}
                                            select_literal_id={select_literal_id}
                                            proyecto={object}
                                            permisos={permisos}
                                        />
                                    </div>
                                    {
                                        item_seleccionado &&
                                        <div className="col-12 col-lg-9">
                                            <LiteralDetail
                                                mis_permisos={mis_permisos}
                                                callbackCargarDatosProyecto={() => this.cargarDatos()}
                                                clearCurrentLiteral={this.clearCurrentLiteral}
                                                id_literal={select_literal_id}
                                                proyecto={object}
                                            />
                                        </div>
                                    }
                                </div>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </ValidarPermisos>
        )
    }

}


export default Detail;