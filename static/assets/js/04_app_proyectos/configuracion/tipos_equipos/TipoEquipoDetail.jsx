import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import DetailLayout from "../../../00_utilities/components/ui/detail_layout/DetailLayout";
import useTengoPermisos from "../../../00_utilities/hooks/useTengoPermisos";
import * as actions from "../../../01_actions/01_index";
import {TIPOS_EQUIPOS} from "../../../permisos";
import ValidarPermisos from "../../../permisos/validar_permisos";
import TipoEquipoDetailDocumento from './TipoEquipoDetailDocumento';
import TipoEquipoClases from '../tipos_equipos_clases/TipoEquipoClaseCRUD';
import TipoEquipoCampos from '../tipos_equipos_campos/TipoEquipoCampoCRUD';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

const TipoEquipoDetail = props => {
    const dispatch = useDispatch();
    const {id} = props.match.params;
    const tipo_equipo = useSelector(state => state.tipos_equipos[id]);
    const cargarDatos = () => {
        dispatch(actions.fetchTipoEquipo(id));
    };
    useEffect(() => {
        if (permisos.detail) {
            cargarDatos();
        }
        return () => dispatch(actions.clearTIposEquipos());
    }, []);
    const permisos = useTengoPermisos(TIPOS_EQUIPOS);
    if (!tipo_equipo) {
        return <div>Cargando...</div>
    }
    return <ValidarPermisos can_see={permisos.detail} nombre='detalles de Tipo de Equipo'>
        <DetailLayout
            titulo={`Equipo ${tipo_equipo.to_string}`}
            info_items={[
                {
                    label: 'Creado Por',
                    text_value: tipo_equipo.creado_por_nombre,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Sigla',
                    text_value: tipo_equipo.sigla,
                    className: 'col-12 col-md-4 col-xl-3'
                },
                {
                    label: 'Activo',
                    icon_value: tipo_equipo.activo ? 'check-circle' : null,
                    className: 'col-12 col-md-4 col-xl-3'
                },
            ]}
        >
            <Tabs>
                <TabList>
                    <Tab>Documentos</Tab>
                    <Tab>Clases</Tab>
                    <Tab>Campos</Tab>
                </TabList>
                <TabPanel>
                    <TipoEquipoDetailDocumento
                        tipo_equipo={tipo_equipo}
                        permisos={permisos}
                        cargarTipoEquipo={() => cargarDatos()}
                    />
                </TabPanel>
                <TabPanel>
                    <TipoEquipoClases tipo_equipo={tipo_equipo}/>
                </TabPanel>
                <TabPanel>
                    <TipoEquipoCampos tipo_equipo={tipo_equipo}/>
                </TabPanel>
            </Tabs>
        </DetailLayout>
    </ValidarPermisos>
};

export default TipoEquipoDetail;