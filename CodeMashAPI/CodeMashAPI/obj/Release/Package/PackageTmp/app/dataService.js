(function () {

    'use strict';

    angular
        .module('app')
        .factory('DataSvc', DataSvc);

    function DataSvc($http, $q) {

        return {
            getIds: _getIds,
            toggleFav: _toggleFav,
            getData: _getData
        }

        var sessions = [];

        function _getIds() {
            var deferred = $q.defer();
            $http.get('api/Data/GetIds')
            .then(function (ids) {
                deferred.resolve(ids);
            },
            function (error, status) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function _toggleFav(id) {
            var deferred = $q.defer();

            $http.post('api/Data/ToggleId?id=' + id)
            .then(function (fav) {
                deferred.resolve(fav);
            },
            function (error, status) {
                deferred.reject(error);
            })
            return deferred.promise;
        }

        function _getData(reload) {
            var deferred = $q.defer();

            if (reload == 1) {
                $http.get('https://cmprod-speakers.azurewebsites.net/api/SessionsData')
                .then(function (fav) {
                    deferred.resolve(fav);
                    sessions = fav;
                },
                function (error, status) {
                    deferred.reject(error);
                })
            } else {
                deferred.resolve(sessions);
            }
            
            return deferred.promise;
        }
    }
})();