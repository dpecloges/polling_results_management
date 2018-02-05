(function() {
    
    'use strict';
    
    angular.module('app.utils')
        .controller('AdminUnitInfoController', [
            '$scope',
            '$ngBootbox',
            '$translate',
            'LocationService',
            function($scope, $ngBootbox, $translate, LocationService) {
                
                // Ανάκτηση των ενεργών δήμων στην πρώτη φόρτωση
                $scope.municipalities = LocationService.getMunicipalities(true, $scope.municipalityId);
                $scope.prefectures = LocationService.getPrefectures();
                
                $scope.fetchedAllMunicipalities = false;
                
                /**
                 * Μέθοδος αρχικοποίησης δεδομένων βάσει του Δήμου της εγγραφής
                 * Η μέθοδος καλείται μόνο στην πρώτη φόρτωση
                 * Παίρνει το id του ενεργού δήμου και βάσει αυτού φέρνει τη λίστα των δημοτικών ενοτήτων,
                 * αρχικοποιεί την περιφερειακή ενότητα
                 * και τα δεδομένα για Δημοτικές Ενότητες και Τ/Δ Κοινότητες
                 */
                $scope.initializeMunicipality = function() {
                    $scope.activeMunicipality = {};
                    $scope.municipalUnits = [];
                    $scope.municipalCommunities = [];
                    
                    if($scope.municipalityId) {
                        // Ανάκτηση τρέχοντος δήμου
                        $scope.activeMunicipality = LocationService.getActiveMunicipality($scope.municipalityId);
                        
                        $scope.activeMunicipality.$promise.then(function(result) {
                            $scope.tempPrefectureId = result.prefectureId;
                            // Ανάκτηση τοπικών/δημοτικών κοινοτήτων με βάση τη δημοτική ενότητα
                            // ή τον τρέχοντα δήμο (κρατώντας την παλιά τιμή της τοπικής/δημοτικής κοινότητας)
                            $scope.initializeUnitsAndCommunity(false);
                        });
                    }
                };
                
                $scope.initializeMunicipality();
                
                /**
                 * Μέθοδος αρχικοποίηση Δημοτικής ενότητας και Τ/Δ Κοινότητας
                 * Ανάλογα με το αν περνάει τιμές και για τα δυο τα πεδία ή μόνο για το πεδίο της κοινότητας
                 * γίνονται οι αναθέσεις στις τοπικές μεταβλητές temp...
                 */
                $scope.initializeUnitsAndCommunity = function() {
                    if($scope.municipalUnitExists) {
                        // Αν έχει δοθεί τιμή στη δημοτική ενότητα τότε μπαίνει το κάθε στοιχείο ΔΕ και Τ/Δ στο αντίστοιχο πεδίο
                        $scope.tempMunicipalUnitId = $scope.municipalUnitId;
                        $scope.tempMunicipalCommunityId = $scope.municipalCommunityId;
                        
                        $scope.getMunicipalUnits();
                        $scope.getMunicipalCommunities();
                    }
                    else {
                        // Εάν δεν έχει δοθεί τιμή στη δημοτική ενότητα τότε βλέπουμε τι τύπου είναι η εγγραφή scope.municipalCommunityId
                        // Αν είναι ΔΕ τότε πάει στο πεδίο scope.municipalUnitId, αν είναι Τ/Δ πηγαίνει στο πεδίο scope.municipalCommunityId
                        // και ψάχνουμε να βρούμε την αντίστοιχη ΔΕ για να βάλουμε στο πεδίο scope.municipalUnitId
                        $scope.getMunicipalUnits();
                        
                        if($scope.municipalCommunityId) {
                            $scope.adminUnitType = LocationService.getAdminUnitType($scope.municipalCommunityId);
                            $scope.adminUnitType.$promise.then(function(result) {
                                if($scope.adminUnitType.type === 'MUNICIPALUNIT') {
                                    $scope.tempMunicipalUnitId = $scope.municipalCommunityId;
                                    $scope.getMunicipalCommunities();
                                }
                                else if($scope.adminUnitType.type === 'MUNICIPALCOMMUNITY') {
                                    $scope.tempMunicipalCommunityId = $scope.municipalCommunityId;
                                    $scope.tempMunicipalUnitId = $scope.adminUnitType.masterid;
                                    
                                    $scope.getMunicipalCommunities();
                                    
                                    // Αν δεν έχει δοθεί δημοτική ενότητα και η τιμή του community δεν αναφέρεται σε δημοτική ενότητα, αρχικοποίησή της από την τοπική/δημοτική κοινότητα.
                                    $scope.municipalCommunities.$promise.then(function(result) {
                                        
                                        // Ανάκτηση αντικειμένου από τη λίστα με βάση την τιμή ενός property
                                        var object = $.grep($scope.municipalCommunities, function(e) {
                                            return e.id === $scope.municipalCommunityId;
                                        });
                                        
                                        if(typeof object[0] !== 'undefined') {
                                            $scope.tempMunicipalUnitId = object[0].municipalUnitId;
                                        }
                                        
                                    });
                                }
                            });
                        }
                    }
                };
                
                // **********************************************************************************
                // Ανάκτηση δημοτικών ενοτήτων
                $scope.getMunicipalUnits = function() {
                    $scope.municipalUnits = LocationService.getMunicipalUnits($scope.tempMunicipalUnitId, $scope.activeMunicipality.id);
                };
                
                $scope.getMunicipalCommunities = function() {
                    $scope.municipalCommunities = LocationService.getMunicipalCommunities($scope.tempMunicipalCommunityId, $scope.tempMunicipalUnitId, $scope.activeMunicipality.id);
                };
                
                // *********************************************************************************************************************************************
                // Μέθοδος για την αλλαγή του Δήμου
                $scope.changeMunicipality = function() {
                    // Εφόσον αλλάζει ο δήμος μηδενίζουμε τα στοιχεία της Δημοτικής Ενότητας και της Τ/Δ Κοινότητας
                    // και της περιγραφής Δήμου (η περιγραφή αφορά παλιά δεδομένα)
                    $scope.tempMunicipalUnitId = null;
                    $scope.tempMunicipalCommunityId = null;
                    
                    $scope.municipalUnitId = null;
                    $scope.municipalCommunityId = null;
                
                    $scope.placeDescr = null;

                    // Αδειάζουμε τις λίστες και τιμές για ενεργό δήμο, ΔΕ και Τ/Δ Κοινότητες
                    $scope.activeMunicipality = {};
                    $scope.municipalUnits = [];
                    $scope.municipalCommunities = [];
                    
                    if($scope.municipalityId) {
                        // Ανάκτηση τρέχοντος δήμου
                        $scope.activeMunicipality = LocationService.getActiveMunicipality($scope.municipalityId);

                        $scope.activeMunicipality.$promise.then(function(result) {

                            // Έλεγχος ύπαρξης του τρέχοντος δήμου στη λίστα (περίπτωση ανενεργού δήμου που δεν υπάρχει στους ενεργούς)
                            let municipalityFound = $scope.municipalities.find(x => x.id === $scope.municipalityId);

                            if (!municipalityFound) {
                                LocationService.getMunicipality($scope.municipalityId).$promise.then(function (result) {
                                    let currentMunicipality = result;
                                    let find2 = $scope.municipalities.findIndex(x => x.name >= currentMunicipality.name);
                                    $scope.municipalities.splice(find2, 0, currentMunicipality);
                                });
                            }

                            // Θέτουμε την τιμή για την Περιφερειακή Ενότητα
                            $scope.tempPrefectureId = $scope.activeMunicipality.prefectureId;
                            // Ανάκτηση δημοτικών ενοτήτων και τ/δ κοινοτήτων με βάση τον τρέχοντα δήμο
                            $scope.getMunicipalUnits();
                            $scope.getMunicipalCommunities();
                        });
                    }                    

                };
                // *********************************************************************
                
                // *********************************************************************
                
                /**
                 * Μέθοδος για την αλλαγή του νομού.
                 */
                $scope.changedPrefecture = function(id) {
                    // Ανάθεση παραμέτρου με το id του Νομού αν είναι ορισμένη (ακόμα και null).
                    if(id !== undefined) $scope.tempPrefectureId = id;
                    
                    // Εφόσον αλλάζει ο νομός μηδενίζουμε τα στοιχεία του
                    // Δήμου, της Δημοτικής Ενότητας και της Τ/Δ Κοινότητας.
                    $scope.tempMunicipalUnitId = null;
                    $scope.tempMunicipalCommunityId = null;
                    $scope.municipalityId = null;
                    $scope.municipalUnitId = null;
                    $scope.municipalCommunityId = null;
                    
                    // Αν εχει επιλεγεί περιφερειακή ενότητα φιλτράρουμε τους δήμους
                    // αλλιώς τους φέρνουμε όλους.
                    $scope.municipalities = $scope.tempPrefectureId > 0 ?
                        LocationService.getActiveMunicipalitiesByPrefecture($scope.tempPrefectureId) :
                        LocationService.getMunicipalities(true, $scope.municipalityId);
                };
                
                /**
                 * Μέθοδος για την αλλαγή της ΔΕ.
                 */
                $scope.changedMunicipalUnit = function() {
                    $scope.tempMunicipalCommunityId = null;
                    
                    if($scope.municipalUnitExists) { // Εάν έχει δοθεί στην αρχικοποίηση ΔΕ τότε η τιμή της κάθε μεταβλητής πηγαίνει στην αντίστοιχη
                        $scope.municipalUnitId = $scope.tempMunicipalUnitId;
                        $scope.municipalCommunityId = null;
                    }
                    else { // Εάν δεν έχει δοθεί στην αρχικοποίηση ΔΕ
                        $scope.municipalCommunityId = $scope.tempMunicipalUnitId;
                    }
                    
                    $scope.activeMunicipality.$promise.then(function(result) {
                        // Ανάκτηση δημοτικών ενοτήτων και τ/δ κοινοτήτων με βάση τον τρέχοντα δήμο
                        $scope.getMunicipalCommunities();
                    });
                    
                };
                // *********************************************************************************************************************************************
                
                
                // *********************************************************************************************************************************************
                // Μέθοδος για την αλλαγή της Τ/Δ Κοινότητας - Αν μπει τιμή στην Τ/Δ Κοινότητα τότε η τιμή αυτή μπαίνει στο scope.municipalCommunityId
                $scope.changedMunicipalCommunity = function() {
                    if($scope.municipalUnitExists) { // Εάν έχει δοθεί στην αρχικοποίηση ΔΕ τότε η τιμή της Τ/Δ πηγαίνει στο αντίστοιχο στοιχείο
                        $scope.municipalCommunityId = $scope.tempMunicipalCommunityId;
                    }
                    else { // Εάν δεν έχει δοθεί στην αρχικοποίηση ΔΕ
                        if($scope.tempMunicipalCommunityId) { // Εάν ο χρήστης έδωσε τιμή στην Τ/Δ τότε μπαίνει αυτό το πεδίο
                            $scope.municipalCommunityId = $scope.tempMunicipalCommunityId;
                        }
                        else { // Εάν δεν έδωσε τιμή ή μπήκε το κενό τότε στο πεδίο μπαίνει η τιμή της ΔΕ
                            $scope.municipalCommunityId = $scope.tempMunicipalUnitId;
                        }
                    }
                    
                    // Εάν ο χρήστης έχει καθορίσει Τ/Δ Κοινότητα χωρίς να έχει ορίσει Δημοτική Ενότητα
                    //  ή είχε ορίσει διαφορετική Δημοτική Ενότητα αν είχε φιλτράρει τις Τ/Δ Κοινότητες βάσει Δήμου
                    //  τότε βάζουμε αυτόματα το id της από το MasterId της Τ/Δ Κοινότητας
                    if($scope.tempMunicipalCommunityId) {
                        $scope.municipalCommunities.$promise.then(function(result) {
                            // Ανάκτηση αντικειμένου από τη λίστα με βάση την τιμή ενός property
                            var object = $.grep($scope.municipalCommunities, function(e) {
                                return e.id === $scope.municipalCommunityId;
                            });
                            if(typeof object[0] !== 'undefined') {
                                $scope.tempMunicipalUnitId = object[0].municipalUnitId;
                                
                                if($scope.municipalUnitExists) {
                                    $scope.municipalUnitId = object[0].municipalUnitId;
                                }
                            }
                        });
                    }
                    
                };
                // *********************************************************************************************************************************************
                
                // Κουμπί ανάκτησης όλων των δήμων
                $scope.fetchAllMunicipalities = function() {
                    // Bootbox επιβεβαίωσης
                    $ngBootbox.customDialog({
                        message: $translate.instant('common.adminUnit.fetchAllMunicipalities'),
                        title: $translate.instant('global.confirm'),
                        className: '',
                        buttons: {
                            warning: {
                                label: $translate.instant('global.no'),
                                className: "btn-danger",
                                callback: function() {
                                    
                                }
                            },
                            success: {
                                label: $translate.instant('global.yes'),
                                className: "btn-primary",
                                callback: function() {
                                    $scope.municipalities = LocationService.getMunicipalities(false, $scope.municipalityId);
                                    $scope.fetchedAllMunicipalities = true;
                                }
                            }
                        }
                    });
                };
                
                // Έλεγχος αν ο επιλεγμένος δήμος είναι ενεργός
                $scope.municipalityIsActive = function() {
                    if($scope.municipalityId) {
                        var object = $.grep($scope.municipalities, function(e) {
                            return e.id === $scope.municipalityId;
                        });
                        
                        if(typeof object !== 'undefined' && object.length > 0) {
                            return !object[0].isActive;
                        }
                    }
                    
                    return false;
                };
                
                //Ορισμός δήμου, δημοτικής ενότητας και τ/δ κοινότητας προγραμματιστικά
                $scope.setNewFields = function(newMunicipalityId, newMunicipalUnitId, newMunicipalCommunityId) {
                    
                    $scope.municipalityId = newMunicipalityId;
                    $scope.changeMunicipality();
                    
                    if(!newMunicipalityId) {
                        //Μηδενισμός νομού
                        $scope.tempPrefectureId = null;
                        
                        //Επιστροφή
                        return;
                    }
                    
                    if(newMunicipalUnitId && newMunicipalCommunityId) {
                        //Έχει δοθεί ΔΕ και ΤΔΚ
                        
                        //Ορισμός και αλλαγή ΔΕ
                        //Αναμονή
                        //Ορισμός και αλλαγή ΤΔΚ
                        
                        var deregisterUnitsWatcher = $scope.$watch('municipalUnits', function(newValue, oldValue) {
                            if(newValue && newValue.length > 0) {
                                
                                $scope.tempMunicipalUnitId = newMunicipalUnitId;
                                $scope.changedMunicipalUnit();
                                
                                deregisterUnitsWatcher();
                                
                                var deregisterCommunitiesWatcher = $scope.$watch('municipalCommunities', function(newValue, oldValue) {
                                    if(newValue && newValue.length > 0) {
                                        
                                        $scope.tempMunicipalCommunityId = newMunicipalCommunityId;
                                        $scope.changedMunicipalCommunity();
                                        
                                        deregisterCommunitiesWatcher();
                                    }
                                }, true);
                                
                            }
                        }, true);
                        
                    }
                    else if(newMunicipalUnitId && !newMunicipalCommunityId) {
                        //Έχει δοθεί μόνο ΔΕ
                        
                        //Ορισμός και αλλαγή ΔΕ
                        
                        var deregisterUnitsWatcher = $scope.$watch('municipalUnits', function(newValue, oldValue) {
                            if(newValue && newValue.length > 0) {
                                
                                $scope.tempMunicipalUnitId = newMunicipalUnitId;
                                $scope.changedMunicipalUnit();
                                
                                deregisterUnitsWatcher();
                            }
                        }, true);
                        
                    }
                    else if(!newMunicipalUnitId && newMunicipalCommunityId) {
                        //Έχει δοθεί μόνο ΤΔΚ
                        
                        //Ορισμός και αλλαγή ΤΔΚ
                        
                        var deregisterCommunitiesWatcher = $scope.$watch('municipalCommunities', function(newValue, oldValue) {
                            if(newValue && newValue.length > 0) {
                                
                                $scope.tempMunicipalCommunityId = newMunicipalCommunityId;
                                $scope.changedMunicipalCommunity();
                                
                                deregisterCommunitiesWatcher();
                            }
                        }, true);
                        
                    }
                    
                };
                
                
                // Έκθεση δημόσιου API.
                // Χρησιμεύει στην πρόσβαση γονικών directives.
                $scope.api = {
                    changeMunicipality: $scope.changeMunicipality,
                    changedPrefecture: $scope.changedPrefecture,
                    setNewFields: $scope.setNewFields
                };
                
            }
        ]);
    
})();
