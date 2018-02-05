/*

 highlight v5

 Highlights arbitrary terms.

 <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

 MIT license.

 Johann Burkard
 <http://johannburkard.de>
 <mailto:jb@eaio.com>

 */

jQuery.fn.highlight = function(pat) {
	function innerHighlight(node, pat) {
		var skip = 0;
		if (node.nodeType == 3) {
			var pos = node.data.toUpperCase().indexOf(pat);
			pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
			if (pos >= 0) {
				var spannode = document.createElement('span');
				spannode.className = 'highlight';
				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(pat.length);
				var middleclone = middlebit.cloneNode(true);
				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);
				skip = 1;
			}
		}
		else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {
				i += innerHighlight(node.childNodes[i], pat);
			}
		}
		return skip;
	}
	return this.length && pat && pat.length ? this.each(function() {
		innerHighlight(this, pat.toUpperCase());
	}) : this;
};

jQuery.fn.removeHighlight = function() {
	return this.find("span.highlight").each(function() {
		this.parentNode.firstChild.nodeName;
		with (this.parentNode) {
			replaceChild(this.firstChild, this);
			normalize();
		}
	}).end();
};
/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'floatpanel2', {
	requires: 'panel'
} );

( function() {
	var panels = {};

	function getPanel( editor, doc, parentElement, definition, level ) {
		// Generates the panel key: docId-eleId-skinName-langDir[-uiColor][-CSSs][-level]
		var key = CKEDITOR.tools.genKey( doc.getUniqueId(), parentElement.getUniqueId(), editor.lang.dir, editor.uiColor || '', definition.css || '', level || '' ),
			panel = panels[ key ];

		if ( !panel ) {
			panel = panels[ key ] = new CKEDITOR.ui.panel( doc, definition );
			panel.element = parentElement.append( CKEDITOR.dom.element.createFromHtml( panel.render( editor ), doc ) );

			panel.element.setStyles( {
				display: 'none',
				position: 'absolute'
			} );
		}

		return panel;
	}

	/**
	 * Represents a floating panel UI element.
	 *
	 * It's reused by rich combos, color combos, menus, etc.
	 * and it renders its content using {@link CKEDITOR.ui.panel}.
	 *
	 * @class
	 * @todo
	 */
	CKEDITOR.ui.floatPanel2 = CKEDITOR.tools.createClass( {
		/**
		 * Creates a floatPanel class instance.
		 *
		 * @constructor
		 * @param {CKEDITOR.editor} editor
		 * @param {CKEDITOR.dom.element} parentElement
		 * @param {Object} definition Definition of the panel that will be floating.
		 * @param {Number} level
		 */
		$: function( editor, parentElement, definition, level ) {
			definition.forceIFrame = 1;

			// In case of editor with floating toolbar append panels that should float
			// to the main UI element.
			if ( definition.toolbarRelated && editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				parentElement = CKEDITOR.document.getById( 'cke_' + editor.name );

			var doc = parentElement.getDocument(),
				panel = getPanel( editor, doc, parentElement, definition, level || 0 ),
				element = panel.element,
				iframe = element.getFirst(),
				that = this;

			// Disable native browser menu. (#4825)
			element.disableContextMenu();

			this.element = element;

			this._ = {
				editor: editor,
				// The panel that will be floating.
				panel: panel,
				parentElement: parentElement,
				definition: definition,
				document: doc,
				iframe: iframe,
				children: [],
				dir: editor.lang.dir
			};

			editor.on( 'mode', hide );
			editor.on( 'resize', hide );

			// Window resize doesn't cause hide on blur. (#9800)
			// [iOS] Poping up keyboard triggers window resize
			// which leads to undesired panel hides.
			if ( !CKEDITOR.env.iOS )
				doc.getWindow().on( 'resize', hide );

			// We need a wrapper because events implementation doesn't allow to attach
			// one listener more than once for the same event on the same object.
			// Remember that floatPanel#hide is shared between all instances.
			function hide() {
				that.hide();
			}
		},

		proto: {
			/**
			 * @todo
			 */
			addBlock: function( name, block ) {
				return this._.panel.addBlock( name, block );
			},

			/**
			 * @todo
			 */
			addListBlock2: function( name, multiSelect ) {
				return this._.panel.addListBlock2( name, multiSelect );
			},

			/**
			 * @todo
			 */
			getBlock: function( name ) {
				return this._.panel.getBlock( name );
			},

			/**
			 * Shows panel block.
			 *
			 * @param {String} name
			 * @param {CKEDITOR.dom.element} offsetParent Positioned parent.
			 * @param {Number} corner
			 *
			 * * For LTR (left to right) oriented editor:
			 *      * `1` = top-left
			 *      * `2` = top-right
			 *      * `3` = bottom-right
			 *      * `4` = bottom-left
			 * * For RTL (right to left):
			 *      * `1` = top-right
			 *      * `2` = top-left
			 *      * `3` = bottom-left
			 *      * `4` = bottom-right
			 *
			 * @param {Number} [offsetX=0]
			 * @param {Number} [offsetY=0]
			 * @param {Function} [callback] A callback function executed when block positioning is done.
			 * @todo what do exactly these params mean (especially corner)?
			 */
			showBlock: function( name, offsetParent, corner, offsetX, offsetY, callback ) {
				var panel = this._.panel,
					block = panel.showBlock( name );

				this.allowBlur( false );

				// Record from where the focus is when open panel.
				var editable = this._.editor.editable();
				this._.returnFocus = editable.hasFocus ? editable : new CKEDITOR.dom.element( CKEDITOR.document.$.activeElement );
				this._.hideTimeout = 0;

				var element = this.element,
					iframe = this._.iframe,
				// Non IE prefer the event into a window object.
					focused = CKEDITOR.env.ie ? iframe : new CKEDITOR.dom.window( iframe.$.contentWindow ),
					doc = element.getDocument(),
					positionedAncestor = this._.parentElement.getPositionedAncestor(),
					position = offsetParent.getDocumentPosition( doc ),
					positionedAncestorPosition = positionedAncestor ? positionedAncestor.getDocumentPosition( doc ) : { x: 0, y: 0 },
					rtl = this._.dir == 'rtl',
					left = position.x + ( offsetX || 0 ) - positionedAncestorPosition.x,
					top = position.y + ( offsetY || 0 ) - positionedAncestorPosition.y;

				// Floating panels are off by (-1px, 0px) in RTL mode. (#3438)
				if ( rtl && ( corner == 1 || corner == 4 ) )
					left += offsetParent.$.offsetWidth;
				else if ( !rtl && ( corner == 2 || corner == 3 ) )
					left += offsetParent.$.offsetWidth - 1;

				if ( corner == 3 || corner == 4 )
					top += offsetParent.$.offsetHeight - 1;

				// Memorize offsetParent by it's ID.
				this._.panel._.offsetParentId = offsetParent.getId();

				element.setStyles( {
					top: top + 'px',
					left: 0,
					display: ''
				} );

				// Don't use display or visibility style because we need to
				// calculate the rendering layout later and focus the element.
				element.setOpacity( 0 );

				// To allow the context menu to decrease back their width
				element.getFirst().removeStyle( 'width' );

				// Report to focus manager.
				this._.editor.focusManager.add( focused );

				// Configure the IFrame blur event. Do that only once.
				if ( !this._.blurSet ) {

					// With addEventListener compatible browsers, we must
					// useCapture when registering the focus/blur events to
					// guarantee they will be firing in all situations. (#3068, #3222 )
					CKEDITOR.event.useCapture = true;

					focused.on( 'blur', function( ev ) {
						// As we are using capture to register the listener,
						// the blur event may get fired even when focusing
						// inside the window itself, so we must ensure the
						// target is out of it.
						if ( !this.allowBlur() || ev.data.getPhase() != CKEDITOR.EVENT_PHASE_AT_TARGET )
							return;

						if ( this.visible && !this._.activeChild ) {
							// [iOS] Allow hide to be prevented if touch is bound
							// to any parent of the iframe blur happens before touch (#10714).
							if ( CKEDITOR.env.iOS ) {
								if ( !this._.hideTimeout )
									this._.hideTimeout = CKEDITOR.tools.setTimeout( doHide, 0, this );
							} else {
								doHide.call( this );
							}
						}

						function doHide() {
							// Panel close is caused by user's navigating away the focus, e.g. click outside the panel.
							// DO NOT restore focus in this case.
							delete this._.returnFocus;
							this.hide();
						}
					}, this );

					focused.on( 'focus', function() {
						this._.focused = true;
						this.hideChild();
						this.allowBlur( true );
					}, this );

					// [iOS] if touch is bound to any parent of the iframe blur
					// happens twice before touchstart and before touchend (#10714).
					if ( CKEDITOR.env.iOS ) {
						// Prevent false hiding on blur.
						// We don't need to return focus here because touchend will fire anyway.
						// If user scrolls and pointer gets out of the panel area touchend will also fire.
						focused.on( 'touchstart', function() {
							clearTimeout( this._.hideTimeout );
						}, this );

						// Set focus back to handle blur and hide panel when needed.
						focused.on( 'touchend', function() {
							this._.hideTimeout = 0;
							this.focus();
						}, this );
					}

					CKEDITOR.event.useCapture = false;

					this._.blurSet = 1;
				}

				panel.onEscape = CKEDITOR.tools.bind( function( keystroke ) {
					if ( this.onEscape && this.onEscape( keystroke ) === false )
						return false;
				}, this );

				CKEDITOR.tools.setTimeout( function() {
					var panelLoad = CKEDITOR.tools.bind( function() {
						var target = element;

						// Reset panel width as the new content can be narrower
						// than the old one. (#9355)
						target.removeStyle( 'width' );

						if ( block.autoSize ) {
							var panelDoc = block.element.getDocument();
							var width = ( CKEDITOR.env.webkit ? block.element : panelDoc.getBody() ).$.scrollWidth;

							// Account for extra height needed due to IE quirks box model bug:
							// http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug
							// (#3426)
							if ( CKEDITOR.env.ie && CKEDITOR.env.quirks && width > 0 )
								width += ( target.$.offsetWidth || 0 ) - ( target.$.clientWidth || 0 ) + 3;

							// Add some extra pixels to improve the appearance.
							width += 10;

							target.setStyle( 'width', width + 'px' );

							var height = block.element.$.scrollHeight;

							// Account for extra height needed due to IE quirks box model bug:
							// http://en.wikipedia.org/wiki/Internet_Explorer_box_model_bug
							// (#3426)
							if ( CKEDITOR.env.ie && CKEDITOR.env.quirks && height > 0 )
								height += ( target.$.offsetHeight || 0 ) - ( target.$.clientHeight || 0 ) + 3;

							target.setStyle( 'height', height + 'px' );

							// Fix IE < 8 visibility.
							panel._.currentBlock.element.setStyle( 'display', 'none' ).removeStyle( 'display' );
						} else {
							target.removeStyle( 'height' );
						}

						// Flip panel layout horizontally in RTL with known width.
						if ( rtl )
							left -= element.$.offsetWidth;

						// Pop the style now for measurement.
						element.setStyle( 'left', left + 'px' );

						/* panel layout smartly fit the viewport size. */
						var panelElement = panel.element,
							panelWindow = panelElement.getWindow(),
							rect = element.$.getBoundingClientRect(),
							viewportSize = panelWindow.getViewPaneSize();

						// Compensation for browsers that dont support "width" and "height".
						var rectWidth = rect.width || rect.right - rect.left,
							rectHeight = rect.height || rect.bottom - rect.top;

						// Check if default horizontal layout is impossible.
						var spaceAfter = rtl ? rect.right : viewportSize.width - rect.left,
							spaceBefore = rtl ? viewportSize.width - rect.right : rect.left;

						if ( rtl ) {
							if ( spaceAfter < rectWidth ) {
								// Flip to show on right.
								if ( spaceBefore > rectWidth )
									left += rectWidth;
								// Align to window left.
								else if ( viewportSize.width > rectWidth )
									left = left - rect.left;
								// Align to window right, never cutting the panel at right.
								else
									left = left - rect.right + viewportSize.width;
							}
						} else if ( spaceAfter < rectWidth ) {
							// Flip to show on left.
							if ( spaceBefore > rectWidth )
								left -= rectWidth;
							// Align to window right.
							else if ( viewportSize.width > rectWidth )
								left = left - rect.right + viewportSize.width;
							// Align to window left, never cutting the panel at left.
							else
								left = left - rect.left;
						}


						// Check if the default vertical layout is possible.
						var spaceBelow = viewportSize.height - rect.top,
							spaceAbove = rect.top;

						if ( spaceBelow < rectHeight ) {
							// Flip to show above.
							if ( spaceAbove > rectHeight )
								top -= rectHeight;
							// Align to window bottom.
							else if ( viewportSize.height > rectHeight )
								top = top - rect.bottom + viewportSize.height;
							// Align to top, never cutting the panel at top.
							else
								top = top - rect.top;
						}

						// If IE is in RTL, we have troubles with absolute
						// position and horizontal scrolls. Here we have a
						// series of hacks to workaround it. (#6146)
						if ( CKEDITOR.env.ie ) {
							var offsetParent = new CKEDITOR.dom.element( element.$.offsetParent ),
								scrollParent = offsetParent;

							// Quirks returns <body>, but standards returns <html>.
							if ( scrollParent.getName() == 'html' )
								scrollParent = scrollParent.getDocument().getBody();

							if ( scrollParent.getComputedStyle( 'direction' ) == 'rtl' ) {
								// For IE8, there is not much logic on this, but it works.
								if ( CKEDITOR.env.ie8Compat )
									left -= element.getDocument().getDocumentElement().$.scrollLeft * 2;
								else
									left -= ( offsetParent.$.scrollWidth - offsetParent.$.clientWidth );
							}
						}

						// Trigger the onHide event of the previously active panel to prevent
						// incorrect styles from being applied (#6170)
						var innerElement = element.getFirst(),
							activePanel;
						if ( ( activePanel = innerElement.getCustomData( 'activePanel' ) ) )
							activePanel.onHide && activePanel.onHide.call( this, 1 );
						innerElement.setCustomData( 'activePanel', this );

						element.setStyles( {
							top: top + 'px',
							left: left + 'px'
						} );
						element.setOpacity( 1 );

						callback && callback();
					}, this );

					panel.isLoaded ? panelLoad() : panel.onLoad = panelLoad;

					CKEDITOR.tools.setTimeout( function() {
						var scrollTop = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;

						// Focus the panel frame first, so blur gets fired.
						this.focus();

						// Focus the block now.
						block.element.focus();

						// #10623, #10951 - restore the viewport's scroll position after focusing list element.
						if ( CKEDITOR.env.webkit )
							CKEDITOR.document.getBody().$.scrollTop = scrollTop;

						// We need this get fired manually because of unfired focus() function.
						this.allowBlur( true );
						this._.editor.fire( 'panelShow', this );
					}, 0, this );
				}, CKEDITOR.env.air ? 200 : 0, this );
				this.visible = 1;

				if ( this.onShow )
					this.onShow.call( this );
			},

			/**
			 * Restores last focused element or simply focus panel window.
			 */
			focus: function() {
				// Webkit requires to blur any previous focused page element, in
				// order to properly fire the "focus" event.
				if ( CKEDITOR.env.webkit ) {
					var active = CKEDITOR.document.getActive();
					active && !active.equals( this._.iframe ) && active.$.blur();
				}

				// Restore last focused element or simply focus panel window.
				var focus = this._.lastFocused || this._.iframe.getFrameDocument().getWindow();
				focus.focus();
			},

			/**
			 * @todo
			 */
			blur: function() {
				var doc = this._.iframe.getFrameDocument(),
					active = doc.getActive();

				active && active.is( 'a' ) && ( this._.lastFocused = active );
			},

			/**
			 * Hides panel.
			 *
			 * @todo
			 */
			hide: function( returnFocus ) {
				if ( this.visible && ( !this.onHide || this.onHide.call( this ) !== true ) ) {
					this.hideChild();
					// Blur previously focused element. (#6671)
					CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
					this.element.setStyle( 'display', 'none' );
					this.visible = 0;
					this.element.getFirst().removeCustomData( 'activePanel' );

					// Return focus properly. (#6247)
					var focusReturn = returnFocus && this._.returnFocus;
					if ( focusReturn ) {
						// Webkit requires focus moved out panel iframe first.
						if ( CKEDITOR.env.webkit && focusReturn.type )
							focusReturn.getWindow().$.focus();

						focusReturn.focus();
					}

					delete this._.lastFocused;

					this._.editor.fire( 'panelHide', this );
				}
			},

			/**
			 * @todo
			 */
			allowBlur: function( allow ) {
				// Prevent editor from hiding the panel. (#3222)
				var panel = this._.panel;
				if ( allow !== undefined )
					panel.allowBlur = allow;

				return panel.allowBlur;
			},

			/**
			 * Shows specified panel as a child of one block of this one.
			 *
			 * @param {CKEDITOR.ui.floatPanel} panel
			 * @param {String} blockName
			 * @param {CKEDITOR.dom.element} offsetParent Positioned parent.
			 * @param {Number} corner
			 *
			 * * For LTR (left to right) oriented editor:
			 *      * `1` = top-left
			 *      * `2` = top-right
			 *      * `3` = bottom-right
			 *      * `4` = bottom-left
			 * * For RTL (right to left):
			 *      * `1` = top-right
			 *      * `2` = top-left
			 *      * `3` = bottom-left
			 *      * `4` = bottom-right
			 *
			 * @param {Number} [offsetX=0]
			 * @param {Number} [offsetY=0]
			 * @todo
			 */
			showAsChild: function( panel, blockName, offsetParent, corner, offsetX, offsetY ) {
				// Skip reshowing of child which is already visible.
				if ( this._.activeChild == panel && panel._.panel._.offsetParentId == offsetParent.getId() )
					return;

				this.hideChild();

				panel.onHide = CKEDITOR.tools.bind( function() {
					// Use a timeout, so we give time for this menu to get
					// potentially focused.
					CKEDITOR.tools.setTimeout( function() {
						if ( !this._.focused )
							this.hide();
					}, 0, this );
				}, this );

				this._.activeChild = panel;
				this._.focused = false;

				panel.showBlock( blockName, offsetParent, corner, offsetX, offsetY );
				this.blur();

				/* #3767 IE: Second level menu may not have borders */
				if ( CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat ) {
					setTimeout( function() {
						panel.element.getChild( 0 ).$.style.cssText += '';
					}, 100 );
				}
			},

			/**
			 * @todo
			 */
			hideChild: function( restoreFocus ) {
				var activeChild = this._.activeChild;

				if ( activeChild ) {
					delete activeChild.onHide;
					delete this._.activeChild;
					activeChild.hide();

					// At this point focus should be moved back to parent panel.
					restoreFocus && this.focus();
				}
			}
		}
	} );

	CKEDITOR.on( 'instanceDestroyed', function() {
		var isLastInstance = CKEDITOR.tools.isEmpty( CKEDITOR.instances );

		for ( var i in panels ) {
			var panel = panels[ i ];
			// Safe to destroy it since there're no more instances.(#4241)
			if ( isLastInstance )
				panel.destroy();
			// Panel might be used by other instances, just hide them.(#4552)
			else
				panel.element.hide();
		}
		// Remove the registration.
		isLastInstance && ( panels = {} );

	} );
} )();








/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'listblock2', {
	requires: 'panel',

	onLoad: function() {
		var list = CKEDITOR.addTemplate( 'panel-list', '<div><input type="text"></div><ul role="presentation" class="cke_panel_list">{items}</ul>' ),
			listItem = CKEDITOR.addTemplate( 'panel-list-item', '<li id="{id}" class="cke_panel_listItem" role=presentation>' +
			'<a id="{id}_option" _cke_focus=1 hidefocus=true' +
			' title="{title}"' +
			' href="javascript:void(\'{val}\')" ' +
			' {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;"' + // #188
			' role="option">' +
			'{text}' +
			'</a>' +
			'</li>' ),
			listGroup = CKEDITOR.addTemplate( 'panel-list-group', '<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>' ),
			reSingleQuote = /\'/g,
			escapeSingleQuotes = function( str ) {
				return str.replace( reSingleQuote, '\\\'' );
			};

		CKEDITOR.ui.panel.prototype.addListBlock2 = function( name, definition ) {
			var ontype = function(e){

				$(e.target).closest("body").find("[role=listbox]").find("li").each(function(){
						$(this).removeHighlight();

						if($(this).text().toLowerCase().indexOf(e.target.value.toLowerCase()) < 0){


							$(this).hide();

						}else{
							$(this).show();

							$(this).highlight(e.target.value);

						}

					}
				)
			};


			var block =  this.addBlock( name, new CKEDITOR.ui.listBlock2( this.getHolderElement(), definition ) );

			$(block.element.$).parent().find("div.cke_searchDiv").remove();
			$(block.element.$).parent().prepend("<div class='cke_dialog_ui_input_text cke_searchDiv'><input type='text' style='width: 100%' class='cke_dialog_ui_input_text tagSearchBox' /></div>");
			$(block.element.$).parent().find(".tagSearchBox").keyup(ontype);
			return block;
		};

		CKEDITOR.ui.listBlock2 = CKEDITOR.tools.createClass( {
			base: CKEDITOR.ui.panel.block,

			$: function( blockHolder, blockDefinition ) {
				blockDefinition = blockDefinition || {};

				var attribs = blockDefinition.attributes || ( blockDefinition.attributes = {} );
				( this.multiSelect = !!blockDefinition.multiSelect ) && ( attribs[ 'aria-multiselectable' ] = true );
				// Provide default role of 'listbox'.
				!attribs.role && ( attribs.role = 'listbox' );

				// Call the base contructor.
				this.base.apply( this, arguments );

				// Set the proper a11y attributes.
				this.element.setAttribute( 'role', attribs.role );

				var keys = this.keys;
				keys[ 40 ] = 'next'; // ARROW-DOWN
				keys[ 9 ] = 'next'; // TAB
				keys[ 38 ] = 'prev'; // ARROW-UP
				keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
				keys[ 32 ] = CKEDITOR.env.ie ? 'mouseup' : 'click'; // SPACE
				CKEDITOR.env.ie && ( keys[ 13 ] = 'mouseup' ); // Manage ENTER, since onclick is blocked in IE (#8041).

				this._.pendingHtml = [];
				this._.pendingList = [];
				this._.items = {};
				this._.groups = {};
			},

			_: {
				close: function() {
					if ( this._.started ) {
						var output = list.output( { items: this._.pendingList.join( '' ) } );
						this._.pendingList = [];
						this._.pendingHtml.push( output );
						delete this._.started;
					}
				},

				getClick: function() {
					if ( !this._.click ) {
						this._.click = CKEDITOR.tools.addFunction( function( value ) {
							var marked = this.toggle( value );
							if ( this.onClick )
								this.onClick( value, marked );
						}, this );
					}
					return this._.click;
				}
			},

			proto: {
				add: function( value, html, title ) {
					var id = CKEDITOR.tools.getNextId();

					if ( !this._.started ) {
						this._.started = 1;
						this._.size = this._.size || 0;
					}

					this._.items[ value ] = id;

					var data = {
						id: id,
						val: escapeSingleQuotes( CKEDITOR.tools.htmlEncodeAttr( value ) ),
						onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : 'onclick',
						clickFn: this._.getClick(),
						title: CKEDITOR.tools.htmlEncodeAttr( title || value ),
						text: html || value
					};

					this._.pendingList.push( listItem.output( data ) );
				},

				startGroup: function( title ) {
					this._.close();

					var id = CKEDITOR.tools.getNextId();

					this._.groups[ title ] = id;

					this._.pendingHtml.push( listGroup.output( { id: id, label: title } ) );
				},

				commit: function() {
					this._.close();
					this.element.appendHtml( this._.pendingHtml.join( '' ) );
					delete this._.size;

					this._.pendingHtml = [];
				},

				toggle: function( value ) {
					var isMarked = this.isMarked( value );

					if ( isMarked )
						this.unmark( value );
					else
						this.mark( value );

					return !isMarked;
				},

				hideGroup: function( groupTitle ) {
					var group = this.element.getDocument().getById( this._.groups[ groupTitle ] ),
						list = group && group.getNext();

					if ( group ) {
						group.setStyle( 'display', 'none' );

						if ( list && list.getName() == 'ul' )
							list.setStyle( 'display', 'none' );
					}
				},

				hideItem: function( value ) {
					this.element.getDocument().getById( this._.items[ value ] ).setStyle( 'display', 'none' );
				},

				showAll: function() {
					var items = this._.items,
						groups = this._.groups,
						doc = this.element.getDocument();

					for ( var value in items ) {
						doc.getById( items[ value ] ).setStyle( 'display', '' );
					}

					for ( var title in groups ) {
						var group = doc.getById( groups[ title ] ),
							list = group.getNext();

						group.setStyle( 'display', '' );

						if ( list && list.getName() == 'ul' )
							list.setStyle( 'display', '' );
					}
				},

				mark: function( value ) {
					if ( !this.multiSelect )
						this.unmarkAll();

					var itemId = this._.items[ value ],
						item = this.element.getDocument().getById( itemId );
					item.addClass( 'cke_selected' );

					this.element.getDocument().getById( itemId + '_option' ).setAttribute( 'aria-selected', true );
					this.onMark && this.onMark( item );
				},

				unmark: function( value ) {
					var doc = this.element.getDocument(),
						itemId = this._.items[ value ],
						item = doc.getById( itemId );

					item.removeClass( 'cke_selected' );
					doc.getById( itemId + '_option' ).removeAttribute( 'aria-selected' );

					this.onUnmark && this.onUnmark( item );
				},

				unmarkAll: function() {
					var items = this._.items,
						doc = this.element.getDocument();

					for ( var value in items ) {
						var itemId = items[ value ];

						var itemElement = doc.getById( itemId );

						if (itemElement) {
							itemElement.removeClass('cke_selected');
							doc.getById(itemId + '_option').removeAttribute('aria-selected');
						}
					}

					this.onUnmark && this.onUnmark();
				},

				isMarked: function( value ) {
					return this.element.getDocument().getById( this._.items[ value ] ).hasClass( 'cke_selected' );
				},

				focus: function( value ) {


					var links = this.element.getElementsByTag( 'a' ),
						link,
						selected,
						i = -1;

					if ( value ) {
						selected = this.element.getDocument().getById( this._.items[ value ] ).getFirst();

						while ( ( link = links.getItem( ++i ) ) ) {
							if ( link.equals( selected ) ) {
								this._.focusIndex = i;
								break;
							}
						}
					}
					else {
						this.element.focus();
					}

					var that = this;
					$(that.element.$).parent().find(".tagSearchBox").focus();
					selected && setTimeout( function() {
						selected.focus();
						$(that.element.$).parent().find(".tagSearchBox").focus();
						selected._.focusIndex = -1;
					}, 0 );
				},

			}
		} );
	}
} );

