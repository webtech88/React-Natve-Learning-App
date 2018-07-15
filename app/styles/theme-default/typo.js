import constants from './constants'
import helpers from './helpers'

const { size } = helpers


// Typography styles
const typo = {
	h1: {
		fontFamily: constants.FONT_SECONDARY_REGULAR,
		fontSize: size(24),
		color: constants.COLOR_HEADING,
	},
	h2: {
		fontFamily: constants.FONT_PRIMARY_SEMIBOLD,
		fontSize: size(16),
		color: constants.COLOR_HEADING,
	},
	p: {
		fontFamily: constants.FONT_PRIMARY_REGULAR,
		fontSize: size(15),
		color: constants.COLOR_TEXT_PRIMARY,
	},
	pLight: {
		fontFamily: constants.FONT_PRIMARY_LIGHT,
		fontSize: size(15),
		color: constants.COLOR_HEADING,
	},
	pSemiBold: {
		fontFamily: constants.FONT_PRIMARY_SEMIBOLD,
		fontSize: size(15),
		color: constants.COLOR_TEXT_PRIMARY,
	},
	pBold: {
		fontFamily: constants.FONT_PRIMARY_BOLD,
		fontSize: size(15),
		color: constants.COLOR_TEXT_PRIMARY,
	},
	link: {
		fontFamily: constants.FONT_PRIMARY_REGULAR,
		fontSize: size(15),
		color: constants.COLOR_LINK,
	},
	// pItalic: {
	//
	// },
	// pSmall: {
	//
	// },
}

// extend typo for bold ???

export default typo
