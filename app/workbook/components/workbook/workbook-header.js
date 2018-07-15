import React, { Component } from 'react'
import {
	View,
	Text,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import moment from 'moment-timezone'
import cloudinary from 'cloudinary-core'
import Video from 'react-native-video'
import Svg, { Ellipse } from 'react-native-svg'
import Config from 'react-native-config'

import cloudinaryConfiguration from '../../../core/config/cloudinary'
import ss from '../../../styles'
import common from '../../../common'

const { ProgressBadge } = common.components.workbook
const { CloudinaryImage, TransText } = common.components.core

const WIDTH = ss.constants.WIDTH_DEVICE
const CURVE_HEIGHT = ss.size(120)
const CURVE_WIDTH = WIDTH + (2.5 * CURVE_HEIGHT)


class WorkbookHeader extends Component {

	constructor(props) {
		super(props)

		this.state = {
			height: null,
		}

		this.cl = cloudinary.Cloudinary.new({ cloud_name: Config.CLOUDINARY_CLOUD_NAME })
	}

	render() {
		const { workbook, totalActivities, completedActivities } = this.props
		const { height: headerHeight } = this.state

		if (workbook) {
			let Background = null
			let Created = null
			let Modified = null

			// Header
			if (workbook.header) {
				if (workbook.header_type === 'image' && headerHeight) {
					Background = (
						<CloudinaryImage
							style={styles.video}
							publicId={workbook.header}
							width={ss.constants.WIDTH_DEVICE}
							height={headerHeight}
						/>
					)
				} else if (workbook.header_type === 'video') {
					// TODO
					// emded ???
					const videoUri = this.cl.url(workbook.header, { ...cloudinaryConfiguration.video })

					Background = (
						<Video
							ref={(ref) => { this.videoPlayer = ref }}
							style={styles.video}
							source={{ uri: videoUri }}
							rate={1}
							paused={false}
							volume={0}
							// muted={false}
							// paused={false}
							resizeMode="cover"
							repeat
							playInBackground={false}
							playWhenInactive={false}
						/>
					)
				}
			}

			// Created by
			if (workbook.created) {
				let createdBy = ['Created', ':']

				if (
					workbook.created_by &&
					R.has('screen_name', workbook.created_by) &&
					!R.isEmpty(workbook.created_by.screen_name)
				) {
					createdBy = ['Created by', ':']
					createdBy.push(workbook.created_by.screen_name)
				}

				createdBy.push(moment(workbook.created).tz('Europe/London').format('DD/MM/YYYY'))

				Created = (
					<TransText
						style={styles.p}
						transkeys={createdBy}
						tindices={[0]}
					/>
				)
			}

			// Modified by
			if (workbook.modified) {
				let modifiedBy = ['Modified', ':']

				if (
					workbook.modified_by &&
					R.has('screen_name', workbook.modified_by) &&
					!R.isEmpty(workbook.modified_by.screen_name)
				) {
					modifiedBy = ['Modified by', ':']
					modifiedBy.push(workbook.modified_by.screen_name)
				}

				modifiedBy.push(moment(workbook.modified).tz('Europe/London').format('DD/MM/YYYY'))

				Modified = (
					<Text style={styles.p}>{modifiedBy.join(' ')}</Text>
				)
			}

			return (
				<View
					style={styles.header}
					onLayout={({ nativeEvent }) => this.setState({ height: nativeEvent.layout.height })}
				>
					{/* TODO inner shadow so text more readable? */}
					{Background}
					<View style={styles.top}>
						<Text style={styles.h1}>{workbook.title}</Text>
						<View style={styles.info}>
							<TransText 
								style={[styles.infoText, styles.creditVal]}
								transkeys={['CREDIT_VALUE', ': ']}
								tindices={[0]}
								innerbottom={<Text style={styles.bold}> {workbook.credit_value || 0}</Text>}
							/>
							<TransText 
								style={[styles.infoText, styles.creditVal]}
								transkeys={['UNIT_TASKS', ': ']}
								tindices={[0]}
								innerbottom={<Text style={styles.bold}> {`${completedActivities}/${totalActivities}`}</Text>}
							/>
						</View>
					</View>
					<View style={styles.bottom}>
						<View style={styles.svg}>
							<Svg
								style={{ left: -(CURVE_HEIGHT / 1.5) }}
								height={CURVE_HEIGHT}
								width={CURVE_WIDTH}
							>
								<Ellipse
									cx={(CURVE_WIDTH / 2) - ss.size(100)}
									cy={(CURVE_HEIGHT / 2)}
									rx={CURVE_WIDTH / 2}
									ry={(CURVE_HEIGHT / 2)}
									fill="white"
								/>
							</Svg>
						</View>
						<View style={styles.bottomInfo}>
							<ProgressBadge
								percentage={workbook.progress_percentage}
								style={styles.progressBadge}
							/>
							<View style={styles.bottomInfoTextContainer}>
								<Text style={styles.bottomInfoText}>{Created}</Text>
								<Text style={styles.bottomInfoText}>{Modified}</Text>
							</View>
						</View>
					</View>
				</View>
			)
		}

		return null
	}
}

WorkbookHeader.propTypes = {
	workbook: PropTypes.object.isRequired,
	totalActivities: PropTypes.number,
	completedActivities: PropTypes.number,
}

WorkbookHeader.defaultProps = {
	totalActivities: 0,
	completedActivities: 0,
}


// StyleSheet
const {
	size,
	typo: { h1, p },
} = ss

const styles = ss.create({
	header: {
		// backgroundColor: 'gray', // NOTE testing flexbox
		backgroundColor: ss.constants.COLOR_CORE_PRIMARY,
	},
	top: {
		paddingTop: size(30),
		paddingHorizontal: size(20),
		// paddingBottom: size(50),
		paddingBottom: size(20),
	},
	video: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		ios: {
			backgroundColor: 'transparent',
		},
	},
	h1: {
		...h1,
		fontSize: size(32),
		color: 'white',
		backgroundColor: 'transparent',
		marginBottom: size(20),
	},
	info: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	infoText: {
		...p,
		color: 'white',
		backgroundColor: 'transparent',
		fontSize: size(12),
	},
	creditVal: {
		marginRight: ss.size(20),
	},
	bold: {
		fontWeight: 'bold',
	},
	bottom: {
		backgroundColor: 'transparent',
		paddingBottom: size(10), // TODO: needed on android, check ios
	},
	svg: {
		position: 'absolute',
		top: ss.size(20),
		right: 0,
		left: 0,
		bottom: 0,
	},
	bottomInfo: {
		flexDirection: 'row',
		paddingHorizontal: size(20),
	},
	progressBadge: {
		marginRight: ss.size(20),
	},
	bottomInfoTextContainer: {
		flex: 1,
		top: ss.size(35),
	},
	bottomInfoText: {
		...p,
		fontSize: size(11),
		opacity: 0.7,
	},
})


export default WorkbookHeader
