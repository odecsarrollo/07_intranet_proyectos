import "react-table/react-table.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'tether/dist/js/tether';
import './../../css/custom.css';
import 'react-pivottable/pivottable.css';
import 'webdatarocks/webdatarocks.min.css';
import 'webdatarocks/webdatarocks.toolbar.min';
import 'react-tabs/style/react-tabs.css';

import {createMuiTheme} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import indigo from '@material-ui/core/colors/indigo';


import {library} from '@fortawesome/fontawesome-svg-core'
import {
    // Iconos PRO reemplazados por alternativas gratuitas:
    // faCodeMerge -> faCode
    // faSpinnerThird -> faSpinner
    // faUserHardHat -> faHardHat
    // faConveyorBelt -> faBelt
    // faSuitcaseRolling -> faSuitcase (ya existe)
    // faAnalytics -> faChartLine
    // faAbacus -> faCalculator
    // faInboxOut -> faInbox
    // faAlarmClock -> faClock
    // faSignOut -> faSignOutAlt
    faCode,
    faEyeSlash,
    faBarcode,
    faReceipt,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faPuzzlePiece,
    faSignOutAlt,
    faSpinner,
    faBars,
    faHome,
    faClock,
    faAngleLeft,
    faAngleDown,
    faSearch,
    faProjectDiagram,
    faAngleUp,
    faTrash,
    faEdit,
    faEye,
    faUsers,
    faUser,
    faLock,
    faObjectGroup,
    faHardHat,
    faSuitcase,
    faMoneyBillAlt,
    faFile,
    faBook,
    faPlusCircle,
    faMinusCircle,
    faDownload,
    faSyncAlt,
    faTimes,
    faTimesCircle,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faCog, // faConveyorBelt reemplazado por faCog (faBelt no existe)
    faComments,
    faCoins,
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInbox,
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    faChartLine,
    faCalculator
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faEyeSlash,
    faBarcode,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faSuitcase, // faSuitcaseRolling reemplazado
    faPuzzlePiece,
    faSignOutAlt, // faSignOut reemplazado
    faSpinner, // faSpinnerThird reemplazado
    faComments,
    faBars,
    faCoins,
    faHome,
    faClock, // faAlarmClock reemplazado
    faAngleLeft,
    faAngleDown,
    faSearch,
    faProjectDiagram,
    faAngleUp,
    faTrash,
    faEdit,
    faEye,
    faUsers,
    faUser,
    faLock,
    faReceipt,
    faObjectGroup,
    faHardHat, // faUserHardHat reemplazado
    faSuitcase,
    faMoneyBillAlt,
    faFile,
    faBook,
    faPlusCircle,
    faMinusCircle,
    faDownload,
    faSyncAlt,
    faTimes,
    faTimesCircle,
    faCheck,
    faSquare,
    faCheckSquare,
    faExclamation,
    faExclamationCircle,
    faCheckCircle,
    faTasks,
    faPlus,
    faQrcode,
    faDesktop,
    faMap,
    faExchangeAlt,
    faCog, // faConveyorBelt reemplazado por faCog
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInbox, // faInboxOut reemplazado
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    faCode, // faCodeMerge reemplazado
    faChartLine, // faAnalytics reemplazado
    faCalculator // faAbacus reemplazado
);


const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        fontSize: 12,
    },
    palette: {
        primary: orange,
        secondary: indigo,
        error: red,
        contrastThreshold: 3,
        tonalOffset: 0.2,
    },
});

export default theme;