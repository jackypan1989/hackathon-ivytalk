angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = '';
		$scope.userId = prompt('你的暱稱?', 'roger'),
		$scope.targetId = prompt('想和誰說話?', 'ivy');

		var appendMsg = function () {
			$scope.$apply(function () {
				$('.chat-block').animate({scrollTop: $('.message-block').height()}, 100);
			});	
		};

		Messenger.registerUser({
			name: $scope.userId,
			userId: $scope.userId,
			gender: 'male'
		}, function () {
			Messenger.initConv($scope.targetId);
			$scope.conv = Messenger.convs[$scope.targetId];
		});

		Messenger.registerListener(function (from, message) {
			var targetId = from.userId;
			// Messenger.pushMessage(targetId, message);
			if ($scope.targetId !== targetId) return;
			appendMsg();
		});

		$scope.sendMessage = function (msg){
			if(msg) {
				Messenger.createMessage($scope.targetId, msg, function (err, message) {
					if(err) return alert(err.err_description);
					appendMsg();
				});
				$scope.textToSend = "";
			}
		};

		$scope.isMyMessage = function (msg) {
			return (Messenger.user._id && msg.from === Messenger.user._id);
		};
	
		$scope.keyPress = function(event){
			if(event.which === 13) {
				$scope.sendMessage($scope.textToSend);
			}
		};	
}]);