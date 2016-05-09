/**
 * Created by birger.roy@gmail.com on 12/17/2015.
 */

angular.module('ngWizmassNotifier').factory('Aggregation', function() {

    var Aggregator = function() {
        this.aggregator = '';
    };

    Aggregator.prototype = {

        setAggregator: function(aggregator) {
            this.aggregator = aggregator;
        },

        canHandle: function(notification) {
          return this.aggregator.canHandle(notification);
        },

        getAggregatedNotifications: function() {
            return this.aggregator.getAggregatedNotifications();
        },

        getName: function() {
            return this.aggregator.getName();
        },

        getAggregatedChainForNotification: function(guid) {
            return this.aggregator.getAggregatedChainForNotification(guid);
        },

        clear: function() {
            return this.aggregator.clear();
        }
    };

    var aggregators = [];

    var aggregation = {};

    aggregation.addAggregator = function(aggregator) {

        var found = false;

        angular.forEach(aggregators, function(item){
           if (item.name === aggregator.getName()) {
               found = true;
               return;
           }
        });

        if (found === false) {

            var newAggregator = new Aggregator();
            newAggregator.setAggregator(aggregator);

            aggregators.push({name: aggregator.getName(), aggregator: newAggregator});
        }
    };

    aggregation.aggregate = function(data) {

        var notifications = [];

        angular.forEach(data,function(notification){

            var handled = false;

            angular.forEach(aggregators, function(aggregator){

                if (aggregator.aggregator.canHandle(notification)) {
                    handled = true;
                    return;
                }
            });

            if (!handled) {
                //error...
                //notifications.push(notification);
            }

        },notifications);

        angular.forEach(aggregators, function(aggregator){

            var aggregated = aggregator.aggregator.getAggregatedNotifications();

            [].push.apply(notifications, aggregated);
        });

        return notifications;
    };

    aggregation.getAggregatedChainForNotification = function(aggregatorName,guid) {

        var chain = [];

        angular.forEach(aggregators, function(aggregator){

            if (aggregator.aggregator.getName() === aggregatorName) {
                chain = aggregator.aggregator.getAggregatedChainForNotification(guid);
                return;
            }
        },chain);

        return chain;
    };

    aggregation.clear = function() {

        angular.forEach(aggregators, function(aggregator){

            aggregator.aggregator.clear();

        });
    };

    return aggregation;

});
