angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = "";
		$scope.userId = prompt("你的暱稱?", "TestUser"),
		$scope.targetId = prompt("想和誰說話?", "Ivy");

		Messenger.registerUser({
			name: $scope.userId,
			userId: $scope.userId,
			gender: 'male'
		}, function () {
			Messenger.initConv($scope.targetId);
			$scope.conv = Messenger.convs[$scope.targetId];
		});

		var appendMsg = function () {
			$scope.$apply(function () {
				$(".message-block").animate({scrollTop: $(".message-block").prop("scrollHeight")}, 100);
			});	
		};

		Messenger.registerListener(function (from, message) {
			console.log(from);
			console.log(message);
		});

		$scope.sendMessage = function (msg){
			if(msg) {
				Messenger.createMessage($scope.targetId, msg, function(err, message){
					if(err) alert(err);
					appendMsg();
				});
				$scope.textToSend = '';
			}
		};

		$scope.isMyMessage = function (msg) {
			return (Messenger.user._id && msg.from === Messenger.user._id);
		};
	
		$scope.keyPress = function(event){
			if(event.which === 13) {
				$scope.sendMessage($scope.textToSend);
				$scope.textToSend = '';
		};	
}]);