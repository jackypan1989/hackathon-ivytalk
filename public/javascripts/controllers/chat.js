angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = "";
		$scope.userId = prompt("你的暱稱?", "TestUser"),
		$scope.targetId = prompt("想和誰說話?", "Ivy");

		var appendMsg = function(){
			$scope.$apply(function() {
				$scope.messages = Messenger.convs[$scope.targetId].messages || null; 
				$(".chat-block").animate({scrollTop: $(".message-block").height()}, 100);
			});
		}

		Messenger.registerUser({
			name: $scope.userId,
			userId: $scope.userId,
			gender: $scope.targetId
		});

		Messenger.registerListener(function (from, message) {
			console.log(from);
			console.log(message);
		});

		$scope.sendMessage = function(msg){
			console.log($scope.messages);
			if(msg) {
				console.log("sendMessage: "+msg);
				Messenger.createMessage($scope.targetId, msg, function(err, message){
					if(err) alert(err);
					appendMsg();
				});
				$scope.textToSend = "";
			}
		};

		$scope.isMyMessage = function(msg) {
			return (Messenger.user._id && msg.from === Messenger.user._id);
		}
	

		$scope.keyPress = function(event){
			if(event.which === 13)
				$scope.sendMessage($scope.textToSend);
		}

		
		
		
}]);