angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = "";
		
		var name = userId = prompt("你的暱稱?", "TestUser"),
			targetId = prompt("想和誰說話?", "Ivy");

		var appendMsg = function(){
			$scope.$apply(function() {
				$scope.messages = Messenger.convs[targetId].messages || null; 
				var window_height = window.innerHeight;
				console.log(window_height);
				// $(".content").attr("height", window_height-82);
				$(".chat-block").animate({scrollTop: $(".message-block").height()}, 100);
			});
		}

		Messenger.registerUser({
			name: name,
			userId: userId,
			gender: 'male'
		});

		Messenger.registerListener(function (from, message) {
			console.log(from);
			console.log(message);
		});

		$scope.sendMessage = function(msg){
			console.log($scope.messages);
			if(msg) {
				console.log("sendMessage: "+msg);
				Messenger.createMessage(targetId, msg, function(err, message){
					if(err) alert(err);
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