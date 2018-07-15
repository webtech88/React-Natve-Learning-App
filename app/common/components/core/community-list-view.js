import React, { Component } from 'react'
import {
	FlatList,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import CommunityListItem from './community-list-item'


class CommunityListView extends Component {

	shouldComponentUpdate(nextProps) {
		return !R.equals(this.props.contacts, nextProps.contacts) || this.props.animated !== nextProps.animated
	}

	render() {
		const { style, animated, contacts, onPress, onRefresh, refreshing, ...otherProps } = this.props
		// contacts = [{
		// 	cloudinary_file_id: null,
		// 	screen_name: 'Testing Screen',
		// 	gender: 2,
		// 	online: true,
		// 	current_qualification: {
		// 		short_title: 'This is qualification',
		// 	},
		// }]
		// animated = true
		// onRefresh = false
		// onPress = (item) => {}
		// refreshing = false

		return (
			<FlatList
				style={style}
				data={contacts}
				keyExtractor={item => item.member_id}
				shouldItemUpdate={(props, nextProps) => props.item !== nextProps.item}
				onRefresh={onRefresh}
				refreshing={refreshing}
				renderItem={({ item, index }) => {
					const animatedDelay = 25 * index
					return (
						<CommunityListItem
							connection={item}
							onPress={() => onPress(item)}
							animated={animated}
							animatedDelay={animatedDelay}
						/>
					)
				}}
				{...otherProps}
			/>
		)
	}
}

CommunityListView.propTypes = {
	animated: PropTypes.bool.isRequired,
	refreshing: PropTypes.bool,
	contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
	onPress: PropTypes.func.isRequired,
	onRefresh: PropTypes.func.isRequired,
}

CommunityListView.defaultProps = {
	refreshing: false,
}


export default CommunityListView
