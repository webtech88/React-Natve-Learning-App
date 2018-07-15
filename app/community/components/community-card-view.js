import React, { Component } from 'react'
import {
	FlatList,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import CommunityCardItem from './community-card-item'

import ss from '../../styles'

const MARGIN_VIEW = ss.size(15)
const MARGIN_CARD = ss.size(5)
const WIDTH_CARD = ((ss.constants.WIDTH_DEVICE - (MARGIN_VIEW * 2)) / 2) - (MARGIN_CARD * 2)

class CommunityCardView extends Component {

	shouldComponentUpdate(nextProps) {
		return !R.equals(this.props.contacts, nextProps.contacts) || this.props.animated !== nextProps.animated
	}

	render() {
		const { style, animated, contacts, onPress, onRefresh, refreshing, ...otherProps } = this.props
		return (
			<FlatList
				style={style}
				contentContainerStyle={styles.list}
				data={contacts}
				keyExtractor={item => item.member_id}
				shouldItemUpdate={(props, nextProps) => props.item !== nextProps.item}
				onRefresh={onRefresh}
				refreshing={refreshing}
				renderItem={({ item, index }) => {
					let animatedCard = false
					let animatedDelay = 0
					if (index <= 3 && animated) {
						animatedCard = true
						animatedDelay = 50 * index
					}
					return (
						<CommunityCardItem
							style={{ margin: MARGIN_CARD }}
							width={WIDTH_CARD}
							height={size(260)}
							connection={item}
							onPress={() => onPress(item)}
							animated={animatedCard}
							animatedDelay={animatedDelay}
						/>
					)
				}}
				scrollEventThrottle={16}
				{...otherProps}
			/>
		)
	}
}

CommunityCardView.propTypes = {
	animated: PropTypes.bool.isRequired,
	contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
	onPress: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired,
	refreshing: PropTypes.bool,
}

CommunityCardView.defaultProps = {
	animated: false,
	refreshing: false,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	list: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginHorizontal: MARGIN_VIEW,
		paddingVertical: MARGIN_VIEW,
		android: {
			marginTop: size(-5),
		},
	},
})

export default CommunityCardView
