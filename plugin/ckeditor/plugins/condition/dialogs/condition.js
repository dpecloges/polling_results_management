/**
 * Καθορισμός - Περιγραφή του Custom Dialog της Διαχείρισης των Συνθηκών
 */
CKEDITOR.dialog.add( 'conditionDialog', function ( editor ) {

    var expressionTextarea;
    var allTagsList;

    /**
     * Μέθοδος εισαγωγής - προσθήκης της επιλεγμένης τιμής (πχ. πάτημα κάποιου κουμπιού από τα διαθέσιμα)
     * ή του επιλεγμένου tag (πεδίου) στο textarea της έκφρασης της συνθήκης
     * Η εισαγωγή γίνεται στο τρέχον σημείο του κέρσορα
     * @param value
     */
    insertValueInExpression = function (value) {

        var inputElement = expressionTextarea.getInputElement();
        var v = expressionTextarea.getValue();

        var inputElementId = inputElement.getId();
        var inputElementJq = $("#" + inputElementId)[0];

        var selectionStartPos = inputElementJq.selectionStart;
        var selectionEndPos = inputElementJq.selectionEnd;

        var textBefore = v.substring(0,  selectionStartPos);
        var textAfter  = v.substring(selectionEndPos, v.length);

        if (!textBefore) textBefore = "";
        if (!textAfter) textAfter = "";

        expressionTextarea.setValue(textBefore + " " + value + " " + textAfter);
        var newPos = selectionStartPos + value.length + 2;

        inputElement.focus();
        inputElementJq.setSelectionRange(newPos, newPos);
    };

    return {

        title: 'Ιδιότητες Συνθήκης',
        minWidth: 500,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'hbox',
                        widths: [ '25%', '75%' ],
                        children: [
                            {
                                type: 'html',
                                html: 'Περιγραφή Συνθήκης:'
                            },
                            {
                                type: 'text',
                                id: 'description',
                                setup: function (element) {
                                    this.setValue(element.getAttribute("condition-description"));
                                },
                                commit: function (element) {
                                    element.setAttribute("condition-description", this.getValue().trim());
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        widths: [ '25%', '75%' ],
                        children: [
                            {
                                type: 'html',
                                html: 'Επιλογή Πεδίου Tag:'
                            },
                            {
                                type: 'select',
                                id: 'field',
                                width: '100% !important',
                                style: 'width: 100%',
                                items: [
                                    ['Επιλέξτε...', '']
                                ],
                                onLoad: function (element) {

                                    //Γίνεται populate η λίστα με τα διαθέσιμα πεδία της πηγής

                                    var tagsListElement = document.getElementById("tagsList");

                                    if (tagsListElement) {

                                        var tagsList2 = tagsListElement.value;
                                        tagsList = JSON.parse(tagsList2);

                                        allTagsList = tagsList;

                                        //Ταξινόμηση των πινάκων των tags έτσι ώστε να έρχονται ταξινομημένα τα πεδία εκάστοτε πηγής
                                        //στο dropdown select control
                                        Array.prototype.sortBy = function(p) {
                                            return this.slice(0).sort(function(a,b) {
                                                return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
                                            });
                                        }

                                        for (var key in tagsList) {
                                            tagsList[key] = tagsList[key].sortBy('description');
                                        }

                                        var self = this;

                                        for (var key in tagsList) {
                                            tagsList[key].forEach(function (i) {
                                                self.add("[" + key + "] " + i.description, i.name);
                                            });
                                        }
                                    }
                                },
                                onChange: function (api) {
                                    if (this.getValue())
                                        insertValueInExpression("[" + this.getValue() + "]");
                                }
                            }
                        ]
                    },
                    {
                        type: 'hbox',
                        children: [
                            {
                                type: 'html',
                                html: 'Τελεστές Συνθήκης:'
                            },
                            {
                                type: 'button',
                                id: 'btnOpenP',
                                width: '10px',
                                label: '(',
                                onClick: function () {
                                    insertValueInExpression("(");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnCloseP',
                                width: '10px',
                                label: ')',
                                onClick: function () {
                                    insertValueInExpression(")");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnAnd',
                                width: '10px',
                                label: 'And',
                                onClick: function () {
                                    insertValueInExpression("&&");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnOr',
                                width: '10px',
                                label: 'Or',
                                onClick: function () {
                                    insertValueInExpression("||");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnNot',
                                width: '10px',
                                label: 'Not',
                                onClick: function () {
                                    insertValueInExpression("!");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnEquals',
                                width: '10px',
                                label: '==',
                                onClick: function () {
                                    insertValueInExpression("==");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnNotEquals',
                                width: '10px',
                                label: '!=',
                                onClick: function () {
                                    insertValueInExpression("!=");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnLower',
                                width: '10px',
                                label: '<',
                                onClick: function () {
                                    insertValueInExpression("<");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnLowerEquals',
                                width: '10px',
                                label: '<=',
                                onClick: function () {
                                    insertValueInExpression("<=");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnBigger',
                                width: '10px',
                                label: '>',
                                onClick: function () {
                                    insertValueInExpression(">");
                                }
                            },
                            {
                                type: 'button',
                                id: 'btnBiggerEquals',
                                width: '10px',
                                label: '>=',
                                onClick: function () {
                                    insertValueInExpression(">=");
                                }
                            }
                        ]
                    },
                    {
                        type: 'textarea',
                        id: 'expression',
                        className: 'conditionExpression',
                        label: 'Συνθήκη',
                        rows: 10,
                        'default': '',
                        validate: function () {

                            //Πρώτος έλεγχος ότι η καθορισμένη συνθήκη είναι έγκυρη
                            //τηρώντας τους βασικούς κανόνες

                            var conditionExpression = this.getValue();
                            var tags = this.getValue().match(/\[(.*?)\]/g);

                            for (var i in tags) {

                                for (var key in allTagsList) {

                                    if (typeof tags[i] === "function") {
                                        continue;
                                    }

                                    var sTag = tags[i].substring(1, tags[i].length - 1);

                                    var tagObj = allTagsList[key].find(x => x.name == sTag);

                                    if (tagObj != undefined) {

                                        if (tagObj.type == "STRING") {
                                            conditionExpression = conditionExpression.replace(tags[i], "\"Test\"");
                                        } else if (tagObj.type == "LONG") {
                                            conditionExpression = conditionExpression.replace(tags[i], "0");
                                        } else if (tagObj.type == "DATE") {
                                            conditionExpression = conditionExpression.replace(tags[i], "0");
                                        }

                                        break;
                                    }
                                }
                            }

                            try {
                                eval(conditionExpression);
                            }
                            catch(err) {
                                alert( 'Η συνθήκη δεν είναι έγκυρη. Παρακαλώ διορθώστε.' );
                                return false;
                            }

                        },
                        setup: function (element) {
                            expressionTextarea = this;
                            expressionTextarea.setValue(element.getAttribute("condition"));
                        },
                        commit: function (element) {
                            element.setAttribute("condition", this.getValue().trim());
                        }
                    }
                ]

            }
        ],

        /**
         * Εισαγωγή της συνθήκης στο πρότυπο αναφοράς
         */
        onOk: function () {

            var dialog = this,
                condition = dialog.element;

            dialog.commitContent(condition);

            if (dialog.insertMode) {
                editor.insertElement(condition);
            }
        },

        /**
         * Εμφάνιση παραθύρου διαλόγου καθορισμού της συνθήκης
         */
        onShow: function () {

            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if (element)
                element = element.getAscendant('div', true);

            if (!element || element.getName() != 'div') {
                element = editor.document.createElement('div');
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            this.element = element;

            this.setupContent(element);
        }
    };

});