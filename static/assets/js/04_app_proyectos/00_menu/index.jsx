import React from 'react';
import MenuBase from '../../00_utilities/components/ui/menu/menu';
import Consultas from './consultas';

const Menu = () => {
    return (
        <MenuBase>
            {mis_permisos => {
                return (
                    <Consultas/>
                )
            }}
        </MenuBase>
    )
};

export default Menu;