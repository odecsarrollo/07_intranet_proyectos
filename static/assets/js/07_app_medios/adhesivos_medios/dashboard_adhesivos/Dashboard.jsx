import React, { Component } from 'react';
import EtiquetasMedios from '../components/etiquetas_medios/etiquetas_medios';
import StickersMedios from '../components/stickers_medios/stickers_medios';
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
                            Etiquetas
                        </Tab>
                        <Tab>
                            Stickers
                        </Tab>
                    </TabList>
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
                </Tabs>
            </div>
        )
    }
}

export default Dashboard;