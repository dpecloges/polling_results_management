/**
 * Directive για το CkEditor Plugin που χρησιμοποιείται στα Πρότυπα Αναφορών και τις Αναφορές
 * Στο Isolated Scope του περιλαμβάνονται
 * content: το περιεχόμενο hmtl που περιλαμβάνεται στον editor
 * editorOptions: οι παράμετροι δημιουργίας του editor καθώς διαφέρουν στις διάφορες ενότητες
 */
angular.module("app.utils")
    .directive('ckEditor', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            controller: 'CkEditorController',
            scope: {
                content: '=',
                editorOptions: '=',
                api: '='
            },
            link: function (scope, element) {

                var bck = scope.content;
                var ckeditor = CKEDITOR.replace(element[0], scope.editorOptions);

                scope.ckeditor = ckeditor;

                ckeditor.on('instanceReady', function () {

                    scope.content = bck;
                    ckeditor.setData(scope.content);

                    var iframe = $('.cke_wysiwyg_frame').contents();

                    iframe.find('html').css({ 'background-color': '#b0b0b0' });

                    iframe.find('body').css({
                        'width': '170mm',
                        //'height': '297mm',
                        'background-color': '#ffffff',
                        'margin': '0mm',
                        'padding': '5mm'
                    });

                    iframe.find('td').css({ 'padding': '-1px' });

                    $rootScope.$broadcast('menuToggleChanged');

                });

                function updateModel() {
                    scope.content = ckeditor.getData();
                }

                ckeditor.on('change', updateModel);
                ckeditor.on('key', updateModel);
                ckeditor.on('dataReady', updateModel);
                ckeditor.on('blur', updateModel);

                ckeditor.on('beforeCommandExec', function (event) {
                    if (event.data.name == 'print') {
                        scope.hideBorderZeroOnPrint('cke_show_border');
                        scope.hidePageBreaksOnPrint('cke_pagebreak');
                    }
                });

                ckeditor.on('afterCommandExec', function (event) {
                    if (event.data.name == 'print') {
                        scope.showBorderZeroAfterPrint('cke_show_border');
                        scope.showPageBreaksAfterPrint('cke_pagebreak');
                    }
                });

                if (scope.editorOptions.readOnly) {
                    scope.$watch('content', function () {
                        ckeditor.setData(scope.content);
                    });
                }

            }
        };
    }]);
