angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = '';
		$scope.userId = prompt('你的暱稱?', 'roger'),
		$scope.targetId = prompt('想和誰說話?', 'ivy');

		$(".message-block").css('max-height',window.innerHeight/809 * 600 +"px");
		
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
			var targetId = from.userId;
			if ($scope.targetId !== targetId) return;
			appendMsg();
		});

		$scope.sendMessage = function (msg){
			if(msg) {
				Messenger.createMessage($scope.targetId, msg, function (err, message) {
					if(err) return alert(err.err_description);
					appendMsg();
				});
				$scope.textToSend = '';
			}
		};

		$scope.isMyMessage = Messenger.isMyMsg;
	
		$scope.keyPress = function(event){
			if(event.which === 13) {
				 event.preventDefault();
				$scope.sendMessage($scope.textToSend);
				$scope.textToSend = '';
			}
			return false;
		};	

		// nvd3

		/* Chart options */
        $scope.options = {
            chart: {
                type: 'cumulativeLineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){ return d[0]; },
                y: function(d){ return d[1]/100; },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: '時間',
                    tickFormat: function(d) {
                        return d3.time.format('%m/%d/%y')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: '曖昧指數',
                    tickFormat: function(d){
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 20
                }
            }
        };

        /* Chart data */
        $scope.data = [
            {
                key: $scope.userId,
                values: [ [ 1083297600000 , -2.974623048543] , [ 1085976000000 , -1.7740300785979] , [ 1088568000000 , 4.4681318138177] ]
                ,
                mean: 250
            },
            {
                key: $scope.targetId,
                values: [ [ 1083297600000 , -0.77078283705125] , [ 1085976000000 , -1.8356366650335] , [ 1088568000000 , -5.3121322073127] ]           ,
                mean: -60
            }
        ];


}]);