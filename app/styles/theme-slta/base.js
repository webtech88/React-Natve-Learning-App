import constants from './constants'
import helpers from './helpers'

const { size } = helpers


// Base styles
const base = {
	wrapper: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		paddingTop: constants.HEIGHT_NAV_BAR,
	},
	hr: {
		paddingVertical: size(15),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	hrBorder: {
		flex: 1,
		height: 1,
		opacity: 0.3,
		backgroundColor: constants.COLOR_CORE_PRIMARY,
	},
	hrParagraph: {
		marginLeft: 10,
		marginRight: 10,
	},
}

export default base
