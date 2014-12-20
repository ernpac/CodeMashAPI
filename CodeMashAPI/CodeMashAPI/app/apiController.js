(function () {

    'use strict';

    angular
        .module('app')
        .controller('APIController', APIController);

    function APIController($http, DataSvc) {
        var _this = this;
        _this.model = [];
        _this.loading = true;
        _this.filtered = false;
        _this.filterdSessions = [];

        DataSvc.getIds()
            .then(function (ids) {
                _this.model.favorites = ids.data;

                //$http.get('https://cmprod-speakers.azurewebsites.net/api/SessionsData')

                DataSvc.getData(1)
                .then(function (sessions) {
                    _this.sessions = sessions.data;
                    _this.model.dates = _.uniq(_.pluck(sessions.data, 'SessionStartTime'));
                },
                function (error, status) {
                    //handle error
                }).then(function () {
                    _this.loading = false;
                });

            },
            function (error) {
                alert(error.data.message);
            });

        //_this.filterForDate = function () {
        //    _this.sessions = _.where(_this.sessions, { SessionStartTime: _this.dateFilter });
        //}
        
        _this.viewFavs = function () {
            if (!_this.filtered) {
                _.each(_this.model.favorites, function (fav) {
                    _.find(_this.sessions, function (session) {
                        if (session.Id == fav.codemashid) {
                            _this.filterdSessions.push(session);
                        }
                    });
                })
                _this.sessions = _this.filterdSessions;
                
            } else {
                _this.filterdSessions = [];
                DataSvc.getData(0)
                .then(function (sessions) {
                    _this.sessions = sessions.data;
                });
            }
            _this.filtered = !_this.filtered;
        }

        _this.addFav = function(id){
            DataSvc.toggleFav(id)
            .then(function (fav) {
                if (fav.data != 'null')
                {
                    if (fav.data.id != null) {
                        _this.model.favorites.push(fav.data);
                    }
                }                
            },
            function (error) {
                alert(error.data.message);
            })
        }

        _this.deleteFav = function (id) {
            DataSvc.toggleFav(id)
            .then(function (fav) {
                DataSvc.getIds()
                .then(function (ids) {
                    _this.model.favorites = ids.data;
                });
            },
            function (error) {
                alert(error.data.message);
            })
        }

        _this.checkFav = function (id) {
            if(_.where(_this.model.favorites, { codemashid: id }).length > 0)
            {
                return true;
            }
        }
    }
})();