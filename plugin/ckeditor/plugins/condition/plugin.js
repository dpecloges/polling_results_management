/**
 * Plugin για το CkEditor για τη διαχείριση Συνθηκών (Conditions)
 */
CKEDITOR.plugins.add( 'condition', {

    icons: 'condition',

    /**
     * Αρχικοποίηση του plugin
     * @param editor
     */
    init: function( editor ) {

        /**
         * Ορισμός εντολής για το άνοιγμα του Custom Dialog Window
         */
        editor.addCommand( 'condition', new CKEDITOR.dialogCommand( 'conditionDialog' ) );

        /**
         * Προσθήκη κουμπιού στο toolbar
         */
        editor.ui.addButton( 'Condition', {
            label: 'Συνθήκη',
            command: 'condition',
            toolbar: 'insert,200'
        });

        /**
         * Προσθήκη επιλογής στο δεξί κλικ εάν βρισκόμαστε σε div tag
         */
        if ( editor.contextMenu ) {

            editor.addMenuGroup( 'conditionGroup' );
            editor.addMenuItem( 'conditionItem', {
                label: 'Επεξεργασία Συνθήκης',
                icon: this.path + 'icons/condition.png',
                command: 'condition',
                group: 'conditionGroup'
            });

            editor.contextMenu.addListener( function( element ) {
                if ( element.getAscendant( 'div', true ) ) {
                    return { conditionItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }

        /**
         * Προσθήκη του Custom Dialog Window στο CkEditor Control
         */
        CKEDITOR.dialog.add( 'conditionDialog', this.path + 'dialogs/condition.js' );
    }
});