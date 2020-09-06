import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import DetailLayout from "../../../00_utilities/components/ui/detail_layout/DetailLayout";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import * as actions from "../../../01_actions/01_index";
import {EQUIPOS_PROYECTOS} from "../../../permisos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import EquipoGarantiaCRUD from "../equipos_garantias/EquipoGarantiaCRUD";
import EquipoDetailRutinaTable from "./EquipoDetailRutinaTable";
import EquipoDetailDocumentoTable from "./EquipoDetailDocumentoTable";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

const EquipoDetail = props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const equipo = useSelector(state => state.equipos_proyectos[id]);
    const cargarDatos = () => {
        dispatch(actions.fetchEquipoProyecto(id));
    };
    useEffect(() => {
        if (permisos.detail) {
            cargarDatos();
        }
        return () => dispatch(actions.clearEquiposProyectos());
    }, []);
    const permisos = useTengoPermisos(EQUIPOS_PROYECTOS);
    if (!equipo) {
        return <div>Cargando...</div>
    }
    const campos_valores = equipo.campos_valores.map(c =>
        ({
            label: c.label,
            text_value: c.unidad_medida ? `${c.valor} ${c.unidad_medida}` : c.valor,
            className: `col-12 col-md-${c.tamano_columna}`
        })
    );

    return <ValidarPermisos can_see={permisos.detail} nombre='detalles de Equipo'>
        <DetailLayout
            titulo={`Equipo ${equipo.to_string}`}
            info_items={[
                {
                    label: 'Nombre',
                    text_value: equipo.nombre,
                    className: 'col-12 col-md-8 col-xl-6'
                },
                {
                    label: 'Identificador',
                    text_value: equipo.identificador,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Literal',
                    text_value: equipo.id_literal,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Tipo Equipo',
                    text_value: equipo.tipo_equipo_clase.tipo_equipo_nombre,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Clase',
                    text_value: equipo.tipo_equipo_clase.nombre,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                ...campos_valores
            ]}
        >
            <Tabs>
                <TabList>
                    <Tab>Documentos</Tab>
                    <Tab>Rutinas</Tab>
                    <Tab>Garantías ({_.size(equipo.garantias)})</Tab>
                    <Tab>Ordenes de Servicio</Tab>
                </TabList>
                <TabPanel>
                    <EquipoDetailDocumentoTable
                        equipo={equipo}
                    />
                </TabPanel>
                <TabPanel>
                    <EquipoDetailRutinaTable
                        equipo={equipo}
                    />
                </TabPanel>
                <TabPanel>
                    <EquipoGarantiaCRUD equipo={equipo}/>
                </TabPanel>
                <TabPanel>
                    Aquí irían los eventos
                </TabPanel>
            </Tabs>
        </DetailLayout>
    </ValidarPermisos>
};

export default EquipoDetail;