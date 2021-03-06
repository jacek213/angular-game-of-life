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
      ctrl._mapCells(function(item, siblings){
        return ctrl._newCellState(item, siblings);
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
      ctrl._mapCells(function() {
        return Math.round(Math.random());
      });
    };

    this.clear = function() {
      ctrl.stop();
      ctrl._mapCells(function() {
        return 0;
      });
    };

    this.toggleCellState = function(rowIdx, colIdx) {
      var newValue = (ctrl._cellState(rowIdx, colIdx) === 0) ? 1 : 0;
      ctrl.matrix[rowIdx][colIdx] = newValue;
    };

    this._isRunning = function() {
      return angular.isDefined(gameInterval);
    };

    this._cellState = function(rowIdx, colIdx) {
      if (ctrl._inRange(rowIdx, colIdx)) {
        return ctrl.matrix[rowIdx][colIdx];
      } else {
        return 0;
      }
    };

    this._inRange = function(rowIdx, colIdx) {
      return rowIdx <= (ctrl.height - 1) && rowIdx > 0 &&
             colIdx <= (ctrl.width - 1)  && colIdx > 0;
    }

    this._countSiblings = function(rowIdx, colIdx) {
      return [
        ctrl._cellState(rowIdx-1, colIdx),
        ctrl._cellState(rowIdx-1, colIdx-1),
        ctrl._cellState(rowIdx-1, colIdx+1),
        ctrl._cellState(rowIdx+1, colIdx),
        ctrl._cellState(rowIdx+1, colIdx-1),
        ctrl._cellState(rowIdx+1, colIdx+1),
        ctrl._cellState(rowIdx, colIdx-1),
        ctrl._cellState(rowIdx, colIdx+1),
      ].reduce(function (a, b) {
        return a + b;
      });
    };

    this._mapCells = function(callback) {
      var siblings;
      ctrl.matrix = ctrl.matrix.map(function(row, rowIdx){
        return row.map(function(item, colIdx) {
          siblings = ctrl._countSiblings(rowIdx, colIdx);
          return callback(item, siblings, rowIdx, colIdx);
        });
      });
    };

    this._newCellState = function(currentState, siblingsCount) {
      if (currentState === 0) {
        return (siblingsCount === 3) ? 1 : 0;
      } else {
        return (siblingsCount === 2 || siblingsCount === 3) ? 1 : 0;
      }
    };

    init();

  }]);
})();
