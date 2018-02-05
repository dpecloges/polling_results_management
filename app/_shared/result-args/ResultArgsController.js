angular.module('app.utils')
  .controller('ResultArgsController', [
    '$scope',
    '$ngBootbox',
    '$translate',
    '$element',
    'AdminUnitService',
    'AdminUnitLevel',
    'CountryService',
    'ElectionCenterService',
    'ElectionDepartmentService',
    'DisplayResultOption',
    function($scope, $ngBootbox, $translate, $element, AdminUnitService, AdminUnitLevel, CountryService, ElectionCenterService,
        ElectionDepartmentService, DisplayResultOption) {
      
      $scope.DisplayResultOption = DisplayResultOption;
      
      $scope.geographicalUnits = [];
      $scope.decentralAdmins = [];
      $scope.regions = [];
      $scope.regionalUnits = [];
      $scope.municipalities = [];
      $scope.municipalUnits = [];
      $scope.countries = [];
      $scope.electionCenters = [];
      $scope.electionDepartments = [];
      $scope.initGeographicalUnits = [];
      $scope.initDecentralAdmins = [];
      $scope.initRegions = [];
      $scope.initRegionalUnits = [];
      $scope.initMunicipalities = [];
      $scope.initMunicipalUnits = [];
      $scope.initElectionCenters = [];
      $scope.initElectionDepartments = [];
                        
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
      
      // Ανάκτηση Εκλ. Κέντρων
      ElectionCenterService.getAll()
        .then(electionCenters => {
          $scope.initElectionCenters = electionCenters;
          $scope.electionCenters = electionCenters;
        });
      
      // Ανάκτηση Εκλ. Τμημάτων
      ElectionDepartmentService.getAll()
        .then(electionDepartments => {
          $scope.initElectionDepartments = electionDepartments;
          $scope.electionDepartments = electionDepartments;
        });
      
      /**
       * Αρχικοποίηση λιστών για προυπάρχουσες τιμές (αποθηκευμένες εγγραφές).
       */
      $scope.initAdminUnitLists = () => {
        if ($scope.electionDepartmentId) {
          $scope.electionDepartmentChanged($scope.electionDepartmentId);
        } else if ($scope.electionCenterId) {
          $scope.electionCenterChanged($scope.electionCenterId);
        } else if ($scope.municipalUnitId) {
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
        } else if ($scope.foreignCountryIsoCode) {
          $scope.countryChanged($scope.foreignCountryIsoCode);
        } else if ($scope.general && $scope.general !== DisplayResultOption.ALL) {
          $scope.generalOptionsChanged();
        }
      };
      
      /**
       * Αλλαγές στα φίλτρα κατά την αλλάγή του γενικού φίλτρου (προέλευση).
       */
      $scope.generalOptionsChanged = option => {
        switch (option) {
          case DisplayResultOption.GREECE:
            $scope.showAdminUnit = true;
            $scope.foreign = false;
            $scope.electionCenters = $scope.initElectionCenters;
            $scope.electionDepartments = $scope.initElectionDepartments;
            break;
          case DisplayResultOption.ABROAD:
            $scope.showAdminUnit = true;
            $scope.foreign = true;
            $scope.foreignChanged(true);
            break;
          case DisplayResultOption.ALL:
          case '':
          default:
            $scope.showAdminUnit = true;
            $scope.electionCenters = $scope.initElectionCenters;
            $scope.electionDepartments = $scope.initElectionDepartments;
        }
        
        $scope.geographicalUnitId = null;
        $scope.decentralAdminId = null;
        $scope.regionId = null;
        $scope.regionalUnitId = null;
        $scope.municipalityId = null;
        $scope.municipalUnitId = null;
        $scope.municipalCommunityId = null;
        $scope.foreignCountryIsoCode = null;
        $scope.electionCenterId = null;
        $scope.electionDepartmentId = null;
        $scope.decentralAdmins = $scope.initDecentralAdmins;
        $scope.regions = $scope.initRegions;
        $scope.regionalUnits = $scope.initRegionalUnits;
        $scope.municipalities = $scope.initMunicipalities;
        $scope.municipalUnits = $scope.initMunicipalUnits;
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
          $scope.electionCenters = $scope.initElectionCenters.filter(ec => ec.geographicalUnitId === id);
          $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
        } else {
          $scope.general = '';
          $scope.decentralAdminId = null;
          $scope.regionId = null;
          $scope.regionalUnitId = null;
          $scope.municipalityId = null;
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          $scope.decentralAdmins = $scope.initDecentralAdmins;
          $scope.regions = $scope.initRegions;
          $scope.regionalUnits = $scope.initRegionalUnits;
          $scope.municipalities = $scope.initMunicipalities;
          $scope.municipalUnits = $scope.initMunicipalUnits;
          $scope.electionCenters = $scope.initElectionCenters;
          $scope.electionDepartments = $scope.initElectionDepartments;
        }
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
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          
          if ($scope.hideGeographicalUnit) {
            $scope.geographicalUnitId = null;
            $scope.geographicalUnitChanged($scope.geographicalUnitId);
          }
        } else {
          $scope.general = DisplayResultOption.GREECE;
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
        $scope.electionCenters = id
          ? $scope.initElectionCenters.filter(ec => ec.decentralAdminId === id)
          : $scope.initElectionCenters.filter(ec => ec.geographicalUnitId === $scope.geographicalUnitId);
        $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
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
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          
          if ($scope.hideGeographicalUnit) {
            $scope.geographicalUnitId = null;
            $scope.geographicalUnitChanged($scope.geographicalUnitId);
          } else if ($scope.hideDecentralAdmin) {
            $scope.decentralAdminId = null;
            $scope.decentralAdminChanged($scope.decentralAdminId);
          }
        } else {
          $scope.general = DisplayResultOption.GREECE;
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
        $scope.electionCenters = id
          ? $scope.initElectionCenters.filter(ec => ec.regionId === id)
          : $scope.initElectionCenters.filter(ec => ec.decentralAdminId === $scope.decentralAdminId);
        $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
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
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          
          if ($scope.hideGeographicalUnit) {
            $scope.geographicalUnitId = null;
            $scope.geographicalUnitChanged($scope.geographicalUnitId);
          } else if ($scope.hideDecentralAdmin) {
            $scope.decentralAdminId = null;
            $scope.decentralAdminChanged($scope.decentralAdminId);
          } else if ($scope.hideRegion) {
            $scope.regionId = null;
            $scope.regionChanged($scope.regionId);
          }
        } else {
          $scope.general = DisplayResultOption.GREECE;
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
        $scope.electionCenters = id
          ? $scope.initElectionCenters.filter(ec => ec.regionalUnitId === id)
          : $scope.initElectionCenters.filter(ec => ec.regionId === $scope.regionId);
        $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
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
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          
          if ($scope.hideGeographicalUnit) {
            $scope.geographicalUnitId = null;
            $scope.geographicalUnitChanged($scope.geographicalUnitId);
          } else if ($scope.hideDecentralAdmin) {
            $scope.decentralAdminId = null;
            $scope.decentralAdminChanged($scope.decentralAdminId);
          } else if ($scope.hideRegion) {
            $scope.regionId = null;
            $scope.decentralAdminChanged($scope.regionId);
          } else if ($scope.hideRegion) {
            $scope.regionalUnitId = null;
            $scope.regionalUnitChanged($scope.regionalUnitId);
          }
        } else {
          $scope.general = DisplayResultOption.GREECE;
        }
        
        setParentAdminUnit(id);

        $scope.municipalUnits = filterChildAdminUnits($scope.initMunicipalUnits, [
            { id: $scope.geographicalUnitId },
            { id: $scope.decentralAdminId },
            { id: $scope.regionId },
            { id: $scope.regionalUnitId },
          ].concat(id ? { id } : $scope.municipalities)
        );
        $scope.electionCenters = id
          ? $scope.initElectionCenters.filter(ec => ec.municipalityId === id)
          : $scope.initElectionCenters.filter(ec => ec.regionalUnitId === $scope.regionalUnitIdd);
        $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
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
        if (isoCode) {
          $scope.general = DisplayResultOption.ABROAD;
          $scope.electionCenters = $scope.initElectionCenters.filter(ec => ec.foreignCountryIsoCode === isoCode);
        } else {
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          $scope.electionCenters = $scope.initElectionCenters.filter(ec => ec.foreign === $scope.foreign);
        }
        
    	  $scope.foreignCity = '';
        $scope.electionDepartments = filterChildElectionDepartments(
          $scope.initElectionDepartments,
          $scope.electionCenterId ? [{ id: $scope.electionCenterId}] : $scope.electionCenters
        );
      };
      
      /**
       * Αλλαγή ένδειξης ξένης Χώρας.
       *
       * @param {Boolean} foreign ένδειξης ξένης Χώρας
       */
      $scope.foreignChanged = foreign => {
        if (foreign) {
          $scope.geographicalUnitId = null;
          $scope.decentralAdminId = null;
          $scope.regionId = null;
          $scope.regionalUnitId = null;
          $scope.municipalityId = null;
          $scope.municipalUnitId = null;
          $scope.municipalCommunityId = null;
          $scope.electionCenterId = null;
          $scope.electionDepartmentId = null;
          $scope.foreignCountryIsoCode = null;
          $scope.decentralAdmins = $scope.initDecentralAdmins;
          $scope.regions = $scope.initRegions;
          $scope.regionalUnits = $scope.initRegionalUnits;
          $scope.municipalities = $scope.initMunicipalities;
          $scope.municipalUnits = $scope.initMunicipalUnits;
        }

        $scope.electionCenters = $scope.initElectionCenters.filter(ec => ec.foreign === foreign);
        $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
      };
      
      /**
       * Προσαρμογή του φίλτρου γεωγρ. δομής σύμφωνα με τη δομή του Ε.Κ.
       */
      $scope.electionCenterChanged = electionCenterId => {
        const selElectionCenter = $scope.electionCenters.find(ec => ec.id === electionCenterId) || {};
  
        if (electionCenterId) {
          $scope.general = selElectionCenter.foreign ? DisplayResultOption.ABROAD : DisplayResultOption.GREECE;
          $scope.electionDepartments = $scope.initElectionDepartments.filter(ed => ed.electionCenterId === electionCenterId);
        } else {
          $scope.electionDepartments = filterChildElectionDepartments($scope.initElectionDepartments, $scope.electionCenters);
          $scope.electionDepartmentId = null;
        }
        
        if (selElectionCenter.municipalityId) {
          $scope.municipalityId = selElectionCenter.municipalityId;
          $scope.municipalityChanged($scope.municipalityId);
        } else if (selElectionCenter.regionalUnitId) {
          $scope.regionalUnitId = selElectionCenter.regionalUnitId;
          $scope.regionalUnitChanged($scope.regionalUnitId);
        } else if (selElectionCenter.regionId) {
          $scope.regionId = selElectionCenter.regionId;
          $scope.regionChanged($scope.regionId);
        } else if (selElectionCenter.decentralAdminId) {
          $scope.decentralAdminId = selElectionCenter.decentralAdminId;
          $scope.decentralAdminChanged($scope.decentralAdminId);
        } else if (selElectionCenter.geographicalUnitId) {
          $scope.geographicalUnitId = selElectionCenter.geographicalUnitId;
          $scope.geographicalUnitChanged($scope.geographicalUnitId);
        } else if (selElectionCenter.foreignCountryIsoCode) {
          $scope.foreignCountryIsoCode = selElectionCenter.foreignCountryIsoCode;
          $scope.foreign = selElectionCenter.foreign;
          $scope.countryChanged($scope.foreignCountryIsoCode);
        } else if (selElectionCenter.foreign) {
          $scope.foreign = selElectionCenter.foreign;
          $scope.foreignChanged($scope.foreign);
        }
        
        // $scope.generalOptionsChanged($scope.args.general);
      };
      
      /**
       * Προσαρμογή του φίλτρου γεωγρ. δομής σύμφωνα με τη δομή του Ε.Τ. (από το Ε.Κ.).
       */
      $scope.electionDepartmentChanged = electionDepartmentId => {
        const selElectionDepartment = $scope.electionDepartments.find(ed => ed.id === electionDepartmentId) || {};
        const selElectionCenter = $scope.electionCenters.find(ec => ec.id === selElectionDepartment.electionCenterId) || {};
        
        if (electionDepartmentId) {
          $scope.electionCenterId = selElectionCenter.id;
          $scope.electionCenterChanged($scope.electionCenterId);
        }
      };

      /**
       * Εκκαθάριση όλων των πεδίων της δομής.
       */
      $scope.clear = () => {
        // $scope.electionDepartmentId = null;
        // $scope.electionDepartmentChanged(null);
        $scope.geographicalUnitId = null;
        $scope.geographicalUnitChanged(null);
        $scope.foreign = false;
        $scope.foreignCountryIsoCode = null;
        $scope.foreignCity = null;
      };
      
      /**
       * Uses jQuery.
       */
      $scope.dataValues = () => {
        return jQuery.map($element.find('select'), el => {
            const $el = angular.element(el);
            const $option = $el.find('option:selected');
            const visibility = $el.attr('visible');
                        
            return {
              model: $el.attr('ng-model'),
              value: fromNgOption($option.val()),
              text: $option.text(),
              visibility: visibility === 'true',
            };
          });
      };
      
      // Expose clear function
      if ($scope.setClear) {
        $scope.setClear({ theDirFn: $scope.clear });
      }
      
      // Expose dataValues function
      if ($scope.getDataValues) {
        $scope.getDataValues({ theDirFn: $scope.dataValues });
      }
      
      // Expose initAdminUnitLists function
      if ($scope.initLists) {
        $scope.initLists({ theDirFn: $scope.initAdminUnitLists });
      }
      
      /**
       * Format ονόματος Διοικητικής Μονάδας στο $scope.
       *
       * @param {Object} item Αντικείμενο με όνομα ή και κωδικό
       * @return {String} Φορμαρισμένο όνομα
       */
      $scope.formatName = item => formatName(item);
      
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
      
      function noAdminUnitSelected(obj) {
        return adminUnitProps.every(p => !obj[p]);
      }
      
      function compareAdminUnitProps(obj1, obj2) {
        return Object.keys(obj1)
          .filter(key => adminUnitProps.includes(key))
          .every(key => obj1[key] === obj2[key]);
      }
      
      function filterChildElectionCenters(children = [], parents = []) {
        const parentIds = parents.map(p => p.id) || [];
        
        return children.filter(c => parentIds.includes(c.electionCenterId));
      }
      
      function filterChildElectionDepartments(children = [], parents = []) {
        const parentIds = parents.map(p => p.id) || [];
        
        return children.filter(c => parentIds.includes(c.electionCenterId));
      }
      
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
