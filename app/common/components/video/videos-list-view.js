import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ListView,
	View,
	ViewPropTypes,
} from 'react-native'

import ss from '../../../styles'
import VideosListItem from './videos-list-item'


class VideosListView extends Component {

	constructor(props) {
		super(props)

		const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

		this.state = {
			videos: dataSource.cloneWithRows(this.props.videos),
		}
	}

	componentWillReceiveProps(newProps) {
		if (this.props.videos !== newProps.videos) {
			this.setState({
				videos: this.state.videos.cloneWithRows(newProps.videos),
			})
		}
	}

	render() {
		const { style, videos, onPress, ...otherProps } = this.props

		return (
			<ListView
				style={style}
				contentContainerStyle={styles.list}
				showsVerticalScrollIndicator
				dataSource={this.state.videos}
				renderRow={(video, sectionID, rowID) => (
					<View style={{ flex: 1, overflow: 'hidden' }} key={`Video_${video.media_id}`}>
						{(rowID > 0) && <View style={styles.separator} />}
						<VideosListItem video={video} onPress={() => onPress(video)} />
					</View>
				)}
				{...otherProps}
			/>
		)
	}

}

VideosListView.propTypes = {
	style: ViewPropTypes.style,
	videos: PropTypes.arrayOf(PropTypes.object).isRequired,
	onPress: PropTypes.func.isRequired,
}

VideosListView.defaultProps = {
	style: {},
}

// StyleSheet

const styles = ss.create({
	list: {
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	separator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
})

export default VideosListView
