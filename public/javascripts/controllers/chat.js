angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = "";
		
		var name = userId = prompt("你的暱稱?", "TestUser"),
			targetId = prompt("想和誰說話?", "Ivy");

		Messenger.registerUser({
			name: name,
			userId: userId,
			gender: 'male'
		}, function () {
			Messenger.initConv(targetId);
			$scope.conv = Messenger.convs[targetId];
		});

		var appendMsg = function(){
			$scope.$apply(function() {
				$(".chat-block").animate({scrollTop: $(".message-block").height()}, 100);
			});	
		}

		Messenger.registerListener(function (from, message) {
			console.log(from);
			console.log(message);
		});

		$scope.sendMessage = function(msg){
			//console.log($scope.messages);
			if(msg) {
				console.log("sendMessage: "+msg);
				Messenger.createMessage(targetId, msg, function (err, message) {
					if(err) return alert(err);
					appendMsg();
					
				});
				$scope.textToSend = "";
			}
		};

		$scope.isMyMessage = function(msg) {
			//console.log(msg);
			//console.log("isMyMessage: " + msg + " : " + Messenger.user._id)
			return (Messenger.user._id && msg.from === Messenger.user._id);
		}

		

		$scope.keyPress = function(event){
			// console.log(event.which);
			if(event.which === 13)
				$scope.sendMessage($scope.textToSend);
		}

		
		
		
}]);