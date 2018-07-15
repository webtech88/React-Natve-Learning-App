import constants from './constants'
import helpers from './helpers'
import typo from './typo'

const { size } = helpers
const { p } = typo

// NavBar styles
const navBar = {
	navBar: {
		// position: 'relative', // test if navBar not duplicated
		// opacity: .5,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		paddingTop: 0,
		height: constants.HEIGHT_NAV_BAR,
		borderBottomWidth: 0,
		borderBottomColor: 'rgba(0, 0, 0, .1)',
		backgroundColor: 'white',
		// backgroundColor: 'transparent',
		// backgroundColor: 'gray' // NOTE testing flexbox
	},
	navBarTransparent: {
		backgroundColor: 'transparent',
	},
	navTitleWrapper: {
		// backgroundColor: 'yellow', // NOTE testing flexbox
		position: 'absolute',
		top: constants.HEIGHT_STATUS_BAR,
		left: 0,
		right: 0,
		marginTop: 10,
	},
	navTitle: {
		...p,
		fontSize: size(17),
		color: constants.COLOR_HEADING,
		textAlign: 'center',
		width: constants.WIDTH_NAV_BAR_TITLE,
		alignSelf: 'center',
	},
	navButton: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		position: 'absolute',
		zIndex: 0,
		top: constants.HEIGHT_STATUS_BAR,
		// width: 70,
		minWidth: 70,
		height: constants.HEIGHT_NAV_BAR - constants.HEIGHT_STATUS_BAR,
		padding: 8,
		flexDirection: 'row',
		alignItems: 'center',
		zIndex: 1,
	},
	navButtonLeft: {
		left: 0,
		paddingRight: 1,
		justifyContent: 'flex-start',
	},
	navButtonRight: {
		right: 0,
		paddingLeft: 1,
		justifyContent: 'flex-end',
	},
	navButtonIconCircle: {
		alignItems: 'center',
		justifyContent: 'center',
		width: size(32),
		height: size(32),
		borderRadius: size(32),
		backgroundColor: 'white',
		shadowColor: 'black',
		shadowOffset: {
			height: 5,
			width: 0,
		},
		shadowOpacity: 0.3,
		shadowRadius: size(10),
		elevation: 5,
	},
	navButtonIconCircleTouch: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	navButtonIcon: {
		// paddingHorizontal: size(10),
	},
	navButtonImage: {
		width: size(24),
		height: size(24),
	},
	navButtonText: {
		...p,
		fontSize: size(17),
		color: constants.COLOR_HEADING,
		paddingBottom: size(5),
	},
	navBarIconContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		// ios: {
		// 	paddingTop: 2,
		// },
	},
}

export default navBar
