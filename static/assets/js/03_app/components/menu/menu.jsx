import React from 'react';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import MenuMaestras from './00_maestras';

const style = {
    display: 'inline-block',
    margin: '16px 32px 16px 0',
};

const Menu = () => (
    <Toolbar>
        <ToolbarGroup firstChild={true}>
            <Paper style={style}>
                <MenuMaestras/>
            </Paper>
        </ToolbarGroup>
    </Toolbar>
)

export default Menu;