import React, { Component } from 'react'
import {
	View,
	Platform,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import Swiper from 'react-native-swiper'

import ss from '../../styles'
import common from '../../common'

const { DropShadow, NoResults } = common.components.core

const WIDTH = ss.constants.WIDTH_DEVICE
const HEIGHT = ss.constants.HEIGHT_DEVICE
const SWIPER_MARGIN = ss.size(50)


class ProfileCardView extends Component {

	render() {
		const { width, height, children } = this.props

		if (!children) {
			return <NoResults message="No profile yet" />
		}
		const slides = R.reject(obj => !obj, children)

		return (
			<View style={styles.container}>
				<Swiper
					ref={(c) => { this.cardsSwiper = c }}
					style={styles.swiper}
					height={height}
					loop={false}
					directionalLockEnabled
					removeClippedSubviews={false}
					scrollEventThrottle={16}
					bounces
					showsPagination
					dotColor="rgba(0, 48, 87, 0.1)"
					activeDotColor={ss.constants.COLOR_CORE_PRIMARY}
					paginationStyle={{ height: SWIPER_MARGIN - size(10), top: 0 }}
				>
					{slides.map((ProfileCard, index) => (
						<View key={`ProfileCard_${index}`} style={styles.cardContainer}>
							<View style={styles.card}>
								{ProfileCard}
							</View>
							{Platform.OS === 'ios' &&
								<DropShadow width={width - size(50)} />
							}
						</View>
					))}
				</Swiper>
			</View>
		)
	}

}

ProfileCardView.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	children: PropTypes.node,
}

ProfileCardView.defaultProps = {
	width: WIDTH,
	height: HEIGHT,
	children: null,
}


// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-start',
		overflow: 'hidden',
	},
	swiper: {
		// backgroundColor: 'blue', // NOTE testing flexbox
		overflow: 'visible',
	},
	cardContainer: {
		flex: 1,
		paddingVertical: SWIPER_MARGIN,
		// backgroundColor: 'red', // NOTE testing flexbox
	},
	card: {
		flex: 1,
		marginHorizontal: size(10),
		backgroundColor: 'white',
		android: {
			elevation: 1,
		},
	},
	cardShadow: {
		backgroundColor: 'white',
		// backgroundColor: 'red', // NOTE testing flexbox
		zIndex: -1,
		height: 50,
		top: 0,
		marginTop: -(51),
		alignSelf: 'center',
		shadowColor: 'black',
		shadowOffset: {
			height: 5,
			width: 0,
		},
		shadowOpacity: 0.2,
		shadowRadius: 15,
		elevation: 5,
	},
})

export default ProfileCardView
