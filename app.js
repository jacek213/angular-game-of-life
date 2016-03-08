(function() {
  var app = angular.module('gameOfLife', []);

  app.controller("GameController", ['$scope', '$interval', function($scope, $interval){

    this.matrix = [
      [1,0,0,1,0,1,1,0,0,1,0,1],
      [0,1,0,0,1,0,0,1,1,1,0,1],
      [1,0,0,1,1,0,1,0,0,1,0,0],
      [0,0,1,0,1,0,0,1,0,1,0,0],
      [0,1,0,0,1,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,1,0,0,1,0,1],
      [0,1,0,0,1,0,0,1,0,1,0,1],
      [1,0,0,1,0,1,1,0,0,1,0,1],
      [0,0,0,0,1,0,0,1,0,1,0,0],
      [0,1,0,0,1,0,0,1,1,1,0,1],
      [1,0,0,1,1,0,0,0,0,1,0,0],
      [0,0,1,0,0,0,0,1,0,0,0,0],
    ];

    // this.matrixWidth = 12;
    // this.matrixHeight = 12;

    $scope.size = 20;

    var ctrl = this;

    $scope.$watch("size", function(){

      console.log($scope.size);

      var newMatrix = [];

      var row;

      for (var i = 0; i < $scope.size; i++) {
        row = [];

        for (var u = 0; u < $scope.size; u++) {
          row.push(Math.round(Math.random()));
        }

        newMatrix.push(row);

      }

      ctrl.matrix = newMatrix;

    });


    this.randomize = function() {
      this._mapItems(function(){
        return Math.round(Math.random());
      });

    };

    this.toggleItem = function(rowIdx, colIdx) {
      this.matrix[rowIdx][colIdx] = (this.matrix[rowIdx][colIdx] === 0) ? 1 : 0;
    };

    this.getItemValue = function(rowIdx, colIdx) {
      if (this.inRange(rowIdx, colIdx)) {
        return this.matrix[rowIdx][colIdx];
      } else {
        return 0;
      }
    };

    this.inRange = function(rowIdx, colIdx) {
      return rowIdx <= ($scope.size - 1) && rowIdx > 0 &&
             colIdx <= ($scope.size - 1)  && colIdx > 0;
    }

    this.countSiblings = function(rowIdx, colIdx) {
      return [
        this.getItemValue(rowIdx-1, colIdx),
        this.getItemValue(rowIdx-1, colIdx-1),
        this.getItemValue(rowIdx-1, colIdx+1),
        this.getItemValue(rowIdx+1, colIdx),
        this.getItemValue(rowIdx+1, colIdx-1),
        this.getItemValue(rowIdx+1, colIdx+1),
        this.getItemValue(rowIdx, colIdx-1),
        this.getItemValue(rowIdx, colIdx+1),
      ].reduce(function (a, b) {
        return a + b;
      });
    };

    this.run = function() {
      var that = this;

      $interval(function() {
        that._mapItems(function(item, siblings){
          return that._applyRules(item, siblings);
        });
      }, 20);
    };

    this._mapItems = function(callback) {
      var that = this;

      this.matrix = this.matrix.map(function(row, rowIdx){

        return row.map(function(item, colIdx) {

          var siblings = that.countSiblings(rowIdx, colIdx);

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
