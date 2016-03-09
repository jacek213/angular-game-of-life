(function() {
  var app = angular.module('gameOfLife', []);

  app.controller("GameController", ['$interval', function($interval){

    var gameInterval,
        ctrl = this;

    var init = function() {
      ctrl.width = 80;
      ctrl.height = 40;
      ctrl.interval = 20;
      ctrl.updateSize();
    };

    this.step = function() {
      ctrl._mapItems(function(item, siblings){
        return ctrl._applyRules(item, siblings);
      });
    };

    this.start = function() {
      if (ctrl._isRunning()) return;
      gameInterval = $interval(ctrl.step, ctrl.interval);
    };

    this.stop = function() {
      if (angular.isDefined(gameInterval)) {
        $interval.cancel(gameInterval);
        gameInterval = undefined;
      }
    };

    this.updateSpeed = function() {
      var beenRunning = ctrl._isRunning();
      ctrl.stop();
      if (beenRunning) ctrl.start();
    };

    this.updateSize = function() {
      var row;
      ctrl.stop();
      ctrl.matrix = [];

      for (var i = 0; i < ctrl.height; i++) {
        row = [];
        for (var ii = 0; ii < ctrl.width; ii++) {
          row.push(Math.round(Math.random()));
        }
        ctrl.matrix.push(row);
      }
    };

    this.randomize = function() {
      ctrl.stop();
      ctrl._mapItems(function() {
        return Math.round(Math.random());
      });
    };

    this.clear = function() {
      ctrl.stop();
      ctrl._mapItems(function() {
        return 0;
      });
    };

    this.toggleItem = function(rowIdx, colIdx) {
      var newValue = (ctrl.matrix[rowIdx][colIdx] === 0) ? 1 : 0;
      ctrl.matrix[rowIdx][colIdx] = newValue;
    };

    this._getItemValue = function(rowIdx, colIdx) {
      if (ctrl._inRange(rowIdx, colIdx)) {
        return ctrl.matrix[rowIdx][colIdx];
      } else {
        return 0;
      }
    };

    this._isRunning = function() {
      return angular.isDefined(gameInterval);
    };

    this._inRange = function(rowIdx, colIdx) {
      return rowIdx <= (ctrl.height - 1) && rowIdx > 0 &&
             colIdx <= (ctrl.width - 1)  && colIdx > 0;
    }

    this._countSiblings = function(rowIdx, colIdx) {
      return [
        ctrl._getItemValue(rowIdx-1, colIdx),
        ctrl._getItemValue(rowIdx-1, colIdx-1),
        ctrl._getItemValue(rowIdx-1, colIdx+1),
        ctrl._getItemValue(rowIdx+1, colIdx),
        ctrl._getItemValue(rowIdx+1, colIdx-1),
        ctrl._getItemValue(rowIdx+1, colIdx+1),
        ctrl._getItemValue(rowIdx, colIdx-1),
        ctrl._getItemValue(rowIdx, colIdx+1),
      ].reduce(function (a, b) {
        return a + b;
      });
    };

    this._mapItems = function(callback) {
      var siblings;
      ctrl.matrix = ctrl.matrix.map(function(row, rowIdx){
        return row.map(function(item, colIdx) {
          siblings = ctrl._countSiblings(rowIdx, colIdx);
          return callback(item, siblings, rowIdx, colIdx);
        });
      });
    };

    this._applyRules = function(item, siblingsCount) {
      if (item === 0) {
        return (siblingsCount === 3) ? 1 : 0;
      } else {
        return (siblingsCount === 2 || siblingsCount === 3) ? 1 : 0;
      }
    };

    init();

  }]);
})();
