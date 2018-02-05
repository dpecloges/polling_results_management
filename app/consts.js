angular.module('app')

  .constant('APP_CONFIG', window.appConfig)
  
  // Set to 2 minutes
  .constant('AutoRefresh', { INTERVAL: 120000 })
  
  .constant('AdminUnitLevel', {
    GEOGRAPHICAL_UNIT: 1,
    DECENTRAL_ADMIN: 2,
    REGION: 3,
    REGIONAL_UNIT: 4,
    MUNICIPALITY: 5,
    MUNICIPAL_UNIT: 6,
  })
  
  .constant('StringNumbers', {
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    10: 'Ten',
  })
  
  // Γύρος Εκλογικής Διαδικασίας
  .constant('ElectionRound', {
    FIRST: 'FIRST',
    SECOND: 'SECOND',
  })
  
  .constant('ResultType', {
    general: { type: 'GENERAL', order: 1 },
    foreignCountryIsoCode: { type: 'FOREIGN_COUNTRY', order: 2 },
    foreignCity: { type: 'FOREIGN_CITY', order: 3 },
    geographicalUnitId: { type: 'GEOGRAPHICAL_UNIT', order: 4 },
    decentralAdminId: { type: 'DECENTRAL_ADMIN', order: 5 },
    regionId: { type: 'REGION', order: 6 },
    regionalUnitId: { type: 'REGIONAL_UNIT', order: 7 },
    municipalityId: { type: 'MUNICIPALITY', order: 8 },
    municipalUnitId: { type: 'MUNICIPAL_UNIT', order: 9 },
    electionCenterId: { type: 'ELECTION_CENTER', order: 10 },
    electionDepartmentId: { type: 'ELECTION_DEPARTMENT', order: 11 },
    get(type) {
      return Object.keys(this).find(key => this[key].type === type);
    },
  })
  
  .constant('DisplayResultOption', {
    ALL: 'ALL',
    GREECE: 'GREECE',
    ABROAD: 'ABROAD',
  })

  .constant('ContributionType', {
    CANDIDATE_REPRESENTATIVE: {
      id: 'CANDIDATE_REPRESENTATIVE',
      messageKey: 'mg.electiondepartment.list.grid.candidateRepresentative'
    },
    COMMITTEE_LEADER: {
      id: 'COMMITTEE_LEADER',
      messageKey: 'mg.electiondepartment.list.grid.committeeLeader'
    },
    COMMITTEE_LEADER_VICE: {
      id: 'COMMITTEE_LEADER_VICE',
      messageKey: 'mg.electiondepartment.list.grid.committeeLeaderVice'
    },
    COMMITTEE_MEMBER: {
      id: 'COMMITTEE_MEMBER',
      messageKey: 'mg.electiondepartment.list.grid.committeeMember'
    },
    ID_VERIFIER: {
      id: 'ID_VERIFIER',
      messageKey: 'mg.electiondepartment.list.grid.idVerifier'
    },
    ID_VERIFIER_VICE: {
      id: 'ID_VERIFIER_VICE',
      messageKey: 'mg.electiondepartment.list.grid.idVerifierVice'
    },
    TREASURER: {
      id: 'TREASURER',
      messageKey: 'mg.electiondepartment.list.grid.treasurer'
    },
  })
  
  .constant('AttachmentType', {
    RESULTS: 'RESULTS',
    CASHIER: 'CASHIER',
  })
  
  .constant('Sort', {
    ASC: 'ASC',
    DESC: 'DESC',
  })
  
  // Mapping για τα states και τις αντίστοιχες ενότητες του αριστερού μενού
  .constant('NavigationState', {
    'app.mg.electioncenter.list': 'mgElectionCenterList',
    'app.mg.electioncenter.view': 'mgElectionCenterView',
    'app.mg.electiondepartment.list': 'mgElectionDepartmentList',
    'app.mg.electiondepartment.view': 'mgElectionCenterView',
    'app.ep.verification.view': 'epVerificationView',
    'app.ep.snapshot.view': 'epSnapshotView',
    'app.ep.statistics.view': 'epStatisticsView',
    'app.rs.submission.view': 'rsSubmissionView',
    'app.rs.display.view': 'rsDisplayView',
    'app.rs.electiondepartment.list': 'rsElectionDepartmentList',
    'app.us.volunteer.list': 'usVolunteerList',
    'app.us.user.list': 'usUserList',
    'app.us.user.view': 'usUserView',
  });
