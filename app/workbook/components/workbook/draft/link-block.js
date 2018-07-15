import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
	Text,
	Image,
} from 'react-native'

import ss from '../../../../styles'


const LinkBlock = ({ data, onPress, style }) => {
	if (data.url) {
		let text = data.text
		if ((text === null || text === '') && data.url) text = data.url.replace(/^(https?|ftp):\/\//, '')

		return (
			<View style={[style, styles.container, { marginBottom: ss.size(20) }]}>
				<View style={styles.block}>
					{text ? <Text style={styles.link} onPress={onPress}>{text}</Text> : null}
				</View>
				<Image source={ss.images.linkBlock} resizeMode="contain" style={styles.icon} />
			</View>
		)
	}

	return null
}

LinkBlock.propTypes = {
	data: PropTypes.shape({
		url: PropTypes.string,
		text: PropTypes.string,
	}).isRequired,
	onPress: PropTypes.func.isRequired,
	style: ViewPropTypes.style,
}

LinkBlock.defaultProps = {
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
		alignItems: 'center',
		backgroundColor: ss.constants.COLOR_CORE_BRAND,
		paddingTop: size(45),
		paddingBottom: size(30),
		paddingHorizontal: size(30),
	},
	icon: {
		alignSelf: 'center',
		position: 'absolute',
		top: 0,
		height: size(60),
	},
	link: {
		...h1,
		fontSize: size(20),
		color: 'white',
	},
})


export default LinkBlock
