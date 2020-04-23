const initialState = {
    mi_cuenta: JSON.parse(localStorage.getItem("mi_cuenta")),
    mis_permisos: JSON.parse(localStorage.getItem("mis_permisos")),
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    errors: {},
};


export default function auth(state = initialState, action) {
    switch (action.type) {

        case 'USER_LOADING':
            return {...state, isLoading: true};

        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.user,
            };
        case 'NOT_USER_LOADED':
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
            };
        case 'LOGIN_SUCCESSFUL':
            localStorage.setItem("token", action.data.token);
            localStorage.setItem("mi_cuenta", action.data.mi_cuenta ? JSON.stringify(action.data.mi_cuenta) : null);
            localStorage.setItem("mis_permisos", []);
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};

        case 'AUTHENTICATION_ERROR':
        case 'LOGIN_FAILED':
        case 'LOGOUT_SUCCESSFUL':
            localStorage.removeItem("token");
            localStorage.removeItem("mi_cuenta");
            localStorage.removeItem("mis_permisos");
            return {
                ...state,
                errors: action.data,
                token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                mi_cuenta: null,
                mis_permisos: null
            };

        default:
            return state;
    }
}