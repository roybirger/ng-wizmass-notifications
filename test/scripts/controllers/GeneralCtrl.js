/**
 * Created by birger.roy@gmail.com on 12/2/2015.
 */

"use strict";

var wizmassNotificationsTestApp = angular.module('WizmassNotificationsTestApp', ['ngWizmassNotifier']);


wizmassNotificationsTestApp.controller('GeneralCtrl',['$scope', 'Notifier', function ($scope,Notifier) {


        var token = {
            token:    "bb2ae5b2c3623290e682b48c7cc05b98",
            user_guid: 73
        };

        var myCommentAggregator = function() {

            var notifications = [];

            var name = 'myCommentAggregator';

            this.canHandle = function(notification) {

                if (notification.aggregation_key === 'comment_add_sub') {

                    var key = 'comment_add_sub_' + notification.comment_guid;

                    var handled = false;

                    angular.forEach(notifications,function(current){

                        if (current.key === key) {
                            current.value.count++;
                            current.value.aggregateChain.push(notification.notification_guid);
                            handled = true;
                            return;
                        }

                    });

                    if (!handled) {
                        notification.count = 1;
                        notification.aggregateChain = [notification.notification_guid];
                        notification.aggregatorName = name;
                        notifications.push({key: key, value: notification});
                    }

                    return true;

                } else {

                    return false;
                }

            };

            this.getAggregatedNotifications = function() {

                var notificationsToReturn = [];

                angular.forEach(notifications,function(notification){

                    var text = notification.value.count === 1 ? 'my comment has a new response' : 'my comment has ' + notification.value.count + ' new responses';

                    notification.value.text = text;

                    notificationsToReturn.push(notification.value);

                },notificationsToReturn);

                return notificationsToReturn;

            };

            this.getName = function() {
                return name;
            };

            this.getAggregatedChainForNotification = function(notificationGuid) {

                var chain = [];

                angular.forEach(notifications,function(notification){

                    if (notification.value.notification_guid === notificationGuid) {
                        chain = notification.value.aggregateChain;
                        return;
                    }

                },chain);

                return chain;
            };

            this.clear = function() {

                notifications = [];

            }
        };

        Notifier.addAggregator(new myCommentAggregator());

        $scope.register = function() {
            console.log('sending request...');
            Notifier.registerForNotifications(token).then(function(data){

                angular.forEach(data, function (notification) {
                    alert(notification.text);
                    Notifier.markAsRead(token, notification);

                });

                alertAndFetch();

            });
        };

        var alertAndFetch = function(data) {

            if (typeof data !== 'undefined') {

                angular.forEach(data, function (notification) {
                    alert(notification.text);
                    //Notifier.markAsRead(notification.guid)

                });

            }


            Notifier.fetchNotifications(token).then(function(data){

                alertAndFetch(data);

            })

        }

    }
]);