import React, { Component } from 'react';
import EtiquetasMedios from '../components/etiquetas_medios/etiquetas_medios';
import StickersMedios from '../components/stickers_medios/stickers_medios';
import MovimientosEtiquetaMedios from '../components/adhesivos_movimientos_medios/adhesivos_movimientos_medios'
import UltimosMovimientosAdhesivosMedios from '../components/adhesivos_ultimos_movimientos_medios/adhesivos_ultimos_movimientos_medios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { tabIndex: 0 };
    }

    render() {
        return (
            <div>
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                    <TabList>
                        <Tab>
                            Movimientos
                        </Tab>
                        <Tab>
                            Etiquetas
                        </Tab>
                        <Tab>
                            Stickers
                        </Tab>
                        <Tab>
                            Reporte
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <div style={{ marginTop: '40px' }}>
                            <MovimientosEtiquetaMedios />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div style={{ marginTop: '40px' }}  >
                            <EtiquetasMedios />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div style={{ marginTop: '40px' }}>
                            <StickersMedios />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div style={{ marginTop: '40px' }}>
                            <UltimosMovimientosAdhesivosMedios />
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

export default Dashboard;