import React, { Component } from 'react'
import {
	View,
	findNodeHandle,
} from 'react-native'

import common from '../../../common'

import ActivityFormField from './activity-form-field'
import ActivityHeader from './activity-header'
import ActivityDescription from './activity-description'
import ActivityButtons from './activity-buttons'
import ActivityImage from './activity-image'

import ss from '../../../styles'

const { Form } = common.components.form

class FreeTextActivity extends Component {
	state = {
		activeHandle: null,
	}

	componentWillReceiveProps(nextProps) {
		const { activeField } = nextProps

		// set active field handle for scroll
		if (this.props.activeField !== activeField) {
			const handle = findNodeHandle(this.refs[activeField])
			if (handle) {
				this.setState({ activeHandle: handle })
			}
		}
	}


	render() {
		const {
			activity,
			canModify,
			canSubmit,
			saving,
			onSave,
			submitting,
			onSubmit,
		} = this.props
		const { activeHandle } = this.state

		return (
			<Form
				style={styles.container}
				behaviour="scroll"
				activeHandle={activeHandle}
			>
				<ActivityHeader activity={activity} />
				<View style={styles.contentContainer}>
					<ActivityImage />
					<ActivityDescription description={activity.content.activityText} style={styles.description} />
				</View>
				{activity.content.promptTitles.map((label, i) =>	(
					<ActivityFormField
						key={i}
						ref={`input${i}`}
						index={i}
						label={label}
						style={[styles.textFieldWrapper, styles.contentContainer]}
						editable={canModify || !saving || !submitting}
					/>
				))}
				<View style={styles.contentContainer}>
					<ActivityButtons
						canSubmit={canSubmit}
						saving={saving}
						onSavePress={onSave}
						submitting={submitting}
						onSubmitPress={onSubmit}
					/>
				</View>
			</Form>
		)
	}

}

// StyleSheet
const {
	size,
} = ss

const styles = ss.create({
	container: {
	},
	description: {
		paddingTop: size(22),
	},
	textFieldWrapper: {
		paddingBottom: size(5),
	},
	contentContainer: {
		paddingHorizontal: size(15),
	},
})

export default FreeTextActivity
