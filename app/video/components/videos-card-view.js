import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ListView,
	View,
	Text,
	TouchableOpacity,
} from 'react-native'

import { formatTime } from '../../common/util/helpers'
import ss from '../../styles'
import common from '../../common'

const { CloudinaryImage, Icon } = common.components.core

class VideosCardView extends Component {

	constructor(props) {
		super(props)

		const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

		this.state = {
			videos: ds.cloneWithRows(this.props.videos),
		}
	}

	componentWillReceiveProps(newProps) {
		if (this.props.videos !== newProps.videos) {
			this.setState({
				videos: this.state.videos.cloneWithRows(newProps.videos),
			})
			this.cardView.scrollTo({ x: 0, y: 0, animated: false })
		}
	}

	renderVideoCard = (video) => {
		const { width, onPress } = this.props
		const { media_id, video_category_id, cloudinary_file_id, title, description, duration } = video

		return (
			<TouchableOpacity
				key={`Video_${media_id}`}
				activeOpacity={0.95}
				style={[styles.card, { width }]}
				onPress={() => onPress(media_id, video_category_id)}
			>
				<View style={styles.preview}>
					{cloudinary_file_id &&
						<CloudinaryImage
							style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
							publicId={cloudinary_file_id}
							width={width - size(20)}
							height={size(90)}
							options="poster"
						/>
					}
					<View style={styles.playButtonContainer}>
						<Icon name="play-button" size={ss.size(28)} color="white" />
					</View>
					{duration && duration > 0 &&
						<Text style={styles.duration}>
							{formatTime(duration)}
						</Text>
					}
				</View>
				<View style={{ flex: 1 }}>
					<Text style={styles.title} numberOfLines={2}>{title}</Text>
					{description ? <Text style={styles.p} numberOfLines={2}>{description}</Text> : null}
				</View>
			</TouchableOpacity>

		)
	}

	render() {
		const { width, videos, onPress, ...otherProps } = this.props

		return (
			<ListView
				ref={(c) => { this.cardView = c }}
				horizontal
				dataSource={this.state.videos}
				renderRow={(video, sectionID, rowID) => this.renderVideoCard(video, rowID)}
				showsHorizontalScrollIndicator={false}
				{...otherProps}
			/>
		)
	}

}

VideosCardView.propTypes = {
	width: PropTypes.number.isRequired,
	videos: PropTypes.arrayOf(PropTypes.object).isRequired,
	onPress: PropTypes.func.isRequired,
}

// StyleSheet
const {
	size,
	typo: { p, pSemiBold },
} = ss

const styles = ss.create({
	card: {
		backgroundColor: 'white',
		marginHorizontal: size(5),
		padding: size(10),
	},
	preview: {
		height: size(90),
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'black',
	},
	playButtonContainer: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		height: size(40),
		width: size(40),
		borderRadius: size(40),
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: size(5),
	},
	duration: {
		...p,
		color: 'white',
		fontSize: size(12),
		position: 'absolute',
		right: 2,
		bottom: 2,
		padding: 2,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
	},
	title: {
		...pSemiBold,
		fontSize: size(12),
		marginTop: size(5),
		marginBottom: size(5),
	},
	p: {
		...p,
		fontSize: size(12),
	},
})

export default VideosCardView
