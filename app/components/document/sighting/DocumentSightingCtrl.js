'use strict';

angular.module('snotes30App')
.controller('DocumentSightingCtrl', function ($scope, $rootScope, $q, doc, DocumentService) {
  $scope.doc = doc;
  $scope.episode = doc.episode;

  $scope.publication = {
    episode: doc.episode.id,
    podcasters: doc.meta.podcasters,
    shownoters: doc.meta.shownoters,
    comment: "",
    preliminary: false
  };

  $scope.epnumber = doc.episode.number;

  $scope.editorMode = 'preview';

  function updateDocument() {
    return DocumentService.getByName(doc.name).then(function (doc) {
      $scope.doc = doc;

      $scope.publication.podcasters = doc.meta.podcasters;
      $scope.publication.shownoters = doc.meta.shownoters;
    });
  }

  $scope.switchEditorMode = function (mode) {
    $scope.editorMode = mode;
  };

  $scope.addShownoter = function (shownoter) {
    var deferred = $q.defer();

    $scope.publication.shownoters.push(shownoter);

    deferred.resolve();
    return deferred.promise;
  };

  $scope.addShownoter = function (shownoter) {
    return DocumentService.addShownoter(doc, shownoter).then(updateDocument);
  };

  $scope.delShownoter = function (shownoter) {
    return DocumentService.delShownoter(doc, shownoter).then(updateDocument);
  };

  $scope.addPodcaster = function (podcaster) {
    return DocumentService.addPodcaster(doc, podcaster).then(updateDocument);
  };

  $scope.delPodcaster = function (podcaster) {
    return DocumentService.delPodcaster(doc, podcaster).then(updateDocument);
  };

  $scope.publish = function () {
    DocumentService.publish(doc, $scope.publication);
  }
});
