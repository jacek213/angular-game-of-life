(function() {
  var app = angular.module('gameOfLife', []);

  app.controller("GameController", ['$interval', function($interval){

    var ctrl = this;
    var gameInterval;

    this.size = 20;
    this.matrix = [];

    this.start = function() {
      if ( angular.isDefined(gameInterval) ) return;

      gameInterval = $interval(function() {
        ctrl._mapItems(function(item, siblings){
          return ctrl._applyRules(item, siblings);
        });
      }, 20);
    }

    this.stop = function() {
      if (angular.isDefined(gameInterval)) {
        $interval.cancel(gameInterval);
        gameInterval = undefined;
      }
    }

    this.updateSize = function(newSize) {
      this.stop();
      var newMatrix = [];
      var row;
      for (var i = 0; i < newSize; i++) {
        row = [];

        for (var u = 0; u < newSize; u++) {
          row.push(Math.round(Math.random()));
        }
        newMatrix.push(row);
      }
      this.matrix = newMatrix;
    }

    this.updateSize(this.size);

    this.randomize = function() {
      this.stop();
      this._mapItems(function() {
        return Math.round(Math.random());
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
      return rowIdx <= (this.size - 1) && rowIdx > 0 &&
             colIdx <= (this.size - 1)  && colIdx > 0;
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
        if (siblingsCount === 3) {
          return 1;
        } else {
          return 0;
        }

      } else if (item === 1) {
        if (siblingsCount === 2 || siblingsCount === 3) {
          return 1;
        } else {
          return 0;
        }
      }
    };
  }]);
})();
