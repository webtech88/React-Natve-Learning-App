import React, { Component } from 'react'
import {
	View,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'

import ss from '../../../styles'
import common from '../../../common'

import ProfileReferencesListView from '../profile-references-list-view'
import ProfileCardHeader from './profile-card-header'
import ProfileCardFooter from './profile-card-footer'

const { Loading, NoResults, Button } = common.components.core


class ProfileCardReferences extends Component {

	shouldComponentUpdate(nextProps) {
		const { references, gettingReferences, canAdd } = this.props

		if (!R.equals(references, nextProps.references)) {
			return true
		}

		if (gettingReferences !== nextProps.gettingReferences) {
			return true
		}

		if (canAdd !== nextProps.canAdd) {
			return true
		}

		return false
	}

	render() {
		const {
			references,
			gettingReferences,
			canAdd,
			onAdd,
			onShowAll,
		} = this.props
		let contents = null

		if (references && references.length) {
			// has references
			contents = (
				<View style={{ flex: 1 }}>
					<ProfileReferencesListView references={references} />
					<ProfileCardFooter onPress={onShowAll} />
				</View>
			)
		} else if (gettingReferences) {
			// show loading while getting references
			contents = <Loading style={styles.loading} />
		} else {
			// no references
			contents = (
				<View style={styles.noResults}>
					<NoResults
						name="references"
						size={ss.size(82)}
						iconStyle={{ marginBottom: size(30), marginLeft: size(15) }}
						message="No references yet"
					/>
					{canAdd && onAdd && <Button
						label="Add"
						disabled={false}
						isLoading={false}
						onPress={onAdd}
					/>}
				</View>
			)
		}

		return (
			<View style={{ flex: 1 }}>
				<ProfileCardHeader title="References" onPress={onAdd} />
				<View style={{ flex: 1 }}>
					{contents}
				</View>
			</View>
		)
	}

}

ProfileCardReferences.propTypes = {
	references: PropTypes.arrayOf(PropTypes.object),
	gettingReferences: PropTypes.bool.isRequired,
	canAdd: PropTypes.bool,
	onAdd: PropTypes.func,
	onShowAll: PropTypes.func,
}

ProfileCardReferences.defaultProps = {
	references: null,
	canAdd: false,
	onAdd: null,
	onShowAll: null,
}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	noResults: {
		flex: 1,
		padding: size(20),
	},
})

export default ProfileCardReferences
