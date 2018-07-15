import React, { Component } from 'react'
import {
	ListView,
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ss from '../../styles'
import ProfileBioListItem from './profile-bio-list-item'

const getRandomId = () => Math.random().toString(36).substr(2, 10)


class ProfileBioListView extends Component {

	constructor(props) {
		super(props)

		const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

		this.state = {
			bio: dataSource.cloneWithRows(this.props.bio),
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!R.equals(this.props.bio, nextProps.bio)) {
			this.setState({
				bio: this.state.bio.cloneWithRows(nextProps.bio),
			})
		}
	}

	shouldComponentUpdate(nextProps) {
		return !R.equals(this.props.bio, nextProps.bio)
	}

	render() {
		const { style, type, bio, onEdit, ...otherProps } = this.props

		return (
			<View style={styles.container}>
				<ListView
					key={`${type}_${getRandomId()}`}
					style={style}
					showsVerticalScrollIndicator
					dataSource={this.state.bio}
					renderRow={(item, sectionID, rowID) => {
						const props = onEdit && { onEdit: () => onEdit(item) }
						return (
							<View style={{ flex: 1, overflow: 'hidden' }} key={`${type}_${item.member_bio_id}`}>
								{(rowID > 0) && <View style={styles.separator} />}
								<ProfileBioListItem bio={item} {...props} />
							</View>
						)
					}}
					{...otherProps}
				/>
			</View>
		)
	}

}

ProfileBioListView.propTypes = {
	type: PropTypes.string.isRequired,
	bio: PropTypes.arrayOf(PropTypes.object).isRequired,
}

// StyleSheet
const styles = ss.create({
	container: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
	},
	separator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
})


export default ProfileBioListView
