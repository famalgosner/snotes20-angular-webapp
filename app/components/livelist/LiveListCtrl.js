'use strict';

angular.module('snotes30App')
  .controller('LiveListCtrl', function ($scope, $state, $timeout, Restangular, DocumentService) {
    $scope.episodes = [];
    $scope.newDoc = {
      'number': ""
    };

    $scope.podcasts = [
      {
        "slug": "cre",
        "title": "Chaosradio Express"
      },
      {
        "slug": "mobilemacs",
        "title": "Mobilemacs"
      },
      {
        "slug": "1337kultur",
        "title": "1337kultur"
      },
      {
        "slug": "nsfw",
        "title": "Not Safe For Work"
      },
      {
        "slug": "nerdkunde",
        "title": "Nerdkunde"
      },
    ];

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
        var _doc;

        DocumentService.createFromEpisode(ep).then(function (doc) {
          _doc = doc;
          if(!nonumber && !ep.number) {
            return DocumentService.setNumber(doc, $scope.newDoc.number);
          }
        }).then(function () {
          $scope.openDoc(_doc.name);
        });
      } else {
        $scope.setNumber = ep;
        $timeout(function () { angular.element("#addNumber_" + index).focus(); }, 0);
      }
    };
  });
