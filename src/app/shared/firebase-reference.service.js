(function() {
  'use strict';

  angular
    .module('LandApp')
    .factory('firebaseReferenceService', firebaseReferenceService);

  /** @ngInject */
  function firebaseReferenceService($q, Firebase, ENV) {
    var firebaseRef = new Firebase("https://" + ENV.firebase + ".firebaseio.com");
    var _uid = null;
    var service = {
      ref: firebaseRef,
      getUserInfoRef: getUserInfoRef,
      getUserLayersRef: getUserLayersRef,
      getUserMyFarmRef: getUserMyFarmRef,
      getUserFarmLayersRef: getUserFarmLayersRef,
      getUserUIDRef: getUserUIDRef,
      setUid: setUid,
      getUserProjectsRef: getUserProjectsRef,
      getUserPresence: getUserPresence,
      getUserEmailRef: getUserEmailRef
    };

    return service;
    ////////// public functions //////////////

    function getUserPresence(uid) {
      return getUserInfoRef(uid)
        .child('presence');
    }

    function getUserEmailRef(uid) {
      return getUserInfoRef(uid)
        .child('email');
    }

    function getUserInfoRef(uid) {
      return getUserUIDRef(uid)
        .child("info");
    }

    function getUserProjectsRef(uid) {
      return getUserUIDRef(uid)
        .child("projects");
    }

    // users/xxxxx/projects/xxxxx/layers
    function getUserLayersRef(projectKey, uid) {
      return getUserProjectsRef(uid)
        .child(projectKey)
        .child("layers");
    }

    function getUserMyFarmRef(uid) {
      return getUserProjectsRef(uid)
        .child("myFarm");
    }

    function getUserFarmLayersRef(uid) {
      return getUserMyFarmRef(uid)
        .child("layers/farm");
    }

    function getUserUIDRef(uid) {
      uid = uid || _uid || (firebaseRef.getAuth() && firebaseRef.getAuth().uid);
      return firebaseRef
        .child("users")
        .child(uid);
    }

    /**
     * Set the current UID. It verifies that the UID is stored in the DB. If it is not, it is an unexisting user and
     * therefore it reject it.
     *
     * @param uid
     * @returns {promise} which will be resolved if it succeed and rejected if it there is not any user with that UID.
     */
    function setUid(uid) {
      var deferred = $q.defer();

      getUserInfoRef(uid).once("value", function(data) {
        if (data.val()) {
          _uid = uid;
          deferred.resolve();
        } else {
          deferred.reject();
        }
      });

      return deferred.promise;
    }
  }

})();