/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'richcombo2', {
	requires: 'floatpanel2,listblock2,button',

	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_RICHCOMBO2, CKEDITOR.ui.richCombo2.handler );
	}
} );

( function() {
	var template = '<span id="{id}"' +
		' class="cke_combo cke_combo__{name} {cls}"' +
		' role="presentation">' +
		'<span id="{id}_label" class="cke_combo_label">{label}</span>' +
		'<a class="cke_combo_button" title="{title}" tabindex="-1"' +
		( CKEDITOR.env.gecko && !CKEDITOR.env.hc ? '' : ' href="javascript:void(\'{titleJs}\')"' ) +
		' hidefocus="true"' +
		' role="button"' +
		' aria-labelledby="{id}_label"' +
		' aria-haspopup="true"';

	// Some browsers don't cancel key events in the keydown but in the
	// keypress.
	// TODO: Check if really needed.
	if ( CKEDITOR.env.gecko && CKEDITOR.env.mac )
		template += ' onkeypress="return false;"';

	// With Firefox, we need to force the button to redraw, otherwise it
	// will remain in the focus state.
	if ( CKEDITOR.env.gecko )
		template += ' onblur="this.style.cssText = this.style.cssText;"';

	template +=
		' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);"' +
		' onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' +
		( CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : 'onclick' ) + // #188
		'="CKEDITOR.tools.callFunction({clickFn},this);return false;">' +
		'<span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span>' +
		'<span class="cke_combo_open">' +
		'<span class="cke_combo_arrow">' +
			// BLACK DOWN-POINTING TRIANGLE
		( CKEDITOR.env.hc ? '&#9660;' : CKEDITOR.env.air ? '&nbsp;' : '' ) +
		'</span>' +
		'</span>' +
		'</a>' +
		'</span>';

	var rcomboTpl = CKEDITOR.addTemplate( 'combo2', template );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='richcombo2']
	 * @member CKEDITOR
	 */
	CKEDITOR.UI_RICHCOMBO2 = 'richcombo2';

	/**
	 * @class
	 * @todo
	 */
	CKEDITOR.ui.richCombo2 = CKEDITOR.tools.createClass( {
		$: function( definition ) {
			// Copy all definition properties to this object.
			CKEDITOR.tools.extend( this, definition,
				// Set defaults.
				{
					// The combo won't participate in toolbar grouping.
					canGroup: false,
					title: definition.label,
					modes: { wysiwyg: 1 },
					editorFocus: 1
				} );

			// We don't want the panel definition in this object.
			var panelDefinition = this.panel || {};
			delete this.panel;

			this.id = CKEDITOR.tools.getNextNumber();

			this.document = ( panelDefinition.parent && panelDefinition.parent.getDocument() ) || CKEDITOR.document;

			panelDefinition.className = 'cke_combopanel';
			panelDefinition.block = {
				multiSelect: panelDefinition.multiSelect,
				attributes: panelDefinition.attributes
			};
			panelDefinition.toolbarRelated = true;

			this._ = {
				panelDefinition: panelDefinition,
				items: {}
			};
		},

		proto: {
			renderHtml: function( editor ) {
				var output = [];
				this.render( editor, output );
				return output.join( '' );
			},

			/**
			 * Renders the combo.
			 *
			 * @param {CKEDITOR.editor} editor The editor instance which this button is
			 * to be used by.
			 * @param {Array} output The output array to which append the HTML relative
			 * to this button.
			 */
			render: function( editor, output ) {
				var env = CKEDITOR.env;

				var id = 'cke_' + this.id;
				var clickFn = CKEDITOR.tools.addFunction( function( el ) {
					// Restore locked selection in Opera.
					if ( selLocked ) {
						editor.unlockSelection( 1 );
						selLocked = 0;
					}
					instance.execute( el );
				}, this );

				var combo = this;
				var instance = {
					id: id,
					combo: this,
					focus: function() {
						var element = CKEDITOR.document.getById( id ).getChild( 1 );
						element.focus();
					},
					execute: function( el ) {
						var _ = combo._;

						if ( _.state == CKEDITOR.TRISTATE_DISABLED )
							return;

						combo.createPanel( editor );

						if ( _.on ) {
							_.panel.hide();
							return;
						}

						combo.commit();
						var value = combo.getValue();
						if ( value )
							_.list.mark( value );
						else
							_.list.unmarkAll();

						_.panel.showBlock( combo.id, new CKEDITOR.dom.element( el ), 4 );
					},
					clickFn: clickFn
				};

				function updateState() {
					// Don't change state while richcombo2 is active (#11793).
					if ( this.getState() == CKEDITOR.TRISTATE_ON )
						return;

					var state = this.modes[ editor.mode ] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

					if ( editor.readOnly && !this.readOnly )
						state = CKEDITOR.TRISTATE_DISABLED;

					this.setState( state );
					this.setValue( '' );

					// Let plugin to disable button.
					if ( state != CKEDITOR.TRISTATE_DISABLED && this.refresh )
						this.refresh();
				}

				// Update status when activeFilter, mode, selection or readOnly changes.
				editor.on( 'activeFilterChange', updateState, this );
				editor.on( 'mode', updateState, this );
				editor.on( 'selectionChange', updateState, this );
				// If this combo is sensitive to readOnly state, update it accordingly.
				!this.readOnly && editor.on( 'readOnly', updateState, this );

				var keyDownFn = CKEDITOR.tools.addFunction( function( ev, element ) {
					ev = new CKEDITOR.dom.event( ev );

					var keystroke = ev.getKeystroke();

					// ARROW-DOWN
					// This call is duplicated in plugins/toolbar/plugin.js in itemKeystroke().
					// Move focus to the first element after drop down was opened by the arrow down key.
					if ( keystroke == 40 ) {
						editor.once( 'panelShow', function( evt ) {
							evt.data._.panel._.currentBlock.onKeyDown( 40 );
						} );
					}

					switch ( keystroke ) {
						case 13: // ENTER
						case 32: // SPACE
						case 40: // ARROW-DOWN
							// Show panel
							CKEDITOR.tools.callFunction( clickFn, element );
							break;
						default:
							// Delegate the default behavior to toolbar button key handling.
							instance.onkey( instance, keystroke );
					}

					// Avoid subsequent focus grab on editor document.
					ev.preventDefault();
				} );

				var focusFn = CKEDITOR.tools.addFunction( function() {
					instance.onfocus && instance.onfocus();
				} );

				var selLocked = 0;

				// For clean up
				instance.keyDownFn = keyDownFn;

				var params = {
					id: id,
					name: this.name || this.command,
					label: this.label,
					title: this.title,
					cls: this.className || '',
					titleJs: env.gecko && !env.hc ? '' : ( this.title || '' ).replace( "'", '' ),
					keydownFn: keyDownFn,
					focusFn: focusFn,
					clickFn: clickFn
				};

				rcomboTpl.output( params, output );

				if ( this.onRender )
					this.onRender();

				return instance;
			},

			createPanel: function( editor ) {
				if ( this._.panel )
					return;

				var panelDefinition = this._.panelDefinition,
					panelBlockDefinition = this._.panelDefinition.block,
					panelParentElement = panelDefinition.parent || CKEDITOR.document.getBody(),
					namedPanelCls = 'cke_combopanel__' + this.name,
					panel = new CKEDITOR.ui.floatPanel2( editor, panelParentElement, panelDefinition ),
					list = panel.addListBlock2( this.id, panelBlockDefinition ),
					me = this;
				panel.onShow = function() {
					this.element.addClass( namedPanelCls );

					me.setState( CKEDITOR.TRISTATE_ON );

					me._.on = 1;

					me.editorFocus && !editor.focusManager.hasFocus && editor.focus();

					if ( me.onOpen )
						me.onOpen();

					// The "panelShow" event is fired assinchronously, after the
					// onShow method call.
					editor.once( 'panelShow', function() {
						list.focus( !list.multiSelect && me.getValue() );
					} );
				};

				panel.onHide = function( preventOnClose ) {
					this.element.removeClass( namedPanelCls );

					me.setState( me.modes && me.modes[ editor.mode ] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );

					me._.on = 0;

					if ( !preventOnClose && me.onClose )
						me.onClose();
				};

				panel.onEscape = function() {
					// Hide drop-down with focus returned.
					panel.hide( 1 );
				};

				list.onClick = function( value, marked ) {

					if ( me.onClick )
						me.onClick.call( me, value, marked );

					panel.hide();
				};

				this._.panel = panel;
				this._.list = list;

				panel.getBlock( this.id ).onHide = function() {
					me._.on = 0;
					me.setState( CKEDITOR.TRISTATE_OFF );
				};

				if ( this.init )
					this.init();
			},

			setValue: function( value, text ) {
				this._.value = value;

				var textElement = this.document.getById( 'cke_' + this.id + '_text' );
				if ( textElement ) {
					if ( !( value || text ) ) {
						text = this.label;
						textElement.addClass( 'cke_combo_inlinelabel' );
					} else {
						textElement.removeClass( 'cke_combo_inlinelabel' );
					}

					textElement.setText( typeof text != 'undefined' ? text : value );
				}
			},

			getValue: function() {
				return this._.value || '';
			},

			unmarkAll: function() {
				this._.list.unmarkAll();
			},

			mark: function( value ) {
				this._.list.mark( value );
			},

			hideItem: function( value ) {
				this._.list.hideItem( value );
			},

			hideGroup: function( groupTitle ) {
				this._.list.hideGroup( groupTitle );
			},

			showAll: function() {
				this._.list.showAll();
			},

			add: function( value, html, text ) {
				this._.items[ value ] = text || value;
				this._.list.add( value, html, text );
			},

			startGroup: function( title ) {
				this._.list.startGroup( title );
			},

			commit: function() {
				if ( !this._.committed ) {
					this._.list.commit();
					this._.committed = 1;
					CKEDITOR.ui.fire( 'ready', this );
				}
				this._.committed = 1;
			},

			setState: function( state ) {
				if ( this._.state == state )
					return;

				var el = this.document.getById( 'cke_' + this.id );
				el.setState( state, 'cke_combo' );

				state == CKEDITOR.TRISTATE_DISABLED ?
					el.setAttribute( 'aria-disabled', true ) :
					el.removeAttribute( 'aria-disabled' );

				this._.state = state;
			},

			getState: function() {
				return this._.state;
			},

			enable: function() {
				if ( this._.state == CKEDITOR.TRISTATE_DISABLED )
					this.setState( this._.lastState );
			},

			disable: function() {
				if ( this._.state != CKEDITOR.TRISTATE_DISABLED ) {
					this._.lastState = this._.state;
					this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			}
		},

		/**
		 * Represents richCombo handler object.
		 *
		 * @class CKEDITOR.ui.richCombo2.handler
		 * @singleton
		 * @extends CKEDITOR.ui.handlerDefinition
		 */
		statics: {
			handler: {
				/**
				 * Transforms a richCombo definition in a {@link CKEDITOR.ui.richCombo} instance.
				 *
				 * @param {Object} definition
				 * @returns {CKEDITOR.ui.richCombo}
				 */
				create: function( definition ) {
					return new CKEDITOR.ui.richCombo2( definition );
				}
			}
		}
	} );

	/**
	 * @param {String} name
	 * @param {Object} definition
	 * @member CKEDITOR.ui
	 * @todo
	 */
	CKEDITOR.ui.prototype.addRichCombo2 = function( name, definition ) {
		this.add( name, CKEDITOR.UI_RICHCOMBO2, definition );
	};
        
        

} )();

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//Flag whether previous tags in list should be cleared (not first time in view) or not (first time in view)
var clearPreviousTags = false;

