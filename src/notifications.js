/**
 * Created by birger.roy@gmail.com on 12/2/2015.
 */

var ngWizmassNotifier = angular.module('ngWizmassNotifier', []);


ngWizmassNotifier.service('Notifier', ['Request', 'Aggregation', '$q', function (Request, Aggregation, $q) {

    var Notifier = this;

    var currentNotifications = [];

    this.registerForNotifications = function(token) {

        var deferred = $q.defer();

        Aggregation.clear();
        Request.clearCallbacks();

        Request.registerForNotificationRequest(token).then(function (data){

            var notifications = Aggregation.aggregate(data);

            [].push.apply(currentNotifications, notifications);

            deferred.resolve(currentNotifications);

        });

        return deferred.promise;
    };

    this.fetchNotifications = function(token) {

        var deferred = $q.defer();

        //Aggregation.clear();
        Request.clearCallbacks();

        Request.fetchNotifications(token).then(function(data) {

            currentNotifications = Aggregation.aggregate(data);

            deferred.resolve(currentNotifications);

        });

        return deferred.promise;

    };

    this.markAsRead = function (token, notification) {

        var chain = Aggregation.getAggregatedChainForNotification(notification.aggregatorName, notification.notification_guid);

        return Request.markAsRead(token, chain);

    };

    this.addAggregator = function (aggregator) {

        Aggregation.addAggregator(aggregator);

    };


    return Notifier;
}]);