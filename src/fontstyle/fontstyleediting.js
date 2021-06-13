/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontstyle/fontstyleediting
 */

import { Plugin } from 'ckeditor5/src/core';
import { CKEditorError } from 'ckeditor5/src/utils';
import { isLength, isPercentage } from 'ckeditor5/src/engine';

import FontStyleCommand from './fontstylecommand';
import { normalizeOptions } from './utils';
import { buildDefinition, FONT_STYLE } from '../utils';

// Mapping of `<font style="..">` styling to CSS's `font-style` values.
const styleFontStyle = [
	'x-small', // Style "0" equal to "1".
	'x-small',
	'small',
	'medium',
	'large',
	'x-large',
	'xx-large',
	'xxx-large'
];

/**
 * The font style editing feature.
 *
 * It introduces the {@link module:font/fontstyle/fontstylecommand~FontStyleCommand command} and the `fontStyle`
 * attribute in the {@link module:engine/model/model~Model model} which renders in the {@link module:engine/view/view view}
 * as a `<span>` element with either:
 * * a style attribute (`<span style="font-style:12px">...</span>`),
 * * or a class attribute (`<span class="text-small">...</span>`)
 *
 * depending on the {@link module:font/fontstyle~FontStyleConfig configuration}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontStyleEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FontStyleEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		// Define default configuration using named presets.
		editor.config.define( FONT_STYLE, {
			options: [
				'tiny',
				'small',
				'default',
				'big',
				'huge'
			],
			supportAllValues: false
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow fontStyle attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: FONT_STYLE } );
		editor.model.schema.setAttributeProperties( FONT_STYLE, {
			isFormatting: true,
			copyOnEnter: true
		} );

		const supportAllValues = editor.config.get( 'fontStyle.supportAllValues' );

		// Define view to model conversion.
		const options = normalizeOptions( this.editor.config.get( 'fontStyle.options' ) )
			.filter( item => item.model );
		const definition = buildDefinition( FONT_STYLE, options );

		// Set-up the two-way conversion.
		if ( supportAllValues ) {
			this._prepareAnyValueConverters( definition );
			this._prepareCompatibilityConverter();
		} else {
			editor.conversion.attributeToElement( definition );
		}

		// Add FontStyle command.
		editor.commands.add( FONT_STYLE, new FontStyleCommand( editor ) );
	}

	/**
	 * These converters enable keeping any value found as `style="font-style: *"` as a value of an attribute on a text even
	 * if it is not defined in the plugin configuration.
	 *
	 * @param {Object} definition {@link module:engine/conversion/conversion~ConverterDefinition Converter definition} out of input data.
	 * @private
	 */
	_prepareAnyValueConverters( definition ) {
		const editor = this.editor;

		// If `fontStyle.supportAllValues=true`, we do not allow to use named presets in the plugin's configuration.
		const presets = definition.model.values.filter( value => {
			return !isLength( String( value ) ) && !isPercentage( String( value ) );
		} );

		if ( presets.length ) {
			/**
			 * If {@link module:font/fontstyle~FontStyleConfig#supportAllValues `config.fontStyle.supportAllValues`} is `true`,
			 * you need to use numerical values as font style options.
			 *
			 * See valid examples described in the {@link module:font/fontstyle~FontStyleConfig#options plugin configuration}.
			 *
			 * @error font-style-invalid-use-of-named-presets
			 * @param {Array.<String>} presets Invalid values.
			 */
			throw new CKEditorError(
				'font-style-invalid-use-of-named-presets',
				null, { presets }
			);
		}

		editor.conversion.for( 'downcast' ).attributeToElement( {
			model: FONT_STYLE,
			view: ( attributeValue, { writer } ) => {
				if ( !attributeValue ) {
					return;
				}

				return writer.createAttributeElement( 'span', { style: 'font-style:' + attributeValue }, { priority: 7 } );
			}
		} );

		editor.conversion.for( 'upcast' ).elementToAttribute( {
			model: {
				key: FONT_STYLE,
				value: viewElement => viewElement.getStyle( 'font-style' )
			},
			view: {
				name: 'span',
				styles: {
					'font-style': /.*/
				}
			}
		} );
	}

	/**
	 * Adds support for legacy `<font style="..">` formatting.
	 *
	 * @private
	 */
	_prepareCompatibilityConverter() {
		const editor = this.editor;

		editor.conversion.for( 'upcast' ).elementToAttribute( {
			view: {
				name: 'font',
				attributes: {
					// Documentation mentions styles from 1 to 7. To handle old content we support all values
					// up to 999 but clamp it to the valid range. Why 999? It should cover accidental values
					// similar to percentage, e.g. 100%, 200% which could be the usual mistake for font style.
					'style': /^[+-]?\d{1,3}$/
				}
			},
			model: {
				key: FONT_STYLE,
				value: viewElement => {
					const value = viewElement.getAttribute( 'style' );
					const isRelative = value[ 0 ] === '-' || value[ 0 ] === '+';

					let style = parseInt( value, 10 );

					if ( isRelative ) {
						// Add relative style (which can be negative) to the default style = 3.
						style = 3 + style;
					}

					const maxStyle = styleFontStyle.length - 1;
					const clampedStyle = Math.min( Math.max( style, 0 ), maxStyle );

					return styleFontStyle[ clampedStyle ];
				}
			}
		} );
	}
}
