/**
 * Created by birger.roy on 12/2/2015.
 */

angular.module('ngWizmassNotifier').factory('ConnectionService', ['$q', '$rootScope', function($q, $rootScope) {
    // We return this object to anything injecting our service
    var Service = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    //todo: make this configurable
    var ws = new WebSocket('ws://dev4.wizmass.com:8080/');

    ws.onopen = function(){
        //console.log('Socket has been opened!');
    };

    ws.onmessage = function(message) {
        listener(JSON.parse(message.data));
    };

    function sendRequest(request) {
        var defer = $q.defer();
        var callbackId = getCallbackId();
        callbacks[callbackId] = {
            time: new Date(),
            cb:defer
        };
        request.callbackId = callbackId;
        //console.log('Sending request', request);
        ws.send(JSON.stringify(request));
        return defer.promise;
    }

    function listener(data) {
        var messageObj = data;
        //console.log('Received data from websocket: ', messageObj);
        // If an object exists with callbackId in our callbacks object, resolve it
        if(callbacks.hasOwnProperty(messageObj.callbackId)) {
            $rootScope.$apply(callbacks[messageObj.callbackId].cb.resolve(messageObj.data));
            delete callbacks[messageObj.callbackID];
        }
    }
    // This creates a new callback ID for a request
    function getCallbackId() {
        currentCallbackId += 1;
        if(currentCallbackId > 10000) {
            currentCallbackId = 0;
        }
        return currentCallbackId;
    }

    Service.sendRequest = function(request) {
        var promise = sendRequest(request);
        return promise;
    };

    Service.clearCallbacks = function() {
        callbacks = {};
    };

    return Service;
}]);
