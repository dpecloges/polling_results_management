angular.module('app.utils')
  .controller('AdminUnitController', [
    '$scope',
    '$ngBootbox',
    '$translate',
    '$element',
    'AdminUnitService',
    'AdminUnitLevel',
    'CountryService',
    function($scope, $ngBootbox, $translate, $element, AdminUnitService, AdminUnitLevel, CountryService) {
      
      $scope.geographicalUnits = [];
      $scope.decentralAdmins = [];
      $scope.regions = [];
      $scope.regionalUnits = [];
      $scope.municipalities = [];
      $scope.municipalUnits = [];
      $scope.countries = [];
      $scope.initGeographicalUnits = [];
      $scope.initDecentralAdmins = [];
      $scope.initRegions = [];
      $scope.initRegionalUnits = [];
      $scope.initMunicipalities = [];
      $scope.initMunicipalUnits = [];
                        
      // Ανάκτηση Διοικητικής Δομής
      AdminUnitService.getAll()
        .then(adminUnits => {
          $scope.adminUnits = adminUnits;
          
          // Ορισμός αρχικών λιστών
          $scope.geographicalUnits = adminUnits.filter(au => au.level === AdminUnitLevel.GEOGRAPHICAL_UNIT);
          $scope.decentralAdmins = adminUnits.filter(au => au.level === AdminUnitLevel.DECENTRAL_ADMIN);
          $scope.regions = adminUnits.filter(au => au.level === AdminUnitLevel.REGION);
          $scope.regionalUnits = adminUnits.filter(au => au.level === AdminUnitLevel.REGIONAL_UNIT);
          $scope.municipalities = adminUnits.filter(au => au.level === AdminUnitLevel.MUNICIPALITY);
          $scope.municipalUnits = adminUnits.filter(au => au.level === AdminUnitLevel.MUNICIPAL_UNIT);
          
          // Διατήρηση αρχικών λιστών
          $scope.initGeographicalUnits = $scope.geographicalUnits;
          $scope.initDecentralAdmins = $scope.decentralAdmins;
          $scope.initRegions = $scope.regions;
          $scope.initRegionalUnits = $scope.regionalUnits;
          $scope.initMunicipalities = $scope.municipalities;
          $scope.initMunicipalUnits = $scope.municipalUnits;
          
          // Επιπλέον αρχικοποίηση.
          $scope.initAdminUnitLists();
        });
      
      // Ανάκτηση λίστας χωρών
      CountryService.getAll().then(countries => {
    	  $scope.countries = countries;
      });
      
      /**
       * Αρχικοποίηση λιστών για προυπάρχουσες τιμές (αποθηκευμένες εγγραφές).
       */
      $scope.initAdminUnitLists = () => {
        if ($scope.municipalUnitId) {
          $scope.municipalUnitChanged($scope.municipalUnitId);
        } else if ($scope.municipalityId) {
          $scope.municipalityChanged($scope.municipalityId);
        } else if ($scope.regionalUnitId) {
          $scope.regionalUnitChanged($scope.regionalUnitId);
        } else if ($scope.regionId) {
          $scope.regionChanged($scope.regionId);
        } else if ($scope.decentralAdminId) {
          $scope.decentralAdminChanged($scope.decentralAdminId);
        } else if ($scope.geographicalUnitId) {
          $scope.geographicalUnitChanged($scope.geographicalUnitId);
        }
      };
            
      /**
       * Αλλαγή πεδίου Γεωγραφικής Ενότητας.
       *
       * @param {Number} id id Γεωγραφικής Ενότητας
       */
      $scope.geographicalUnitChanged = id => {
        if (id) {
          $scope.decentralAdmins = $scope.initDecentralAdmins.filter(da => da.parentId === id);
          $scope.regions = filterChildAdminUnits($scope.initRegions, [
            { id },
            ...$scope.decentralAdmins,
          ]);
          $scope.regionalUnits = filterChildAdminUnits($scope.initRegionalUnits, [
            { id },
            ...$scope.decentralAdmins,
            ...$scope.regions,
          ]);
          $scope.municipalities = filterChildAdminUnits($scope.initMunicipalities, [
            { id },
            ...$scope.decentralAdmins,
            ...$scope.regions,
            ...$scope.regionalUnits,
          ]);
          $scope.municipalUnits = filterChildAdminUnits($scope.initMunicipalUnits, [
            { id },
            ...$scope.decentralAdmins,
            ...$scope.regions,
            ...$scope.regionalUnits,
            ...$scope.municipalities,
          ]);
        } else {
          $scope.decentralAdminId = null;
          $scope.regionId = null;
          $scope.regionalUnitId = null;
          $scope.municipalityId = null;
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
          $scope.decentralAdmins = $scope.initDecentralAdmins;
          $scope.regions = $scope.initRegions;
          $scope.regionalUnits = $scope.initRegionalUnits;
          $scope.municipalities = $scope.initMunicipalities;
          $scope.municipalUnits = $scope.initMunicipalUnits;
        }
        
        $scope.onChange();
      };
      
      /**
       * Αλλαγή πεδίου Αποκεντρωμένης Διοίκησης.
       *
       * @param {Number} id id Αποκεντρωμένης Διοίκησης
       */
      $scope.decentralAdminChanged = id => {
        if (!id) {
          $scope.regionId = null;
          $scope.regionalUnitId = null;
          $scope.municipalityId = null;
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
        }
        
        setParentAdminUnit(id);
                        
        $scope.regions = filterChildAdminUnits($scope.initRegions, [
            { id: $scope.geographicalUnitId }
          ].concat(id ? { id } : $scope.decentralAdmins)
        );
        $scope.regionalUnits = filterChildAdminUnits($scope.initRegionalUnits, [
          { id: $scope.geographicalUnitId },
          { id },
          ...$scope.regions,
        ]);
        $scope.municipalities = filterChildAdminUnits($scope.initMunicipalities, [
          { id: $scope.geographicalUnitId },
          { id },
          ...$scope.regions,
          ...$scope.regionalUnits,
        ]);
        $scope.municipalUnits = filterChildAdminUnits($scope.initMunicipalUnits, [
          { id: $scope.geographicalUnitId },
          { id },
          ...$scope.regions,
          ...$scope.regionalUnits,
          ...$scope.municipalities,
        ]);
      };
      
      /**
       * Αλλαγή πεδίου Περιφέρειας.
       *
       * @param {Number} id id Περιφέρειας
       */
      $scope.regionChanged = id => {
        if (!id) {
          $scope.regionalUnitId = null;
          $scope.municipalityId = null;
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
        }
        
        setParentAdminUnit(id);
        
        $scope.regionalUnits = filterChildAdminUnits($scope.initRegionalUnits, [
            { id: $scope.geographicalUnitId },
            { id: $scope.decentralAdminId },
          ].concat(id ? { id } : $scope.regions)
        );
        $scope.municipalities = filterChildAdminUnits($scope.initMunicipalities, [
          { id: $scope.geographicalUnitId },
          { id: $scope.decentralAdminId },
          { id },
          ...$scope.regionalUnits,
        ]);
        $scope.municipalUnits = filterChildAdminUnits($scope.initMunicipalUnits, [
          { id: $scope.geographicalUnitId },
          { id: $scope.decentralAdminId },
          { id },
          ...$scope.regionalUnits,
          ...$scope.municipalities,
        ]);
      };
      
      /**
       * Αλλαγή πεδίου Περιφερειακής Ενότητας.
       *
       * @param {Number} id id Περιφερειακής Ενότητας
       */
      $scope.regionalUnitChanged = id => {
        if (!id) {
          $scope.municipalityId = null;
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
        }
        
        setParentAdminUnit(id);
        
        $scope.municipalities = filterChildAdminUnits($scope.initMunicipalities, [
            { id: $scope.geographicalUnitId },
            { id: $scope.decentralAdminId },
            { id: $scope.regionId },
          ].concat(id ? { id } : $scope.regionalUnits)
        );
        $scope.municipalUnits = filterChildAdminUnits($scope.initMunicipalUnits, [
          { id: $scope.geographicalUnitId },
          { id: $scope.decentralAdminId },
          { id: $scope.regionId },
          { id },
          ...$scope.municipalities,
        ]);
      };
      
      /**
       * Αλλαγή πεδίου Δήμου.
       *
       * @param {Number} id id Δήμου
       */
      $scope.municipalityChanged = id => {
        if (!id) {
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
        }
        
        setParentAdminUnit(id);

        $scope.municipalUnits = filterChildAdminUnits($scope.initMunicipalUnits, [
            { id: $scope.geographicalUnitId },
            { id: $scope.decentralAdminId },
            { id: $scope.regionId },
            { id: $scope.regionalUnitId },
          ].concat(id ? { id } : $scope.municipalities)
        );
      };
      
      /**
       * Αλλαγή πεδίου Δημοτικής Ενότητας.
       *
       * @param {Number} id id Δημοτικής Ενότητας
       */
      $scope.municipalUnitChanged = id => {
        setParentAdminUnit(id);
      };
      
      /**
       * Αλλαγή πεδίου Χώρας.
       *
       * @param {String} isoCode iso code Χώρας
       */
      $scope.countryChanged = isoCode => {
    	  $scope.foreignCity = '';
        $scope.onChange(isoCode);
      };
      
      /**
       * Αλλαγή ένδειξης ξένης Χώρας.
       *
       * @param {Boolean} foreign ένδειξης ξένης Χώρας
       */
      $scope.foreignChanged = foreign => {
        $scope.onChange(foreign);
      };
      
      /**
       * Εκκαθάριση όλων των πεδίων της Γεωγρ. Δομής.
       */
      $scope.clear = () => {
        $scope.geographicalUnitId = null;
        $scope.geographicalUnitChanged(null);
        $scope.foreign = false;
        $scope.foreignCountryIsoCode = null;
        $scope.foreignCity = null;
      };
      
      // Expose clear function
      $scope.setClear({ theDirFn: $scope.clear });
      
      // Expose initAdminUnitLists function
      $scope.setInitLists({ theDirFn: $scope.initAdminUnitLists });
      
      /**
       * Uses jQuery.
       */
      $scope.dataValues = () => {
        return jQuery.map($element.find('select'), el => {
          const $el = angular.element(el);
          const $option = $el.find('option:selected');
          
          return {
            model: $el.attr('ng-model'),
            value: fromNgOption($option.val()),
            text: $option.text(),
          };
        });
      };
      
      // Expose dataValues function
      $scope.getDataValues({ theDirFn: $scope.dataValues });
      
      /**
       * Ορισμός γονικού Διοικητικού Πεδίου.
       *
       * @param {Number} id id πεδίου που έχει οριστεί
       */
      function setParentAdminUnit(id) {
        if (!id) return;
        
        const selected = $scope.adminUnits.find(au => au.id === id);
        const parent = $scope.adminUnits.find(au => au.id === selected.parentId);
        
        switch (parent.level) {
          case AdminUnitLevel.GEOGRAPHICAL_UNIT:
            $scope.geographicalUnitId = parent.id;
            $scope.geographicalUnitChanged($scope.geographicalUnitId);
            break;
          case AdminUnitLevel.DECENTRAL_ADMIN:
            $scope.decentralAdminId = parent.id;
            $scope.decentralAdminChanged($scope.decentralAdminId);
            break;
          case AdminUnitLevel.REGION:
            $scope.regionId = parent.id;
            $scope.regionChanged($scope.regionId);
            break;
          case AdminUnitLevel.REGIONAL_UNIT:
            $scope.regionalUnitId = parent.id;
            $scope.regionalUnitChanged($scope.regionalUnitId);
            break;
          case AdminUnitLevel.MUNICIPALITY:
            $scope.municipalityId = parent.id;
            $scope.municipalityChanged($scope.municipalityId);
            break;
        }
      }
      
      /**
       * Format ονόματος Διοικητικής Μονάδας στο $scope.
       *
       * @param {Object} item Αντικείμενο με όνομα ή και κωδικό
       * @return {String} Φορμαρισμένο όνομα
       */
      $scope.formatName = item => formatName(item);
      
      /**
       * Φιλτράρει έναν πίνακα θυγατρικών αντικειμένων (με ιδιότητα parentId)
       * με βάση πίνακα γονικών αντικειμένων.
       *
       * @param {Array} [children=[]] Πίνακας Περιοχών-παιδιών
       * @param {Array} [parents=[]] Πίνακας Περιοχών-γονέων
       * @return {Array} Πίνακας φιλτραρισμένων θυγατρικών αντικειμένων με βάση τις γονικές
       */
      function filterChildAdminUnits(children = [], parents = []) {
        const parentIds = parents.map(p => p.id) || [];
        
        return children.filter(c => parentIds.includes(c.parentId));
      }
      
      /**
       * Format ονόματος Διοικητικής Μονάδας.
       * ! Άλλαξε ώστε να μην περιλαμβάνεται ο κωδικός.
       *
       * @param {String} name Όνομα
       * @param {String} code Κωδικός
       * @return {String} Φορμαρισμένο όνομα
       */
      function formatName({ name, code } = {}) {
        // return name ? `${name}${code ? ` (${code})` : ''}` : '';
        return name || '';
      }
      
      function fromNgOption(option) {
        return `${option}`.replace(/^(number|object|string):/, '');
      }

    }
  ]);
