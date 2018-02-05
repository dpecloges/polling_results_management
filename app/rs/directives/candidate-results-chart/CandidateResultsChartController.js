angular.module('app.rs')
  .controller('CandidateResultsChartController', [
    '$scope',
    '$ngBootbox',
    '$translate',
    'CandidateService',
    'StringNumbers',
    function($scope, $ngBootbox, $translate, CandidateService, StringNumbers) {
      
      // Bar chart colors - x10
      const chartColors = [
        'rgba(143,182,198,0.7)',
        'rgba(0,173,249,0.7)',
        'rgba(153,102,255,0.7)',
        'rgba(70,191,189,0.7)',
        'rgba(206,66,77,0.7)',
        'rgba(255,159,64,0.7)',
        'rgba(77,83,96,0.7)',
        'rgba(255,99,132,0.7)',
        'rgba(55,61,156,0.7)',
        'rgba(180,91,146,0.7)',
      ];
      
      $scope.candidates = [];
  
      function percent2d(number1, number2) {
        if (number2 === 0) return 0;
    
        const perc = (number1 / number2) * 100;
        return !isNaN(perc) ? perc.toFixed(2) : 0;
      }
      
      // Bar chart options from Chart.js
      $scope.chartOptions = {
        layout: {
          padding: {
            left: 10,
            right: 100
          }
        },
        scales: {
          xAxes: [{
            type: 'linear',
            display: false,
            gridLines: { display: false },
            // barPercentage: 0.8,
            // categoryPercentage: 0.1,
            ticks: {
              beginAtZero: true,
            }
          }],
          yAxes: [{
            gridLines: { display: false },
            barPercentage: 0.7,
            // categoryPercentage: 0.7,
          }],
        },
        tooltips: { enabled: false },
        events: [],
        animation: {
          
          /**
           * Draw bar numbers on animation complete.
           */
          onComplete() {
            const chartInstance = this.chart;
            const ctx = chartInstance.ctx;

            ctx.font = Chart.helpers.fontString(
              $scope.valuesFontSize || Chart.defaults.global.defaultFontSize,
              $scope.valuesFontStyle || Chart.defaults.global.defaultFontStyle,
              $scope.valuesFontFamily || Chart.defaults.global.defaultFontFamily
            );
            ctx.textAlign = 'left';
            ctx.textBaseline = 'hanging';
  
            let totalValidVotes = 0;
            for (var i = 0; i < this.data.datasets[0].data.length; i++) {
              totalValidVotes += (!this.data.datasets[0].data[i] ? 0 : this.data.datasets[0].data[i]);
            }
            
            this.data.datasets.forEach((dataset, i) => {
              const meta = chartInstance.controller.getDatasetMeta(i);

              meta.data.forEach((bar, index) => {
                // Do not show anything on empty results
                if (!isNaN(dataset.data[index]) && dataset.data[index] > 0) {
                  let percent = percent2d(dataset.data[index], totalValidVotes);
                  ctx.fillText(dataset.data[index] + ' (' + percent + '%)', bar._model.x + 6, bar._model.y - 5);
                } else {
                  ctx.fillText('0 (0.00%)', bar._model.x + 6, bar._model.y - 5);
                }
              });
            });
          },
        }
      };
      
      $scope.datasetOverride = [{
        // borderWidth: 2,
        backgroundColor : 'rgba(70,191,189,0.7)',
        borderColor : 'rgba(49,133,132,1)',
      }];

      // Ανάκτηση Υποψηφίων Εκλογικής Διαδικασίας
      CandidateService.getByCurrentElectionProcedure()
        .then(candidates => {
          $scope.candidates = candidates;

          // Αρχικοποίηση διαγράμματος
          $scope.chartLabels = $scope.candidates.map(c => $scope.formatName(c));
          $scope.chartData = $scope.candidates.map(() => 0);
        });

      // Το διάγραμμα ενημερώνεται παρακολουθώντας το model.
      $scope.$watch('model', () => {
        // Ορισμός δεδομένων διαγράμματος. Ταξινόμηση με βάση τα αποτελέσματα.
        const chartDataLabels = $scope.candidates.map(c => ({
            label: $scope.formatName(c),
            data: $scope.model[$scope.candidateVotesModel(c)],
          }))
          .sort((c1, c2) => c2.data - c1.data);
        
        $scope.chartLabels = chartDataLabels.map(d => d.label);
        $scope.chartData = [chartDataLabels.map(d => d.data)];
        
      });

      /**
       * Διαμόρφωση model των πεδίων.
       *
       * @param {Number} order Αρίθμηση υποψηφίου
       * @return {[type]} Στοιχείο του model για το πεδίο
       */
      $scope.candidateVotesModel = ({ order }) => `candidate${StringNumbers[order]}Votes`;

      /**
       * Format ονόματος.
       *
       * @param {String} lastName Επίθετο
       * @param {String} firstName Όνομα
       * @param {String} fatherName Πατρώνυμο
       * @return {String} Φορμαρισμένο όνομα
       */
      $scope.formatName = ({ lastName, firstName, fatherName }) =>
        `${lastName} ${firstName} ${fatherName ? ` (${fatherName})` : ''}`;

    }
  ]);
