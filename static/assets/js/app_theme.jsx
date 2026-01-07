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

import {createTheme} from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import indigo from '@material-ui/core/colors/indigo';


import {library} from '@fortawesome/fontawesome-svg-core'
import {
    // faCodeMerge, // No disponible en free-solid-svg-icons - usar faCodeBranch o faGitAlt
    faEyeSlash,
    faBarcode,
    faReceipt,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faPuzzlePiece,
    // faSignOut, // No disponible en free-solid-svg-icons - usar faSignOutAlt
    faSignOutAlt,
    // faSpinnerThird, // No disponible en free-solid-svg-icons - usar faSpinner
    faSpinner,
    faBars,
    faHome,
    // faAlarmClock, // No disponible en free-solid-svg-icons - usar faClock
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
    // faUserHardHat, // No disponible en free-solid-svg-icons - usar faHardHat
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
    // faConveyorBelt, // No disponible en free-solid-svg-icons - usar faBoxes
    faBoxes,
    faComments,
    faSuitcaseRolling,
    faCoins,
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    // faInboxOut, // No disponible en free-solid-svg-icons - usar faInbox
    faInbox,
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    // faAnalytics, // No disponible en free-solid-svg-icons - usar faChartLine
    faChartLine,
    // faAbacus // No disponible en free-solid-svg-icons - usar faCalculator
    faCalculator
} from '@fortawesome/free-solid-svg-icons';
// import {far} from "@fortawesome/pro-regular-svg-icons"; // Comentado - requiere FontAwesome Pro
// library.add(far); // Comentado - requiere FontAwesome Pro

library.add(
    faEyeSlash,
    faBarcode,
    faAddressBook,
    faWrench,
    faCogs,
    faShoppingCart,
    faSuitcaseRolling,
    faPuzzlePiece,
    faSignOutAlt, // Reemplazo de faSignOut
    faSpinner, // Reemplazo de faSpinnerThird
    faComments,
    faBars,
    faCoins,
    faHome,
    faClock, // Reemplazo de faAlarmClock
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
    faHardHat, // Reemplazo de faUserHardHat
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
    faBoxes, // Reemplazo de faConveyorBelt
    faLaptopCode,
    faInfoCircle,
    faPhone,
    faAt,
    faArrowCircleUp,
    faArrowCircleDown,
    faFileImage,
    faInbox, // Reemplazo de faInboxOut
    faThumbsDown,
    faThumbsUp,
    faHistory,
    faArrowsAlt,
    faChevronDown,
    faLink,
    faEraser,
    faPaste,
    faChartLine, // Reemplazo de faAnalytics
    faCalculator // Reemplazo de faAbacus
);


const theme = createTheme({
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