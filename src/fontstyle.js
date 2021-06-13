/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontstyle
 */

import { Plugin } from 'ckeditor5/src/core';
import FontStyleEditing from './fontstyle/fontstyleediting';
import FontStyleUI from './fontstyle/fontstyleui';

/**
 * The font style plugin.
 *
 * For a detailed overview, check the {@glink features/font font feature} documentation
 * and the {@glink api/font package page}.
 *
 * This is a "glue" plugin which loads the {@link module:font/fontstyle/fontstyleediting~FontStyleEditing} and
 * {@link module:font/fontstyle/fontstyleui~FontStyleUI} features in the editor.
 *
 * @extends module:core/plugin~Plugin
 */
export default class FontStyle extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ FontStyleEditing, FontStyleUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FontStyle';
	}
}

/**
 * The font style option descriptor.
 *
 * @typedef {Object} module:font/fontstyle~FontStyleOption
 *
 * @property {String} title The user-readable title of the option.
 * @property {String} model The attribute's unique value in the model.
 * @property {module:engine/view/elementdefinition~ElementDefinition} view View element configuration.
 * @property {Array.<module:engine/view/elementdefinition~ElementDefinition>} [upcastAlso] An array with all matched elements that
 * the view-to-model conversion should also accept.
 */

/**
 * The configuration of the font style feature.
 * It is introduced by the {@link module:font/fontstyle/fontstyleediting~FontStyleEditing} feature.
 *
 * Read more in {@link module:font/fontstyle~FontStyleConfig}.
 *
 * @member {module:font/fontstyle~FontStyleConfig} module:core/editor/editorconfig~EditorConfig#fontStyle
 */

/**
 * The configuration of the font style feature.
 * This option is used by the {@link module:font/fontstyle/fontstyleediting~FontStyleEditing} feature.
 *
 * 		ClassicEditor
 * 			.create( {
 * 				fontStyle: ... // Font style feature configuration.
 *			} )
 * 			.then( ... )
 * 			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface module:font/fontstyle~FontStyleConfig
 */

/**
 * Available font style options. Expressed as predefined presets, numerical "pixel" values
 * or the {@link module:font/fontstyle~FontStyleOption}.
 *
 * The default value is:
 *
 *		const fontStyleConfig = {
 *			options: [
 *				'tiny',
 * 				'small',
 * 				'default',
 * 				'big',
 * 				'huge'
 *			]
 *		};
 *
 * It defines 4 styles: **tiny**, **small**, **big**, and **huge**. These values will be rendered as `<span>` elements in the view.
 * The **default** defines a text without the `fontStyle` attribute.
 *
 * Each `<span>` has the the `class` attribute set to the corresponding style name. For instance, this is what the **small** style looks
 * like in the view:
 *
 * 		<span class="text-small">...</span>
 *
 * As an alternative, the font style might be defined using numerical values (either as a `Number` or as a `String`):
 *
 * 		const fontStyleConfig = {
 * 			options: [ 9, 10, 11, 12, 13, 14, 15 ]
 * 		};
 *
 * Also, you can define a label in the dropdown for numerical values:
 *
 *		const fontStyleConfig = {
 *			options: [
 *				{
 * 				 	title: 'Small',
 * 				 	model: '8px
 * 				},
 * 				'default',
 * 				{
 * 				 	title: 'Big',
 * 				 	model: '14px
 * 				}
 *			]
 *		};
 *
 * Font style can be applied using the command API. To do that, use the `'fontStyle'` command and pass the desired font style as a `value`.
 * For example, the following code will apply the `fontStyle` attribute with the **tiny** value to the current selection:
 *
 *		editor.execute( 'fontStyle', { value: 'tiny' } );
 *
 * Executing the `fontStyle` command without value will remove the `fontStyle` attribute from the current selection.
 *
 * @member {Array.<String|Number|module:font/fontstyle~FontStyleOption>} module:font/fontstyle~FontStyleConfig#options
 */

/**
 * By default the plugin removes any `font-style` value that does not match the plugin's configuration. It means that if you paste content
 * with font styles that the editor does not understand, the `font-style` attribute will be removed and the content will be displayed
 * with the default style.
 *
 * You can preserve pasted font style values by switching the `supportAllValues` option to `true`:
 *
 *		const fontStyleConfig = {
 *			options: [ 9, 10, 11, 12, 'default', 14, 15 ],
 *			supportAllValues: true
 *		};
 *
 * **Note:** This option can only be used with numerical values as font style options.
 *
 * With this configuration font styles not specified in the editor configuration will not be removed when pasting the content.
 *
 * @member {Boolean} module:font/fontstyle~FontStyleConfig#supportAllValues
 */
