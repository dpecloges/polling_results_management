angular.module('app').factory('authService', [
  '$http',
  '$httpParamSerializer',
  '$q',
  '$rootScope',
  '$window',
  '$log',
  '$cookies',
  '$state',
  '$translate',
  'localStorageService',
  'DateService',
  'SuccessErrorService',
  'jwtHelper',
  'ENV_VARS',
  function ($http, $httpParamSerializer, $q, $rootScope, $window, $log, $cookies, $state, $translate, localStorageService, DateService, SuccessErrorService, jwtHelper, ENV_VARS) {
    
    var devUserIdentifier = 'devUser';
    
    // Oam login page identifier
    $rootScope.loginPageIdentifier = 'mplogin';
    
    //Βασικά Urls - Ανάκτηση από Environment Variables
    $rootScope.baseUrl = ENV_VARS.baseUrl;
    $rootScope.oamBaseUrl = ENV_VARS.oamBaseUrl;
    $rootScope.oamLogoutUrl = ENV_VARS.oamLogoutUrl;
    
    var stateReload = false;
    
    var serviceBase = $rootScope.baseUrl + '/cregapi/';
    var authServiceFactory = {};
    
    var _authentication = {
      isAuth: false,
      login: "",
      id: "",
      username: "",
      registerOfficeId: "",
      registerOfficeName: "",
      municipalRegistryId: "",
      municipalRegistryName: "",
      isMinisterial: false,
      permissions: [],
      fullName: "",
      specialRegisterOffice: false,
      sessionTimeoutTime: null,
      eprAccessEnabled: false
    };
    
    var _login = function (loginData) {
      
      var data = {"username": loginData.username, "password": loginData.password};
      
      data = {};
      
      var deferred = $q.defer();
      
      $http.post(serviceBase + 'auth', data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8888'
        }
      }).success(function (response) {
        
        console.log("Logging in at AuthService Post auth was successful...");
        
        localStorageService.set('authorizationData', {
          login: loginData.username,
          username: response.username,
          registerOfficeId: response.registerOfficeId,
          registerOfficeName: response.registerOfficeName,
          municipalRegistryId: response.municipalRegistryId,
          municipalRegistryName: response.municipalRegistryName,
          isMinisterial: response.isMinisterial,
          permissions: response.permissions,
          fullName: response.fullName
        });
        
        _authentication.isAuth = true;
        _authentication.login = loginData.username;
        _authentication.username = response.username;
        _authentication.registerOfficeId = response.registerOfficeId;
        _authentication.registerOfficeName = response.registerOfficeName;
        _authentication.municipalRegistryId = response.municipalRegistryId;
        _authentication.municipalRegistryName = response.municipalRegistryName;
        _authentication.isMinisterial = response.isMinisterial;
        _authentication.permissions = response.permissions;
        _authentication.fullName = response.fullName;
        
        deferred.resolve(response);
        
      }).error(function (err, status) {
        _logOut();
        deferred.reject(err);
      });
      
      return deferred.promise;
      
    };
    
    var _logOut = function (removeDevUserCookie = true) {
      
      localStorageService.remove('authorizationData');
      
      _authentication.isAuth = false;
      _authentication.login = "";
      _authentication.id = "";
      _authentication.username = "";
      _authentication.registerOfficeId = "";
      _authentication.registerOfficeName = "";
      _authentication.municipalRegistryId = "";
      _authentication.municipalRegistryName = "";
      _authentication.isMinisterial = false;
      _authentication.permissions = [];
      _authentication.fullName = "";
      _authentication.specialRegisterOffice = false;
      _authentication.sessionTimeoutTime = null;
      _authentication.eprAccessEnabled = false;
      
      //Σε περίπτωση που υπάρχει cookie devUser γίνεται διαγραφή του
      if (removeDevUserCookie && _devUserExists()) {
        _removeDevUser();
      }
      
    };
    
    var _fillAuthData = function () {
      
      var authData = localStorageService.get('authorizationData');
      
      if (authData) {
        _authentication.isAuth = true;
        _authentication.login = authData.login;
        _authentication.id = authData.id;
        _authentication.username = authData.username;
        _authentication.registerOfficeId = authData.registerOfficeId;
        _authentication.registerOfficeName = authData.registerOfficeName;
        _authentication.municipalRegistryId = authData.municipalRegistryId;
        _authentication.municipalRegistryName = authData.municipalRegistryName;
        _authentication.isMinisterial = authData.isMinisterial;
        _authentication.permissions = authData.permissions;
        _authentication.fullName = authData.fullName;
        _authentication.specialRegisterOffice = authData.specialRegisterOffice;
        _authentication.eprAccessEnabled = authData.eprAccessEnabled;
      }
      
    };
    
    var _hasCrPermission = function (permission) {
      
      var authData = localStorageService.get('authorizationData');
      
      if (authData && authData.permissions) {
        return authData.permissions.indexOf(permission) > -1;
      }
      
    };
    
    var _hasCrCombinedSavePermission = function (combinedPermission, id) {
      
      //Εύρεση λεκτικού combinedsave στο custom permission
      var indexOf = combinedPermission.indexOf("combinedsave");
      
      if (indexOf === -1) {
        $log.error("Literal combinedsave not found on hasCombinedSavePermission [" + combinedPermission + "]");
        return false;
      }
      ;
      
      //Μετασχηματισμός σε βασικό permission (.create, .update)
      var permission = combinedPermission.substr(0, indexOf) + (!id ? "create" : "update");
      
      return _hasPermission(permission);
      
    };
    
    var _userAuthenticated = function () {
      return _authentication.isAuth;
    };
    
    var _getUserId = function () {
      return _authentication.id;
    };
    
    var _getUsername = function () {
      return _authentication.username;
    };
    
    var _getRegisterOfficeId = function () {
      return _authentication.registerOfficeId;
    };
    
    var _getRegisterOfficeName = function () {
      return _authentication.registerOfficeName;
    };
    
    var _getMunicipalRegistryId = function () {
      return _authentication.municipalRegistryId;
    };
    
    var _getMunicipalRegistryName = function () {
      return _authentication.municipalRegistryName;
    };
    
    var _userMinisterial = function () {
      return _authentication.isMinisterial;
    };
    
    var _getFullName = function () {
      return _authentication.fullName;
    };
    
    var _userSpecialRegisterOffice = function () {
      return _authentication.specialRegisterOffice;
    };
    
    var _eprAccessEnabled = function () {
      return _authentication.eprAccessEnabled;
    };
    
    var _getSessionTimeoutTime = function () {
      var authData = localStorageService.get('authorizationData');
      if (authData) {
        return authData.sessionTimeoutTime;
      }
    };
    
    /**
     * Έλεγχος ότι υπάρχουν authorizationData στο localStorage του Browser
     * @returns {boolean}
     * @private
     */
    var _hasAuthorizationData = function () {
      
      var authData = localStorageService.get('authorizationData');
      
      var emptyObject = JSON.stringify(authData) === '{}';
      
      return (authData !== undefined && authData != null && !emptyObject);
    };
    
    /**
     * Ανάκτηση αντικειμένου για τα authorizationData από το API
     * ώστε να καταχωρούνται στη συνέχεια στο localStorage του Browser
     * @returns {HttpPromise}
     * @private
     */
    var _getAuthorizationData = function () {
      return $http.get(serviceBase + 'auth/data');
    };
    
    /**
     * Καταχώριση στοιχείων authorizationData στο localStorage του Browser
     * @param authorizationData
     * @private
     */
    var _setAuthorizationData = function (authorizationData) {
      
      localStorageService.set('authorizationData', {
        login: authorizationData.username,
        id: authorizationData.id,
        username: authorizationData.username,
        registerOfficeId: authorizationData.registerOfficeId,
        registerOfficeName: authorizationData.registerOfficeName,
        municipalRegistryId: authorizationData.municipalRegistryId,
        municipalRegistryName: authorizationData.municipalRegistryName,
        isMinisterial: authorizationData.isMinisterial,
        permissions: authorizationData.permissions,
        fullName: authorizationData.fullName,
        specialRegisterOffice: authorizationData.specialRegisterOffice,
        eprAccessEnabled: authorizationData.eprAccessEnabled
      });
      
      _authentication.isAuth = true;
      _authentication.login = authorizationData.username;
      _authentication.id = authorizationData.id;
      _authentication.username = authorizationData.username;
      _authentication.registerOfficeId = authorizationData.registerOfficeId;
      _authentication.registerOfficeName = authorizationData.registerOfficeName;
      _authentication.municipalRegistryId = authorizationData.municipalRegistryId;
      _authentication.municipalRegistryName = authorizationData.municipalRegistryName;
      _authentication.isMinisterial = authorizationData.isMinisterial;
      _authentication.permissions = authorizationData.permissions;
      _authentication.fullName = authorizationData.fullName;
      _authentication.specialRegisterOffice = authorizationData.specialRegisterOffice;
      _authentication.eprAccessEnabled = authorizationData.eprAccessEnabled;
      
    };
    
    /**
     * Έλεγχος ύπαρξης devUser
     * @returns {boolean}
     * @private
     */
    var _devUserExists = function () {
      
      //Ανάκτηση devUser από τα cookies του browser
      var devUser = $cookies.get(devUserIdentifier);
      
      return (devUser ? true : false);
    };
    
    /**
     * Ανάκτηση τιμής devUser
     * @returns {*|string}
     * @private
     */
    var _getDevUser = function () {
      return $cookies.get(devUserIdentifier);
    };
    
    /**
     * Διαγραφή τιμής devUser
     * @private
     */
    var _removeDevUser = function () {
      $cookies.remove(devUserIdentifier);
    };
    
    /**
     * Force State Reload
     * @returns {boolean}
     * @private
     */
    var _getStateReload = function () {
      return stateReload;
    };
    
    /**
     * Set Force State Reload
     * @param flag
     * @private
     */
    var _setStateReload = function (flag) {
      stateReload = flag;
    }
    
    /**
     * Ενημέρωση τιμής για τη χρονική στιγμή τελευταίας λήξης του session
     * (υποθετικά και στο περίπου)
     * @private
     */
    var _setSessionTimeoutTime = function () {
      
      var authData = localStorageService.get('authorizationData');
      
      if (authData) {
        
        var nowMoment = DateService.nowMoment();
        var sessionTimeoutTime = nowMoment.add(ENV_VARS.sessionInterval, 'millisecond').tz("Europe/Athens");
        
        authData.sessionTimeoutTime = sessionTimeoutTime;
        
        localStorageService.set('authorizationData', authData);
        
      }
    };
    
    
    var _getToken = function () {
      let accessToken = $cookies.get('access_token');
      return accessToken;
    };
    
    var _loginToken = function (scope, data) {
      
      var req = {
        method: 'POST',
        url: $rootScope.baseUrl + "/dpelapi/oauth/token",
        headers: {
          "Authorization": "Basic " + btoa("dpel_cl:c5xP$Uf5#[v)"),
          "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        data: $httpParamSerializer(data)
      }
      $http(req).then(function (data) {
            
            $http.defaults.headers.common.Authorization = 'Bearer ' + data.data.access_token;
            $cookies.put("access_token", data.data.access_token);
            
            let expToken = data.data.access_token;
            
            if(_hasPermission('ep.verification')) {
              $state.go("app.ep.verification.view", {notify: true, reload: true});
            }
            else {
              $state.go("app.home", {notify: true, reload: true});
            }
          },
          function (error) {
            $log.error(error.data);
            SuccessErrorService.showError(scope, $translate.instant('global.login.error.badCredentials'));
          });
      
    };
    
    var _logoutToken = function () {
      $cookies.remove('access_token');
      localStorageService.remove('resultArgs');
      $state.go("app.auth.login", {reloadWindow: true}, {notify: true, reload: true});
    };
  
    var _getFullNameToken = function () {
      return _getToken() ? jwtHelper.decodeToken(_getToken()).fullName : '';
    };
    
    var _getElectionCenterId = () => _getToken() ? jwtHelper.decodeToken(_getToken()).electionCenterId : '';
  
    var _getElectionCenterName = function () {
      return _getToken() ? jwtHelper.decodeToken(_getToken()).electionCenterName : '';
    };
    
    var _getElectionCenterDisplayName = function () {
      return _getToken() ? jwtHelper.decodeToken(_getToken()).electionCenterDisplayName : '';
    };
    
    var _getElectionDepartmentId = () => _getToken() ? jwtHelper.decodeToken(_getToken()).electionDepartmentId : '';
  
    var _getElectionDepartmentName = function () {
      return _getToken() ? jwtHelper.decodeToken(_getToken()).electionDepartmentName : '';
    };
    
    var _getElectionDepartmentDisplayName = function () {
      return _getToken() ? jwtHelper.decodeToken(_getToken()).electionDepartmentDisplayName : '';
    };
  
    var _hasPermission = function (permission) {
  
      let token = _getToken();
      if (token) {
        return jwtHelper.decodeToken(token).authorities.indexOf(permission) > -1;
      }
      else {
        return false;
      }
    
    };
  
    var _hasCombinedSavePermission = function (combinedPermission, id) {
    
      //Εύρεση λεκτικού combinedsave στο custom permission
      var indexOf = combinedPermission.indexOf("combinedsave");
    
      if (indexOf === -1) {
        $log.error("Literal combinedsave not found on hasCombinedSavePermission [" + combinedPermission + "]");
        return false;
      };
    
      //Μετασχηματισμός σε βασικό permission (.create, .update)
      var permission = combinedPermission.substr(0, indexOf) + (!id ? "create" : "update");
    
      return _hasPermission(permission);
    
    };
  
    var _hasCombinedViewPermission = function (combinedPermission, id) {
    
      //Εύρεση λεκτικού combinedview στο custom permission
      var indexOf = combinedPermission.indexOf("combinedview");
    
      if (indexOf === -1) {
        $log.error("Literal combinedview not found on hasCombinedViewPermission [" + combinedPermission + "]");
        return false;
      };
    
      //Μετασχηματισμός σε βασικό permission (.create, .view)
      var permission = combinedPermission.substr(0, indexOf) + (!id ? "create" : "view");
    
      return _hasPermission(permission);
    
    };
  
    var _tokenIsValid = function () {
      return _getToken() ? !jwtHelper.isTokenExpired(_getToken()) : false;
    };
  
    var _getElectionProcedureRound = function () {
      return _getToken() ? jwtHelper.decodeToken(_getToken()).electionProcedureRound : '';
    };
  
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.userAuthenticated = _userAuthenticated;
    authServiceFactory.getUserId = _getUserId;
    authServiceFactory.getUsername = _getUsername;
    authServiceFactory.getRegisterOfficeId = _getRegisterOfficeId;
    authServiceFactory.getRegisterOfficeName = _getRegisterOfficeName;
    authServiceFactory.getMunicipalRegistryId = _getMunicipalRegistryId;
    authServiceFactory.getMunicipalRegistryName = _getMunicipalRegistryName;
    authServiceFactory.userMinisterial = _userMinisterial;
    authServiceFactory.getFullName = _getFullName;
    authServiceFactory.userSpecialRegisterOffice = _userSpecialRegisterOffice;
    authServiceFactory.eprAccessEnabled = _eprAccessEnabled;
    authServiceFactory.getSessionTimeoutTime = _getSessionTimeoutTime;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.getAuthorizationData = _getAuthorizationData;
    authServiceFactory.setAuthorizationData = _setAuthorizationData;
    authServiceFactory.hasAuthorizationData = _hasAuthorizationData;
    authServiceFactory.devUserExists = _devUserExists;
    authServiceFactory.getDevUser = _getDevUser;
    authServiceFactory.removeDevUser = _removeDevUser;
    authServiceFactory.getStateReload = _getStateReload;
    authServiceFactory.setStateReload = _setStateReload;
    authServiceFactory.setSessionTimeoutTime = _setSessionTimeoutTime;
    
    
    authServiceFactory.getToken = _getToken;
    authServiceFactory.loginToken = _loginToken;
    authServiceFactory.logoutToken = _logoutToken;
    authServiceFactory.getFullNameToken = _getFullNameToken;
    authServiceFactory.getElectionCenterId = _getElectionCenterId;
    authServiceFactory.getElectionCenterName = _getElectionCenterName;
    authServiceFactory.getElectionCenterDisplayName = _getElectionCenterDisplayName;
    authServiceFactory.getElectionDepartmentId = _getElectionDepartmentId;
    authServiceFactory.getElectionDepartmentName = _getElectionDepartmentName;
    authServiceFactory.getElectionDepartmentDisplayName = _getElectionDepartmentDisplayName;
    authServiceFactory.hasPermission = _hasPermission;
    authServiceFactory.hasCombinedSavePermission = _hasCombinedSavePermission;
    authServiceFactory.hasCombinedViewPermission = _hasCombinedViewPermission;
    authServiceFactory.tokenIsValid = _tokenIsValid;
    authServiceFactory.getElectionProcedureRound = _getElectionProcedureRound;
  
    return authServiceFactory;
    
  }]);
