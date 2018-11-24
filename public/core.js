// public/core.js
var scotchTemperature = angular.module('scotchTemperature', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all temperatures and show them
    $http.get('/api/temperatures')
        .success(function(data) {
            $scope.temperatures = data;
            console.log(data.body);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTemperature = function() {
        $http.post('/api/temperatures', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.temperatures = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a temperature after checking it
    $scope.deleteTemperature = function(id) {
        $http.delete('/api/temperatures/' + id)
            .success(function(data) {
                $scope.temperatures = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}