import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableHighlight,
} from 'react-native'

import PropTypes from 'prop-types'

import R from 'ramda'
import moment from 'moment-timezone'
import common from '../../common'
import WorkbookCover from './workbook-cover'

import ss from '../../styles'

const { ProgressBadge } = common.components.workbook
const { TransText } = common.components.core

class IqaWorkbookListItem extends Component {

	render() {
		const { workbook, onPress } = this.props
		let createdBy = []
		let modifiedBy = []

		// Created by
		if (workbook.created) {
			createdBy = ['Created']

			if (
				workbook.created_by &&
				R.has('screen_name', workbook.created_by) &&
				!R.isEmpty(workbook.created_by.screen_name)
			) {
				createdBy = ['Created by']
				createdBy.push(': ')
				createdBy.push(workbook.created_by.screen_name)
			}

			createdBy.push(' ')
			createdBy.push(moment(workbook.created).tz('Europe/London').format('DD/MM/YYYY'))
		}

		// Modified by
		if (workbook.modified) {
			modifiedBy = ['Modified']

			if (
				workbook.modified_by &&
				R.has('screen_name', workbook.modified_by) &&
				!R.isEmpty(workbook.modified_by.screen_name)
			) {
				modifiedBy = ['Modified by']
				modifiedBy.push(': ')
				modifiedBy.push(workbook.modified_by.screen_name)
			}

			modifiedBy.push(' ')
			modifiedBy.push(moment(workbook.modified).tz('Europe/London').format('DD/MM/YYYY'))
		}

		return (
			<TouchableHighlight
				underlayColor="rgba(0, 0, 0, 0.02)"
				activeOpacity={0.9}
				onPress={() => onPress(workbook.unit_id, workbook.workbook_id)}
			>
				<View style={styles.workbook}>
					<View style={styles.cover}>
						<WorkbookCover
							width={size(80)}
							height={size(110)}
							workbook={workbook}
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Text style={styles.h2}>{workbook.title}</Text>
						<TransText 
							style={styles.p}
							transkeys={['Unit', ': ', '#' + workbook.unit_id, workbook.reference]}
							tindices={[0]}
						/>
						<TransText 
							style={styles.p}
							transkeys={['Workbook', ': ', '#' + workbook.workbook_id, workbook.workbook_reference]}
							tindices={[0]}
						/>
						<TransText 
							style={styles.pSmall}
							transkeys={createdBy}
							tindices={[0]}
						/>
						<TransText 
							style={styles.pSmall}
							transkeys={modifiedBy}
							tindices={[0]}
						/>
					</View>
				</View>
			</TouchableHighlight>
		)
	}

}

IqaWorkbookListItem.propTypes = {
	workbook: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired,
}


// StyleSheet
const {
	size,
	typo: { h2, p, pLight },
} = ss

const styles = ss.create({
	workbook: {
		// backgroundColor: 'green', // NOTE testing flexbox
		flexDirection: 'row',
		padding: size(10),
	},
	cover: {
		marginRight: size(15),
	},
	h2: {
		...h2,
		marginBottom: size(5),
	},
	p: {
		...pLight,
	},
	pSmall: {
		...p,
		fontSize: size(11),
		fontStyle: 'italic',
		color: ss.constants.COLOR_CORE_BRAND,
		opacity: 0.8,
	},
})


export default IqaWorkbookListItem
