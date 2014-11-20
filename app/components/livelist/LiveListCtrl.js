'use strict';

angular.module('snotes30App')
  .controller('LiveListCtrl', function ($scope, $state, $timeout, Restangular, DocumentService, ArchiveService) {
    $scope.episodes = [];
    $scope.newDoc = {
      'number': ""
    };

    $scope.nonlive = {
      podcasts: []
    };

    ArchiveService.getFullList().then(function (podcasts) {
      $scope.nonlive.podcasts = podcasts;
    });

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

    $scope.create = function (index, nonumber) {
      var ep = $scope.episodes[index];

      if($scope.newDoc.number || nonumber) {
        if(nonumber || ep.number) {
          $scope.newDoc.number = null;
        }

        DocumentService.createFromEpisode(ep, $scope.newDoc.number).then(function (doc) {
          $scope.openDoc(doc.name);
        });
      } else {
        $scope.setNumber = ep;
        $timeout(function () { angular.element("#addNumber_" + index).focus(); }, 0);
      }
    };

    $scope.createNonLive = function () {
      var podcast = $scope.nonlive.selectedPodcast.originalObject;
      DocumentService.createNonLive(podcast.id, $scope.nonlive.number).then(function (doc) {
        $scope.openDoc(doc.name);
      });
    }
  });
