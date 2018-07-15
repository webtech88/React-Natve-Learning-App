import React, { Component } from 'react'
import {
	ListView,
	View,
} from 'react-native'

import R from 'ramda'

import ss from '../../styles'
import ProfileReferencesListItem from './profile-references-list-item'


class ProfileReferencesListView extends Component {

	constructor(props) {
		super(props)

		const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })

		this.state = {
			references: dataSource.cloneWithRows(this.props.references),
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!R.equals(this.props.references, nextProps.references)) {
			this.setState({
				references: this.state.references.cloneWithRows(nextProps.references),
			})
		}
	}

	shouldComponentUpdate(nextProps) {
		return !R.equals(this.props.references, nextProps.references)
	}

	render() {
		const { references, onUpdate, ...otherProps } = this.props

		return (
			<View style={styles.container}>
				<ListView
					showsVerticalScrollIndicator
					dataSource={this.state.references}
					renderRow={(item, sectionID, rowID) => (
						<View style={{ flex: 1, overflow: 'hidden' }} key={`Reference_${item.reference_id}`}>
							{(rowID > 0) && <View style={styles.separator} />}
							<ProfileReferencesListItem
								reference={item}
								onUpdate={onUpdate ? () => onUpdate(item.reference_id, (item.status ? 0 : 1)) : null}
							/>
						</View>
					)}
					{...otherProps}
				/>
			</View>
		)
	}

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

export default ProfileReferencesListView
