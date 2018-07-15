import PropTypes from 'prop-types'
import React from 'react'
import {
	View,
	Text,
	TouchableHighlight,
} from 'react-native'

import common from '../../common'
import WorkbookCover from './workbook-cover'

import ss from '../../styles'

const { ProgressBadge } = common.components.workbook
const { TransText } = common.components.core

const WorkbookListItem = ({
	animated,
	workbook,
	onPress,
}) => (
	<TouchableHighlight
		underlayColor="transparent"
		activeOpacity={0.9}
		onPress={() => onPress(workbook)}
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
				<Text style={styles.p}>{workbook.title}</Text>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flex: 1 }}>
						{workbook.guided_learning_hours
							? <TransText
								style={styles.pSmall}
								transkeys={['GUIDED_LEARNING_HOURS', ' ', workbook.guided_learning_hours]}
								tindices={[0]}
							/>
							: null
						}
						<TransText
							style={[styles.pSmall, { color: ss.constants.COLOR_LINK }]}
							transkeys={['CREDIT_VALUE', ' ', workbook.credit_value || 0]}
							tindices={[0]}
						/>
					</View>
					<ProgressBadge
						style={{
							shadowOffset: {
								height: 0,
								width: 0,
							},
							shadowRadius: 1,
							marginLeft: size(10),
						}}
						dimensions={size(44)}
						percentage={workbook.progress_percentage}
						animated={animated}
					/>
				</View>
			</View>
		</View>
	</TouchableHighlight>
	)

WorkbookListItem.propTypes = {
	animated: PropTypes.bool,
	workbook: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired,
}

WorkbookListItem.defaultProps = {
	animated: true,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	workbook: {
		backgroundColor: 'white',
		// backgroundColor: 'green', // NOTE testing flexbox
		flexDirection: 'row',
		padding: size(20),
	},
	cover: {
		marginRight: size(15),
	},
	p: {
		...p,
		marginBottom: size(20),
	},
	pSmall: {
		...p,
		fontSize: size(12),
	},
})


export default WorkbookListItem
