import React, { Component } from 'react'
import {
	ListView,
	View,
	Animated,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ss from '../../../styles'
import PhotosCardItem from './photos-card-item'

const SCREEN_GUTTER = ss.size(15)
const PHOTO_GUTTER = Math.floor(SCREEN_GUTTER / 3)

const getRandomId = () => Math.random().toString(36).substr(2, 10)

const getRandomInt = (min, max) => {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * ((max - min) + 1)) + min
}


class PhotosCardView extends Component {

	constructor(props) {
		super(props)

		const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

		this.state = {
			photos: dataSource.cloneWithRows(this.props.photos),
			width: 0,
			height: 0,
			animatedValue: new Animated.Value(0),
		}
	}

	componentDidMount() {
		if (this.props.animated && this.props.photos && this.props.photos.length >= 3) {
			this.animate()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!R.equals(this.props.photos, nextProps.photos)) {
			this.setState({
				photos: this.state.photos.cloneWithRows(nextProps.photos),
			})
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !R.equals(this.props.photos, nextProps.photos) || !R.equals(this.state, nextState)
	}

	componentWillUnmount() {
		this.state.animatedValue.stopAnimation()
	}

	animate = () => {
		Animated.sequence([
			Animated.delay(250),
			Animated.spring(this.state.animatedValue, {
				toValue: 1,
				friction: 12,
				useNativeDriver: true,
			}),
		]).start()
	}

	render() {
		const { photos, onPress, ...otherProps } = this.props
		const { width, height } = this.state
		let rendered = null

		if (width && height) {
			const containerWidth = width - (SCREEN_GUTTER * 2)
			const small = Math.floor((containerWidth / 3) - (PHOTO_GUTTER * 2))
			// const big = (2 * small) + (PHOTO_GUTTER * 2)

			rendered = (
				<ListView
					key={`Photos_${getRandomId()}`}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator
					dataSource={this.state.photos}
					renderRow={(photo, sectionID, rowID) => {
						if (photos.length >= 3) {
							// TODO release 2
							// const index = Number(rowID)
							//
							// if (index === 2) {
							// 	positioned absolutely as a workaround for flex-wrap
							// 	return (
							// 		<View style={[styles.floatingCard, { top: (big + ss.size(20)) - small }]}>
							// 			<PhotosCardItem
							// 				key={`Photo_${photo.media_id}`}
							// 				photo={photo}
							// 				size={small}
							// 				gutter={PHOTO_GUTTER}
							// 				onPress={() => onPress(photo)}
							// 			/>
							// 		</View>
							// 	)
							// }
						}
						let cardStyle

						if (this.props.animated && this.props.photos && this.props.photos.length >= 3) {
							const translateX = this.state.animatedValue.interpolate({
								inputRange: [0, 1],
								outputRange: [getRandomInt(width, -width), 0],
								extrapolate: 'clamp',
							})

							const translateY = this.state.animatedValue.interpolate({
								inputRange: [0, 1],
								outputRange: [getRandomInt(height, -height), 0],
								extrapolate: 'clamp',
							})

							const scale = this.state.animatedValue.interpolate({
								inputRange: [0, 1],
								outputRange: [parseFloat(Number(Math.random()).toFixed(1)), 1],
								extrapolate: 'clamp',
							})

							cardStyle = {
								transform: [{ translateY }, { translateX }, { scale }],
							}
						}

						return (
							<PhotosCardItem
								style={cardStyle}
								key={`PhotosCardItem_${photo.media_id}`}
								photo={photo}
								// size={index === 0 ? big : small}
								size={small}
								gutter={PHOTO_GUTTER}
								onPress={() => onPress(photo)}
							/>
						)
					}}
					{...otherProps}
				/>
			)
		}

		return (
			<View
				style={styles.container}
				onLayout={e => this.setState({
					width: e.nativeEvent.layout.width,
					height: e.nativeEvent.layout.height,
				})}
			>
				{rendered}
			</View>
		)
	}
}

PhotosCardView.propTypes = {
	animated: PropTypes.bool,
	photos: PropTypes.arrayOf(PropTypes.object).isRequired,
	onPress: PropTypes.func.isRequired,
}

PhotosCardView.defaultProps = {
	animated: false,
}


// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		// backgroundColor: 'gray', // NOTE testing flexbox
		flex: 1,
	},
	list: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		padding: SCREEN_GUTTER,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
	},
	floatingCard: {
		position: 'absolute',
		right: size(20),
	},
})

export default PhotosCardView
