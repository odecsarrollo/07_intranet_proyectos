import React, {useState, useEffect, memo} from 'react';
import {useSelector, useDispatch} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {SinObjeto} from "../../../00_utilities/templates/fragmentos";
import TablaProyectoLiterales from '../literales/components/ProyectoLiteralTabla';
import FormProyecto from './forms/ProyectoDetailForm';
import FacturasProyecto from './ProyectoFacturaList';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
    PROYECTOS,
    LITERALES,
    COTIZACIONES,
    ARCHIVOS_PROYECTOS,
} from "../../../permisos";
import LiteralModalCreate from '../literales/components/ProyectoLiteralModal';
import LiteralDetail from '../literales/components/LiteralDetail';
import ProyectoInfo from './ProyectoDetailInfo';
import ProyectoDetailCotizacionRelacionada from './ProyectoDetailCotizacionRelacionada';
import PanelArchivosProyecto from '../archivos/proyectos/ProyectoDocumentoList';
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import Typography from "@material-ui/core/Typography";
import CargarDatos from "../../../00_utilities/components/system/cargar_datos";

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
        dispatch(actions.fetchProyecto(id));
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
                <Typography variant="h3" color="inherit" noWrap>
                    Proyecto {proyecto.id_proyecto}
                </Typography>
            </div>
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
                        {proyecto.cotizaciones.length > 0 &&
                        <Tab onClick={() => cargarDatos()}>Cotizaciones Relacionadas</Tab>}
                        {permisos.change && <Tab>Editar</Tab>}
                        {permisos_archivos_proyecto.list && <Tab>Documentos</Tab>}
                        {facturas.length > 0 && <Tab>Facturas</Tab>}
                    </TabList>

                    <TabPanel>
                        <div className="row">
                            <div className="col-12 col-lg-4">
                                <LiteralModalCreate
                                    proyecto={proyecto}
                                    permisos_object={permisos_literales}
                                    cotizacion_pendiente_por_literal={null}
                                    callback={cargarDatos}
                                />
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
                                <div className="col-12 col-lg-8">
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

                    {proyecto.cotizaciones.length > 0 &&
                    <TabPanel>
                        <ProyectoDetailCotizacionRelacionada
                            proyecto={proyecto}
                        />
                    </TabPanel>}

                    {permisos.change &&
                    <TabPanel>
                        <FormProyecto
                            onSubmit={onUpdateProyecto}
                            initialValues={proyecto}
                            permisos_object={permisos}
                        />
                    </TabPanel>}

                    {permisos_archivos_proyecto.list &&
                    <TabPanel>
                        <PanelArchivosProyecto
                            proyecto={proyecto}
                            permisos_archivos_proyecto={permisos_archivos_proyecto}
                            cargarProyecto={cargarDatos}
                        />
                    </TabPanel>}
                    {facturas.length > 0 && <TabPanel><FacturasProyecto facturas={facturas} style={style}/></TabPanel>}
                </Tabs>
            </div>
            <CargarDatos
                cargarDatos={cargarDatos}
            />
        </div>
    );
});

export default Detail;