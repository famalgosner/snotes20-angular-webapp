'use strict';

angular.module('snotes30App')
  .controller('LiveListCtrl', function ($scope, $state, Restangular, DocumentService) {
    $scope.episodes = [];

    Restangular.all('soonepisodes').getList().then(
      function (episodes) {
        $scope.episodes = episodes;
      }
    );

    $scope.isPast = function (ep) {
      var today = new Date().setHours(0,0,0,0);
      return ep.date < today;
    };

    $scope.openDoc = function (ep) {
      var name = (typeof ep === 'string') ? ep : ep.document.name;
      $state.go('document-edit', { name: name }, { inherit: false });
    };

    $scope.create = function (ep) {
      DocumentService.createFromEpisode(ep).then(function (doc) {
        $scope.openDoc(doc.name);
      });
    };
  });