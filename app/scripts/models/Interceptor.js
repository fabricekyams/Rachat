define([
	'scripts/app'
	], function (app,DC) {
	app.factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                // do something on success
                // todo hide the spinner
                alert('stop spinner');
                return response;

            }, function (response) {
                // do something on error
                // todo hide the spinner
                alert('stop spinner');
                return $q.reject(response);
            });
        };
    });

    app.config(function ($httpProvider) {
        $httpProvider.responseInterceptors.push('myHttpInterceptor');
        var spinnerFunction = function (data, headersGetter) {
            // todo start the spinner here
            
            alert('start spinner');
            return data;
        };
        $httpProvider.defaults.transformRequest.push(spinnerFunction);
    })
});
