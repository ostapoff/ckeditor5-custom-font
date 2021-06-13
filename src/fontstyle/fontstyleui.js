/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontstyle/fontstyleui
 */

import { Plugin } from 'ckeditor5/src/core';
import { Model, createDropdown, addListToDropdown } from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';

import { normalizeOptions } from './utils';
import { FONT_STYLE } from '../utils';

import fontStyleIcon from '../../theme/icons/font-style.svg';
import '../../theme/fontstyle.css';

/**
 * The font style UI plugin. It introduces the `'fontStyle'` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontStyleUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FontStyleUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		const options = this._getLocalizedOptions();

		const command = editor.commands.get( FONT_STYLE );

		// Register UI component.
		editor.ui.componentFactory.add( FONT_STYLE, locale => {
			const dropdownView = createDropdown( locale );
			addListToDropdown( dropdownView, _prepareListOptions( options, command ) );

			// Create dropdown model.
			dropdownView.buttonView.set( {
				label: t( 'Font Style' ),
				icon: fontStyleIcon,
				tooltip: true
			} );

			dropdownView.extendTemplate( {
				attributes: {
					class: [
						'ck-font-style-dropdown'
					]
				}
			} );

			dropdownView.bind( 'isEnabled' ).to( command );

			// Execute command when an item from the dropdown is selected.
			this.listenTo( dropdownView, 'execute', evt => {
				editor.execute( evt.source.commandName, { value: evt.source.commandParam } );
				editor.editing.view.focus();
			} );

			return dropdownView;
		} );
	}

	/**
	 * Returns options as defined in `config.fontStyle.options` but processed to account for
	 * editor localization, i.e. to display {@link module:font/fontstyle~FontStyleOption}
	 * in the correct language.
	 *
	 * Note: The reason behind this method is that there is no way to use {@link module:utils/locale~Locale#t}
	 * when the user configuration is defined because the editor does not exist yet.
	 *
	 * @private
	 * @returns {Array.<module:font/fontstyle~FontStyleOption>}.
	 */
	_getLocalizedOptions() {
		const editor = this.editor;
		const t = editor.t;

		const localizedTitles = {
			Default: t( 'Default' ),
			Tiny: t( 'Tiny' ),
			Small: t( 'Small' ),
			Big: t( 'Big' ),
			Huge: t( 'Huge' )
		};

		const options = normalizeOptions( editor.config.get( FONT_STYLE ).options );

		return options.map( option => {
			const title = localizedTitles[ option.title ];

			if ( title && title != option.title ) {
				// Clone the option to avoid altering the original `namedPresets` from `./utils.js`.
				option = Object.assign( {}, option, { title } );
			}

			return option;
		} );
	}
}

// Prepares FontStyle dropdown items.
// @private
// @param {Array.<module:font/fontstyle~FontStyleOption>} options
// @param {module:font/fontstyle/fontstylecommand~FontStyleCommand} command
function _prepareListOptions( options, command ) {
	const itemDefinitions = new Collection();

	for ( const option of options ) {
		const def = {
			type: 'button',
			model: new Model( {
				commandName: FONT_STYLE,
				commandParam: option.model,
				label: option.title,
				class: 'ck-fontstyle-option',
				withText: true
			} )
		};

		if ( option.view && option.view.styles ) {
			def.model.set( 'labelStyle', `font-style:${ option.view.styles[ 'font-style' ] }` );
		}

		if ( option.view && option.view.classes ) {
			def.model.set( 'class', `${ def.model.class } ${ option.view.classes }` );
		}

		def.model.bind( 'isOn' ).to( command, 'value', value => value === option.model );

		// Add the option to the collection.
		itemDefinitions.add( def );
	}

	return itemDefinitions;
}