//List of tags
var tagsList;

/**
 * Drop Down showing Current Template Definition Field Tags
 */
CKEDITOR.plugins.add( 'tagdropdown', {

	requires: 'richcombo2',
	init: function( editor ) {

		var config = editor.config;
		config.autoGrow_onStartup = true;

		editor.ui.addRichCombo2( 'tagdropdown', {
			label: "Tag",
			toolbar: 'styles,10', //Position the plugin.

			panel: {
				css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( config.contentsCss )
			},

			/**
			 * Plugin initialization
			 */
			init: function() {

				//Setting the list of the available tags
				var tagsListElement = document.getElementById("tagsList");

				if (tagsListElement) {

					var tagsListInit = tagsListElement.value;
					tagsListInit = JSON.parse(tagsListInit);

					tagsList = tagsListInit;

					if (!$("#definition").val() == "") {

						//If previous tags should be cleared from the List
						if (clearPreviousTags) {
							$(this._.panel._.iframe.$).contents().find("div.cke_panel_block").first().remove();
						}
						else {
							clearPreviousTags = true;
						}

						//Populate the List with tags
						for (var key in tagsListInit) {
							if (tagsListInit.hasOwnProperty(key)) {

								this.startGroup(key);
								for (var i in tagsListInit[key]) {

									//Add '-' in the beginning of each tag to indicate the level (depth) of the data definition (eg. field "name" in 3rd level would be "--- name")
									var prefixDescription = "";
									for (j = 0; j < tagsListInit[key][i].level; j++) {
										prefixDescription += "-";
									}

									//Derived dataset tag
									if (tagsListInit[key][i].derivedDataset) {
										this.add(tagsListInit[key][i].name, prefixDescription + " " + tagsListInit[key][i].description + " - Υποφόρμα - Επίπεδο " + tagsListInit[key][i].level);
									}
									else {
										//Field tag
										this.add(tagsListInit[key][i].name, prefixDescription + " " + tagsListInit[key][i].description);
									}
								}

							}
						}

					}
				}
			},

			/**
			 * Selection changed
			 * @param value
             */
			onClick : function( value ){

				for (var key in tagsList) {
					if (tagsList.hasOwnProperty(key)) {
						for(var i in tagsList[key]){
							//search the given tag and get necessary information
							if(tagsList[key][i].name == value){
								//note: needs 'extraAllowedContent' on editors instance configuration

								//Dataset was selected
								if (tagsList[key][i].derivedDataset) {
									var html = '<div id="' + tagsList[key][i].name + '"></div>';
								}
								else if (tagsList[key][i].type == "BASE64IMAGE") {
									//Base64Image was selected
									var html = '<img id="' + tagsList[key][i].name + '" style="display:block; width:60px;height:60px;" src="' + tagsList[key][i].base64image + '" />';
								}
								else {
									//Field without grammar was selected
									if (!tagsList[key][i].grammarCase) {
										var html = '<input type="text" class="tag" id="' + tagsList[key][i].name + '" value="' + tagsList[key][i].description + '" strformat="" size="' + (tagsList[key][i].description.length) + '" readonly="true" />';
									}
									else {
										//Field with grammar was selected
										var html = '<input type="text" class="tag" id="' + tagsList[key][i].name + '" value="' + tagsList[key][i].description + '" strformat="" size="' + (tagsList[key][i].description.length) + '" readonly="true" grammar-case="' + tagsList[key][i].grammarCase + '" />';
									}
								}
								editor.insertHtml(html);
								break;
							}
						}//for
					}
				}
			}//onClick


		} );
	}

} );
