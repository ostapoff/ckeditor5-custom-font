/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module font/fontstyle/fontstylecommand
 */

import FontCommand from '../fontcommand';
import { FONT_STYLE } from '../utils';

/**
 * The font style command. It is used by {@link module:font/fontstyle/fontstyleediting~FontStyleEditing}
 * to apply the font style.
 *
 *		editor.execute( 'fontStyle', { value: 'small' } );
 *
 * **Note**: Executing the command without the value removes the attribute from the model.
 *
 * @extends module:font/fontcommand~FontCommand
 */
export default class FontStyleCommand extends FontCommand {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor, FONT_STYLE );
	}
}
