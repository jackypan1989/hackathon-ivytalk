angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
	$scope.hello = 'hellosexxxx';
	Messenger.registerUser({
		name: 'Roger Kuo',
		userId: 'roger',
		gender: 'male'
	});
}]);