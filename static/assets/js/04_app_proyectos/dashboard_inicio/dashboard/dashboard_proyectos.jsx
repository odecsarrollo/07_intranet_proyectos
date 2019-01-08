import React, {Component, Fragment} from 'react';
import TareasPendientesList from '../tareas_fases/tareas_pendientes';
import LiteralesSeguimiento from '../literales_seguimiento/literales_seguimiento';
import MatrixProyectos from '../matrix_proyectos/matrix_proyectos';
import {connect} from "react-redux";
import * as actions from "../../../01_actions/01_index";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

const table_style = {
    th: {
        padding: 0,
        margin: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
    },
    td: {
        padding: 0,
        margin: 0,
        paddingLeft: '4px',
        paddingRight: '4px',
    },
    table: {
        fontSize: '12px'
    }
};

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {tabIndex: 0};
    }

    render() {
        return (
            <div className='col-12'>
                <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({tabIndex})}>
                    <TabList>
                        <Tab>
                            Mis Tareas
                        </Tab>
                        <Tab>
                            Supervisar
                        </Tab>

                        <Tab>
                            Seguimiento Literales
                        </Tab>

                        <Tab>
                            Prueba
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <div className="row">
                            <TareasPendientesList
                                table_style={table_style}
                                modo={1}
                            />
                        </div>
                    </TabPanel>


                    <TabPanel>
                        <div className="row">
                            <TareasPendientesList
                                table_style={table_style}
                                modo={2}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="row">
                            <LiteralesSeguimiento
                                table_style={table_style}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="row">
                            <MatrixProyectos
                                table_style={table_style}
                            />
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        )
    }
}

function mapPropsToState(state, ownProps) {
    return {
        mis_permisos: state.mis_permisos
    }
}

export default connect(mapPropsToState, actions)(Dashboard)