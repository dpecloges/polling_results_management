var templateTitles;
var customPath = document.getElementById("customPath").value;
var doctorType = document.getElementById("doctorType").value;
var jsonLink = customPath + '/templatetitles/' + doctorType;

$.getJSON(jsonLink,
	{
    	ajax: 'true'
    },
    function(data) {
    	templateTitles = data;
    }
);

CKEDITOR.plugins.add( 'templatedropdown', {
	requires: 'richcombo',
	init: function( editor ) {
		var config = editor.config;
		
		editor.ui.addRichCombo( 'templatedropdown', {
			label: "Template",
			toolbar: 'styles,20', //Position the plugin.
			width: 500,

			panel: {
				css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss )
			},

			init: function() {
				this.startGroup("Templates");
				
				for(i = 0; i < templateTitles.length; i++) {
					this.add(templateTitles[i]);
				}
				
			},
			
			//send template's title and selected inmate's id
            onClick : function( value ) {
            	//check if required fields have been initialized
            	if($("#dcInmate").val() != "" && $("#sessionType").val() != ""){					//too specific //#dcInmate_chosen
            		var selectedInmateId = $("#dcInmate").find("option:selected").val();			//too specific
            		//sessionTypeId = $("#sessionType").find("option:selected").val();
            		var jsonLink = customPath + '/template/' + value + '/id/' + selectedInmateId;
            		
            		//save ReportTemplatesTitle
            		$("#chosenReportTemplateTitle").val(value);
            		
            		var data = CKEDITOR.ajax.load(jsonLink);
            		CKEDITOR.instances['doctorSessionContent'].setData(data);
            		/*
                	var data = CKEDITOR.ajax.load(jsonLink, function(response, status, xhr){});
            		if(status == "error"){
                		CKEDITOR.instances['doctorSessionContent'].setData("Κάτι πήγε στραβά και το περιεχόμενο της αναφοράς δεν βρέθηκε...");
                	} else{
                		CKEDITOR.instances['doctorSessionContent'].setData(data);
                	}
                	//*/
            	} else {
            		CKEDITOR.instances['doctorSessionContent'].setData("Κάτι πήγε στραβά. Ξαναπροσπαθήστε ορίζωντας πρώτα τον κρατούμενο και τον τύπο της συνεδρίας.");
            	}
            }
			
		});
	}

/*
var buildListHasRunOnce = 0;
		var buildList = function () {
		    if (buildListHasRunOnce) {
		        // Remove the old unordered list from the dom.
		        // This is just to cleanup the old list within the iframe
		        $(this._.panel._.iframe.$).contents().find("ul").remove();
		        // reset list
		        this._.items = {};
		        this._.list._.items = {};
		    }
		    
		    //retrieve new data
		    sessionTypeId = $("#sessionType").find("option:selected").val();
			newDataJsonLink = jsonLink + sessionTypeId;
			$.getJSON(
					newDataJsonLink,
					{	ajax: 'true'	},
				    function(data) {	templateTitles = data;	}
				);
			
		    for (i = 0; i < templateTitles.length; i++) {
				this.add(templateTitles[i]);
		    }
		    if (buildListHasRunOnce) {
		        // Force CKEditor to commit the html it generates through this.add
		        this._.committed = 0; // We have to set to false in order to trigger a complete commit()
		        this.commit();
		    }
		    buildListHasRunOnce = 1;
		};
		
init:function() {
				this.startGroup("Templates");
				var rebuildList = CKEDITOR.tools.bind(buildList, this);
                rebuildList();
                $(editor).bind('rebuildList', rebuildList);
			},
*/

} );

