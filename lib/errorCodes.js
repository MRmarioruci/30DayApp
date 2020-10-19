var error = exports;
let ERROR_CODES = {
    UNKNOWN_ERROR: 											{'code':-1, 'data':'Unknown Error'},
    INVALID_PARAMS: 										{'code':-2, 'data':'params'},
    NOT_LOGGED: 										    {'code':-3, 'data':'log'},
    QUERY: 										            {'code':-4, 'data':'err'},
};
error.getError = function (error) {
    /* If the error was not set then return: UNKNOWN_ERROR */
    if( !error ){
        return ERROR_CODES['UNKNOWN_ERROR'];
    }
    return  ERROR_CODES[error];
};