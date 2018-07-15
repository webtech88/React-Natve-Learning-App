import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	ViewPropTypes,
	Text,
} from 'react-native'

import ss from '../../../../styles'


const List = ({ type, items, style }) => {
	let renderedItems = []

	items.every((item) => {
		if (item[1]) {
			renderedItems = [
				...renderedItems,
				item[1],
			]
		}

		return item
	})

	return (
		<View style={[style, styles.list]}>
			{renderedItems.map((item, index) => (
				<View key={index} style={styles.item}>
					<View style={styles.type}>
						{type === 'ordered'
							? <Text style={styles.number}>{index + 1}</Text>
							: <View style={styles.bullet} />
						}
					</View>
					<Text selectable style={styles.p}>{item}</Text>
				</View>
				))}
		</View>
	)
}

List.propTypes = {
	type: PropTypes.oneOf(['ordered', 'unordered']).isRequired,
	items: PropTypes.arrayOf(PropTypes.array).isRequired,
	style: ViewPropTypes.style,
}

List.defaultProps = {
	type: 'unordered',
	style: {},
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const listStyle = {
	...p,
	fontSize: size(16),
	opacity: 0.8,
}

const styles = ss.create({
	list: {
		marginTop: size(10),
		marginBottom: size(20),
	},
	item: {
		paddingVertical: size(2),
		flexDirection: 'row',
	},
	type: {

	},
	number: {
		...listStyle,
		opacity: 0.8,
	},
	bullet: {
		width: size(5),
		height: size(5),
		borderRadius: size(5),
		top: size(8),
		backgroundColor: ss.constants.COLOR_CORE_DARK,
		opacity: 0.8,
	},
	p: {
		...listStyle,
		flex: 1,
		marginLeft: size(10),
	},
})


export default List
