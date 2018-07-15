import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
	Image,
	Text,
} from 'react-native'

import ss from '../../../../styles'


const Blockquote = ({ children, style }) => (
	<View style={[style, styles.container, { marginBottom: ss.size(20) }]}>
		<View style={styles.block}>
			<Text selectable style={styles.blockquote}>{children}</Text>
		</View>
		<Image source={ss.images.blockquote} resizeMode="contain" style={styles.image} />
	</View>

	)

Blockquote.propTypes = {
	children: PropTypes.node.isRequired,
	style: ViewPropTypes.style,
}

Blockquote.defaultProps = {
	style: {},
}

// StyleSheet
const {
	size,
	typo: { h1 },
} = ss

const styles = ss.create({
	container: {
		paddingTop: size(30),
	},
	block: {
		backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
		paddingTop: size(45),
		paddingBottom: size(30),
		paddingHorizontal: size(30),
	},
	image: {
		alignSelf: 'center',
		position: 'absolute',
		top: 0,
		height: size(60),
	},
	blockquote: {
		...h1,
		fontSize: size(18),
		lineHeight: size(26),
	},
})


export default Blockquote
