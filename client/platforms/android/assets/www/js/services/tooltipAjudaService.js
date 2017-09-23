(function() {
    'use strict';
    
        angular
            .module('starter')
            .factory('tooltipAjuda', tooltipAjuda);
    
        tooltipAjuda.$inject = ['$ionicPopover'];
        function tooltipAjuda($ionicPopover) {
            var service = {
                create:create
            };
            
            return service;
    
            ////////////////
            function create(scope, text) {
                scope.tooltip = {
                    itens: itens
                };
    
                var template = 
                    '<ion-popover-view>\
                        <ion-content ng-click="tooltip.hide">\
                            <div class="center">\
                                {{popover.text}}\
                            </div>\
                        </ion-content>\
                    </ion-popover-view>';
    
                scope.tooltip.delegate = $ionicPopover.fromTemplate(template,
                { scope: scope });
    
                scope.tooltip.action = function () {
                    scope.tooltip.delegate.hide();
                }
    
                return scope.tooltip.delegate;
            }
        }
    })();