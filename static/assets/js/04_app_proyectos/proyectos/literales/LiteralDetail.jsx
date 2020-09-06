import React, {Fragment, memo} from 'react';
import {fechaFormatoUno, pesosColombianos} from "../../../00_utilities/common";
import {ListadoMaterialesLiteralTabla} from './ProyectoLiteralMaterialTabla';
import {ListadoManoObralLiteralTabla} from './ProyectoLiteralManoObraTabla';
import SeguimientoLiteral from '../seguimientos_proyectos/components/seguimiento_literal';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import Form from './forms/ProyectoLiteralForm';
import * as actions from "../../../01_actions/01_index";
import {
    LITERALES,
    PROYECTOS,
    ARCHIVOS_LITERALES
} from "../../../permisos";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import LiteralDetailDocumento from './LiteralDetailDocumento';
import EquipoCRUD from "../equipos/EquipoCRUD";

const Detail = memo(props => {
    const {
        literal,
        clearCurrentLiteral,
        callbackCargarDatosProyecto,
        proyecto,
        history
    } = props;
    const dispatch = useDispatch();
    const {
        materiales,
        mis_horas_trabajadas,
        mis_horas_trabajadas_iniciales
    } = literal;
    const onUpdateLiteral = (literal) => {
        const callback = () => {
            if (clearCurrentLiteral) {
                clearCurrentLiteral();
            }
            if (callbackCargarDatosProyecto) {
                callbackCargarDatosProyecto();
            }
        };
        dispatch(actions.updateLiteral(literal.id, literal, {callback}));
    };

    const onDeleteLiteral = (literal) => {
        const callback = () => {
            if (clearCurrentLiteral) {
                clearCurrentLiteral();
            }
            if (callbackCargarDatosProyecto) {
                callbackCargarDatosProyecto();
            }
        };
        dispatch(actions.deleteLiteral(literal.id, {callback}))
    };


    const permisos_proyecto = useTengoPermisos(PROYECTOS);
    const permisos_literales = useTengoPermisos(LITERALES);
    const permisos_archivos_literal = useTengoPermisos(ARCHIVOS_LITERALES);

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
                        {literal.cotizacion && <Fragment>
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
                        </Fragment>}
                        {permisos_proyecto.costo_materiales && <div className="col-12 col-md-4">
                            <h6 className='h6-response'>Costo
                                Materiales: <small>{pesosColombianos(literal.costo_materiales)}</small>
                            </h6>
                        </div>}
                        {permisos_proyecto.costo_mano_obra && <div className="col-12 col-md-4">
                            <h6 className='h6-response'>Costo
                                Mano
                                Obra: <small>{pesosColombianos(Number(literal.costo_mano_obra) + Number(literal.costo_mano_obra_inicial))}</small>
                            </h6>
                        </div>}
                        {permisos_proyecto.costo && <div className="col-12 col-md-4">
                            <h6 className='h6-response'>Costo
                                Total: <small>{pesosColombianos(Number(literal.costo_mano_obra_inicial) + Number(literal.costo_mano_obra) + Number(literal.costo_materiales))}</small>
                            </h6>
                        </div>}
                    </div>
                </div>
            </div>
            <Tabs>
                <TabList>
                    <Tab>Equipos</Tab>
                    <Tab>Materiales</Tab>
                    <Tab>Mano de Obra</Tab>
                    <Tab>Seguimiento</Tab>
                    {permisos_literales.change && <Tab>Editar</Tab>}
                    {permisos_archivos_literal.list && <Tab>Documentos</Tab>}
                </TabList>
                <TabPanel>
                    <EquipoCRUD literal={literal} history={history}/>
                </TabPanel>
                <TabPanel>
                    <ListadoMaterialesLiteralTabla
                        materiales={materiales}
                        permisos_proyecto={permisos_proyecto}
                    />
                </TabPanel>
                <TabPanel>
                    <ListadoManoObralLiteralTabla
                        horas_iniciales={mis_horas_trabajadas_iniciales}
                        horas={mis_horas_trabajadas}
                    />
                </TabPanel>
                <TabPanel>
                    <SeguimientoLiteral id_literal={literal.id} proyecto_permisos={permisos_proyecto}/>
                </TabPanel>
                {permisos_literales.change && <TabPanel>
                    <Form
                        cargarProyecto={callbackCargarDatosProyecto}
                        proyecto={proyecto}
                        initialValues={literal}
                        onSubmit={onUpdateLiteral}
                        onDelete={onDeleteLiteral}
                    />
                </TabPanel>}
                {permisos_archivos_literal.list && <TabPanel>
                    <LiteralDetailDocumento
                        literal={literal}
                        cargarLiteral={callbackCargarDatosProyecto}
                        permisos={permisos_archivos_literal}
                    />
                </TabPanel>}
            </Tabs>
        </Fragment>
    )
});
export default Detail;