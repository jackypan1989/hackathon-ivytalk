angular.module('ivyTalk')
.controller('ChatCtrl', [
	'$scope',
	'Messenger',
	function ($scope, Messenger) {
		$scope.textToSend = '';
		$scope.userId = prompt('你的暱稱?', 'roger'),
		$scope.targetId = prompt('想和誰說話?', 'ivy');
		Messenger.initConv($scope.targetId);
		$scope.conv = Messenger.convs[$scope.targetId];
		$(".message-block").css('max-height',window.innerHeight/809 * 600 -30 +"px");
		
		Messenger.registerUser({
			name: $scope.userId,
			userId: $scope.userId,
			gender: 'male'
		});

		var appendMsg = function () {
			$scope.$apply(function () {
				$(".message-block").animate({scrollTop: $(".message-block").prop("scrollHeight") + 1000}, 100);
				//data
				$scope.data[0].values = $scope.conv.my_scores;
				$scope.data[1].values = $scope.conv.target_scores;
				$scope.current = $scope.conv.target_total_score;
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
                height: 350,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 30,
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
                    // axisLabel: '時間',
                    tickFormat: function(d) {
                        return d3.time.format('%H:%M:%S')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: false
                },

                yAxis: {
                    // axisLabel: '曖昧指數',
                    tickFormat: function(d){
                        return d3.format(',.1')(d);
                    },
                    showMaxMin: false,
                    //axisLabelDistance: 20
                }
            }
        };

        /* Chart data */
        $scope.data = [
            {
                key: $scope.userId,
                //values: [ [ 1083297600000 , -2.974623048543] , [ 1085976000000 , -1.7740300785979] , [ 1088568000000 , 4.4681318138177] ]
                values: $scope.conv.my_scores,
                mean: 0
            },
            {
                key: $scope.targetId,
                //values: [ [ 1083297600000 , -0.77078283705125] , [ 1085976000000 , -1.8356366650335] , [ 1088568000000 , -5.3121322073127] ]           ,
                values: $scope.conv.target_scores,
                mean: 0
            }
        ];

        $scope.max = 100;
        //$scope.current = 40;
        $scope.current = $scope.conv.target_total_score;

}]);