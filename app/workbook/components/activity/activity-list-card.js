import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
    View,
	Text,
	Image,
} from 'react-native'

import ss from '../../../styles'

const INACTIVE_COLOR = ss.constants.COLOR_CARD_UNSELECTED
const ACTIVE_COLOR = ss.constants.COLOR_CARD_SELECTED
const ACTIVE_BORDER_COLOR = ss.constants.COLOR_CORE_LIGHT
const INACTIVE_BORDER_COLOR = 'rgba(0, 48, 87, 0.30)'

const renderDragDots = selected => (
	<View style={styles.draggableContainer}>
		{new Array(3).fill(0).map((e, i) => (
			<View key={i} style={[ // eslint-disable-line react/no-array-index-key
				styles.dragDot,
				{ backgroundColor: selected ? 'rgba(255, 255, 255, 0.3)' : INACTIVE_BORDER_COLOR }]}
			/>
		))}
	</View>
)

class ActivityListCard extends Component {
	setNativeProps(nativeProps) {
		this.root.setNativeProps(nativeProps)
	}

	render() {
		const { image, text, draggable, selected, index } = this.props
		const textColor = selected ? ACTIVE_BORDER_COLOR : ss.constants.COLOR_CORE_DARK
		const renderIndex = index !== null && index + 1

		return (
			<View ref={(component) => { this.root = component }} style={styles.container}>
				{image && image.length > 0 && (
					<Image source={{ uri: image }} style={styles.image} />
				)}
				<View style={styles.flexContainer}>
					<View style={[
						styles.border,
						{
							backgroundColor: selected ? ACTIVE_COLOR : INACTIVE_COLOR,
							borderColor: selected ? ACTIVE_BORDER_COLOR : INACTIVE_BORDER_COLOR,
						},
					]}
					>
						<View style={[
							styles.contentContainer,
							{ backgroundColor: selected ? ACTIVE_COLOR : INACTIVE_COLOR },
						]}
						>
							<View style={[styles.labelContainer, { paddingLeft: image ? size(59) : size(20) }]}>
								{renderIndex > 0 &&
									<Text
										style={[styles.indexLabel, { color: textColor }]}
									>{renderIndex.toString()}</Text>
								}
								<Text style={[styles.cardDescription, { color: textColor }]}>{text}</Text>
								{draggable && renderDragDots(selected)}
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

ActivityListCard.propTypes = {
	image: PropTypes.string,
	text: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	draggable: PropTypes.bool,
	index: PropTypes.number,
}

ActivityListCard.defaultProps = {
	image: null,
	selected: false,
	draggable: false,
	index: null,
}

// StyleSheet
const {
	size,
	typo: { p, pBold },
} = ss

const styles = ss.create({
	border: {
		borderStyle: 'dashed',
		borderWidth: 1,
		borderRadius: 2,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	contentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cardDescription: {
		...p,
		fontSize: size(16),
		paddingVertical: size(6),
		paddingRight: size(5),
		flex: 1,
	},
	image: {
		height: size(80),
		width: size(80),
		borderRadius: size(40),
		borderColor: INACTIVE_COLOR,
		borderWidth: size(4),
		marginRight: -size(40),
		zIndex: 1,
	},
	dragDot: {
		height: size(4),
		width: size(4),
	},
	draggableContainer: {
		justifyContent: 'space-around',
		height: size(24),
	},
	flexContainer: {
		flex: 1,
	},
	labelContainer: {
		paddingVertical: size(6),
		paddingHorizontal: size(20),
		flexDirection: 'row',
		alignItems: 'center',
	},
	indexLabel: {
		...pBold,
		fontSize: size(24),
		paddingRight: size(20),
	},
})

export default ActivityListCard
