import React, { Component } from 'react'
import {
	ListView,
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ProfileBadgesListItem from './profile-badges-list-item'
import ss from '../../styles'

const getRandomId = () => Math.random().toString(36).substr(2, 10)


class ProfileBadgesListView extends Component {

	constructor(props) {
		super(props)

		const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

		this.state = {
			badges: dataSource.cloneWithRows(this.props.badges),
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!R.equals(this.props.badges, nextProps.badges)) {
			this.setState({
				badges: this.state.badges.cloneWithRows(nextProps.badges),
			})
		}
	}

	shouldComponentUpdate(nextProps) {
		return !R.equals(this.props.badges, nextProps.badges)
	}

	render() {
		const { badges } = this.state

		return (
			<View style={styles.container}>
				<ListView
					key={`Badges_${getRandomId()}`}
					style={styles.listView}
					showsVerticalScrollIndicator={false}
					dataSource={badges}
					renderRow={(badge, sectionID, rowID) => (
						<View style={{ flex: 1, overflow: 'hidden' }} key={`Badge_${rowID}`}>
							{(rowID > 0) && <View style={styles.separator} />}
							<ProfileBadgesListItem badge={badge} />
						</View>
					)}
				/>
			</View>
		)
	}
}

ProfileBadgesListView.propTypes = {
	badges: PropTypes.arrayOf(PropTypes.object).isRequired,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
		flex: 1,
	},
	separator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
})

export default ProfileBadgesListView
