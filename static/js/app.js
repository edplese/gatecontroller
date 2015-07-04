// Disable scrolling to make it easier for young kids to press the buttons.
/*
$(document).bind('touchmove', function(e) {
	e.preventDefault();
});
*/

var trainApp = angular.module('trainApp', ['ngFileUpload']);

trainApp.controller('trainController', ['$scope', '$http', 'Upload',
	function($scope, $http, Upload) {
		$scope.pictureUrl = '/static/picture.jpg?nocache=' + new Date().getTime();

		// Index of gate selected to be moved.  This is set when a "Move Gate"
		// button is pressed.  -1 indicates no gate has been selected.
		$scope.moveGate = -1;

		// x: X position of the gate on the image scaled from 0 to 1
		// y: Y position of the gate on the image scaled from 0 to 1
		// up: true if the gate is up, false otherwise
		// show: true if the circle for this gate should be shown
		$scope.gates = [
			{ x: 0, y: 0, up: false, show: false },
			{ x: 0, y: 0, up: false, show: false }
		];

		// Handles uploading an image to the server.
		$scope.upload = function(files) {
			var file = files[0];
			Upload.upload({
				url: '/uploadPicture',
				file: file
			}).success(function(data, status, headers, config) {
				$scope.pictureUrl = '/static/picture.jpg?nocache=' + new Date().getTime();
			});
		}

		// Handles moving a gate.  The gate positions are only stored
		// locally and not saved back to the server.
		$scope.pictureClicked = function(event) {
			if ($scope.moveGate < 0) {
				return;
			}

			var width = event.target.width;
			var height = event.target.height;

			// 50 is for half of the 100px width and height of the gate div.
			var x = event.offsetX - 50;
			var y = event.offsetY - 50;

			// Scale coordinates to a range of 0 to 1.
			var x_scaled = 1.0 * x / width;
			var y_scaled = 1.0 * y / height;

			gate = $scope.gates[$scope.moveGate];
			gate.x = x_scaled;
			gate.y = y_scaled;
			gate.show = true;

			$scope.moveGate = -1;
		}

		// Handles the start of a gate move.  The button has been pressed
		// to start the move but the gate is not yet moved.
		$scope.move = function(gate) {
			$scope.moveGate = gate;
			$scope.gates[gate].show = false;
		}

		// Returns the horizontal axis gate position scaled to screen pixels rather than 0-1.
		$scope.gateX = function(gate) {
			var picture = document.getElementById("picture");
			var x = Math.round($scope.gates[gate].x * picture.clientWidth) + "px";
			return x;
		}

		// Returns the vertical axis gate position scaled to screen pixels rather than 0-1.
		$scope.gateY = function(gate) {
			var picture = document.getElementById("picture");
			var y = Math.round($scope.gates[gate].y * picture.clientHeight) + "px";
			return y;
		}

		// Handles toggling the gate when pressed.
		$scope.toggleGate = function(gate) {
			g = $scope.gates[gate];
			g.up = !g.up;

			var state = g.up ? 'up' : 'down';
			$http.post("/gate/" + gate + "/" + state);
		}
	}
]);
