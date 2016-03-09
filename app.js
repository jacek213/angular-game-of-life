(function() {
  var app = angular.module('gameOfLife', []);

  app.controller("GameController", ['$interval', function($interval){

    var gameInterval,
        ctrl = this;

    var init = function() {
      ctrl.width = 20;
      ctrl.height = 20;
      ctrl.updateSize();
    };

    this.step = function() {
      ctrl._mapItems(function(item, siblings){
        return ctrl._applyRules(item, siblings);
      });
    }

    this.start = function() {
      if ( angular.isDefined(gameInterval) ) return;

      gameInterval = $interval(ctrl.step, 20);
    };

    this.stop = function() {
      if (angular.isDefined(gameInterval)) {
        $interval.cancel(gameInterval);
        gameInterval = undefined;
      }
    };

    this.updateSize = function() {
      var row,
          temp = [];

      ctrl.stop();

      for (var i = 0; i < ctrl.height; i++) {
        row = [];
        for (var ii = 0; ii < ctrl.width; ii++) {
          row.push(Math.round(Math.random()));
        }
        temp.push(row);
      }
      ctrl.matrix = temp;
    };

    this.randomize = function() {
      this.stop();
      this._mapItems(function() {
        return Math.round(Math.random());
      });
    };

    this.clear = function() {
      this.stop();
      this._mapItems(function() {
        return 0;
      });
    };

    this.toggleItem = function(rowIdx, colIdx) {
      this.matrix[rowIdx][colIdx] = (this.matrix[rowIdx][colIdx] === 0) ? 1 : 0;
    };

    this._getItemValue = function(rowIdx, colIdx) {
      if (this._inRange(rowIdx, colIdx)) {
        return this.matrix[rowIdx][colIdx];
      } else {
        return 0;
      }
    };

    this._inRange = function(rowIdx, colIdx) {
      return rowIdx <= (this.height - 1) && rowIdx > 0 &&
             colIdx <= (this.width - 1)  && colIdx > 0;
    }

    this._countSiblings = function(rowIdx, colIdx) {
      return [
        this._getItemValue(rowIdx-1, colIdx),
        this._getItemValue(rowIdx-1, colIdx-1),
        this._getItemValue(rowIdx-1, colIdx+1),
        this._getItemValue(rowIdx+1, colIdx),
        this._getItemValue(rowIdx+1, colIdx-1),
        this._getItemValue(rowIdx+1, colIdx+1),
        this._getItemValue(rowIdx, colIdx-1),
        this._getItemValue(rowIdx, colIdx+1),
      ].reduce(function (a, b) {
        return a + b;
      });
    };

    this._mapItems = function(callback) {
      this.matrix = this.matrix.map(function(row, rowIdx){
        return row.map(function(item, colIdx) {
          var siblings = ctrl._countSiblings(rowIdx, colIdx);
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
