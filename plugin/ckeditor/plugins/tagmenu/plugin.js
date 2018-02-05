var editorInstance = CKEDITOR.instances.content;
var tagCategories;
var tagCategoryIds = [];

CKEDITOR.plugins.add('tagmenu', {
	requires : [ 'stylescombo', 'button' ],

	init : function(editor) {
		//Get JSON data.
		var customPath = document.getElementById("customPath").value;
		var jsonLink = customPath + '/tags.json';

		$.getJSON(jsonLink, {
			ajax : 'true'
		}, function(data) {
			tagCategories = data;
		});
		
		
		
		function doStuff() {
			
		    if(tagCategories === undefined) { //Check if JSON has returned (tagCategories is set if JSON has returned)
		        setTimeout(doStuff, 50); //wait 50 milliseconds then re-check
		        return;
		    }
			
		    
		    //JSON has returned.
		    
		    var itemCounter = 0;
		    
		    for(var i=0; i<tagCategories.length; i++) {
		    	
		    	var tagCategory = tagCategories[i];
		    	var tags = tagCategories[i].tags;
		    	
		    	var thisGroup = tagCategory.id.toString();
		    	
		    	var items = [];
		    	
				//TagCategory (parent)
				//-----------------------------------------------------------------
				
				//Var
				var tagCategoryVar = {
						label : tagCategory.name,
						group : thisGroup,
						id : itemCounter, //This is a custom attribute!
						children : tags, //This is a custom attribute!
						getItems : function() {
							//This is called at runtime!
							var thisId = this.id;
							var thisChildren = this.children;
							
							var childIds = [];
							
							for(var q=thisId; q<(thisId+(thisChildren.length)); q++) {
								var index = q + 1;
								childIds[index] = CKEDITOR.TRISTATE_OFF;
							}
							
							return childIds;
						}
				};
				
				
				//Item
				items[itemCounter] = tagCategoryVar;
				tagCategoryIds.push(itemCounter); //Store the tagCategory id in order to display the category items at runtime.
				itemCounter++;
				
				
				
				//Tags (children)
				//-----------------------------------------------------------------
				
				//Vars
				var tagVars = [];
				
				for(var j=0; j<tags.length; j++) {
					var tagVar = {
							label : tags[j].label,
							group : thisGroup,
							tagValue : tags[j].value,
							onClick : function() {
								var tagValue = this.tagValue;
								var html = '<input type="text" id="myid" value=' + tagValue + ' size="' + (tagValue.length+10) + '" readonly />';
								editorInstance.insertHtml(html);
							}
					}
					
					tagVars.push(tagVar);
				}
				
				
				//Items
				for(var k=0; k<tagVars.length; k++) {
					items[itemCounter] = tagVars[k];
					itemCounter++;
				}
				
				
				//Add this group with the items
				editorInstance.addMenuGroup(thisGroup);
				editorInstance.addMenuItems(items);
				
		    }
		    
		    
		    
		    
		    
		    
		    
		    
		    
		    
		    
		    
		    
//			var rootObjects = [];
//			var leafObjects = [];
//
//			for (var i = 0; i < tagData.length; i++) {
//				var id = tagData[i].id;
//				var name = tagData[i].name;
//				var tagCategory = tagData[i].tagCategory;
//				var tags = tagData[i].tags;
//
//				if (tagCategory == null) {
//					//It's a root element
//					rootObjects.push(tagData[i]);
//				}
//				else {
//					//It's a leaf element
//					leafObjects.push(tagData[i]);
//				}
//
//			}
//			
//			
//			var itemCounter = 0;
//			
//			for(var i=0; i<rootObjects.length; i++) {
//				
//				var thisGroup = rootObjects[i].id.toString();
//				
//				//Find all childObjects (leafObjects with tagCategory.id = id of this object)
//				var childObjects = [];
//				
//				for(var j=0; j<leafObjects.length; j++) {
//					
//					if(leafObjects[j].tagCategory.id == rootObjects[i].id) {
//						childObjects.push(leafObjects[j]);
//					}
//				}
//				
//				
//				var items = [];
//				
//				
//				//Root
//				//-----------------------------------------------------------------
//				
//				//Var
//				var rootVar = {
//						label : rootObjects[i].name,
//						group : thisGroup,
//						id : itemCounter, //This is a custom attribute!
//						children : childObjects, //This is a custom attribute!
//						getItems : function() {
//							//This is called at runtime!
//							var thisId = this.id;
//							var thisChildren = this.children;
//							
//							var childIds = [];
//							
//							for(var q=thisId; q<(thisId+(thisChildren.length)); q++) {
//								var index = q + 1;
//								childIds[index] = CKEDITOR.TRISTATE_OFF;
//							}
//							
//							return childIds;
//						}
//						//WE NEED TO ADD ONCLICK HERE
//				};
//				
//				
//				//Item
//				items[itemCounter] = rootVar;
//				rootIds.push(itemCounter); //Store the root id in order to display the root items at runtime.
//				itemCounter++;
//				
//				
//				//Children
//				//-----------------------------------------------------------------
//				
//				//Vars
//				var childVars = [];
//				
//				for(var k=0; k<childObjects.length; k++) {
//					var childVar = {
//							label : childObjects[k].name,
//							group : thisGroup
//							//WE NEED TO ADD ONCLICK HERE
//					}
//					
//					childVars.push(childVar);
//				}
//				
//				
//				//Items
//				for (var m = 0; m < (childVars.length); m++) {
//					items[itemCounter] = childVars[m];
//					itemCounter++;
//				}
//				
//				
//				//Add this group with the items
//				editorInstance.addMenuGroup(thisGroup);
//				editorInstance.addMenuItems(items);
//				
//			}
		}
		
		
		doStuff();
		
	}
});



editorInstance.ui.add('TagGroup', CKEDITOR.UI_MENUBUTTON, {
	label : 'Tags',
	icon : CKEDITOR.plugins.getPath('tagmenu') + 'icon.png',
	onMenu : function() { //This is called at runtime!
		
		var activeItems = {};
		
		for(var p in tagCategoryIds) {
			activeItems[tagCategoryIds[p]] = CKEDITOR.TRISTATE_OFF;
		}
		
		return activeItems;
	}
});

