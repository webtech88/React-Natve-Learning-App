import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Image,
	Text,
} from 'react-native'

import common from '../../common'
import ss from '../../styles'

const { CloudinaryImage, TransText } = common.components.core

// TODO improvements?
const BUBBLE_WIDTH = ss.size(200)
const BUBBLE_HEIGHT = ss.size(210)
const MARGIN = ss.size(50)
const PADDING = ss.size(40)
const CARD_WIDTH = BUBBLE_WIDTH + MARGIN

class WorkbookCover extends Component {

	renderRibbon = () => {
		const { width, workbook } = this.props
		const scale = Math.round((width / CARD_WIDTH) * 100) / 100
		const fontSize = Math.round(18 * scale)
		let ribbonText

		if (workbook.progress_percentage >= 100) {
			ribbonText = 'COMPLETE'
		} else if (workbook.mandatory) {
			ribbonText = 'MANDATORY'
		}

		if (ribbonText) {
			return (
				<View style={[styles.accomplished, { width, top: (width / 8) + 4, left: -(width / 4) }]}>
					<TransText style={[styles.accomplishedText, { fontSize }]} transkey={ribbonText} />
				</View>
			)
		}

		return null
	}

	render() {
		const { width, height, workbook } = this.props

		return (
			<View style={[styles.cover, { width, height }]}>
				{workbook.cover
					? <CloudinaryImage
						publicId={workbook.cover}
						width={width}
						height={height}
						loadingColor={ss.constants.COLOR_CORE_BRAND}
						options="cover"
					/>
					: null
				}
				{this.renderRibbon()}
			</View>
		)
	}

}

WorkbookCover.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	workbook: PropTypes.object.isRequired,
}


// StyleSheet
const {
	size,
	typo: { pSemiBold },
} = ss

const styles = ss.create({
	cover: {
		// TODO color variables
		backgroundColor: '#EEEEEE',
		// backgroundColor: 'pink', // NOTE testing flexbox
		overflow: 'hidden',
		// android: {
		// 	elevation: 1,
		// },
	},
	accomplished: {
		zIndex: 1,
		position: 'absolute',
		backgroundColor: ss.constants.COLOR_CORE_BRAND,
		padding: size(5),
		alignItems: 'center',
		transform: [{ rotate: '-45deg' }],
	},
	accomplishedText: {
		...pSemiBold,
		flex: 1,
		color: 'white',
	},
})


export default WorkbookCover
