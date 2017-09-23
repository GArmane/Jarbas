(function () {
    'use strict';

    angular
        .module('exceptionOverwrite', [])
        .factory('$exceptionHandler', angularHandler);

    window.defineExceptionHandler = defineExceptionHandler;
    var orig = window.onerror;
    window.onerror = windowHandler;
    var handler = function () {};

    if (typeof orig != 'function')
        orig = function () {};

    function windowHandler(msg, url, lineNo, columnNo, error) {
        try {
            handler();
            orig(msg, url, lineNo, columnNo, error);
        } catch (exc) {
            alert('Ocorrou um erro no aplicativo!');
            console.error('JARBAS - Erro no Angular! ' + exc);
        }
    }

    function defineExceptionHandler(hndlr) {
        handler = hndlr;
    }

    angularHandler.$inject = ['$log'];
    
    function angularHandler($log) {
        return function (exception, cause) {
            windowHandler(exception, '', '', '', cause);
            $log.error(exception, cause);
        };
    }
})();
