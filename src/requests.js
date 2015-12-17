/**
 * Created by birger.roy@gmail.com on 12/2/2015.
 */

angular.module('ngWizmassNotifier').factory('Request', ['ConnectionService', function(ConnectionService) {

    var request = {};

    request.registerForNotificationRequest = function(token) {

        var request = {
            type: 'register',
            token: token
        };

        return ConnectionService.sendRequest(request);
    };

    request.fetchNotifications = function(token) {

        var request = {
            type: 'fetch',
            token: token
        };

        return ConnectionService.sendRequest(request);

    };

    request.markAsRead = function(token, guids) {

        var request = {
            type: 'mark_as_read',
            token: token,
            notificationGuids: guids
        };

        return ConnectionService.sendRequest(request);
    };

    request.clearCallbacks = function() {

        ConnectionService.clearCallbacks();

    };

    return request;

}]);
