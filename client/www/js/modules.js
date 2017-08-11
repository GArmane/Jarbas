(function() {
    'use strict';

    angular.module('starter.services', [])
           .module('starter.controllers', [])
           .module('starter', ['ionic', 'starter.controllers', 'starter.services']);
})();

