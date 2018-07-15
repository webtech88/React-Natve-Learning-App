import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { ProgressBadge, LevelBadge } = common.components.workbook
const { TransText } = common.components.core


const ShowreelQualification = ({ title, level, progress }) => (
	<View style={styles.container}>
		<View style={styles.qualification}>
			{progress !== null &&
				<ProgressBadge
					style={{ shadowOpacity: 0, marginRight: size(10) }}
					dimensions={size(50)}
					percentage={progress}
					colorPrimary={progress >= 100 ? 'transparent' : 'white'}
					colorSecondary={progress >= 100 ? 'white' : 'transparent'}
					colorStroke={'rgba(255, 255, 255, .05)'}
					colorText="white"
					animated
				/>
			}
			<LevelBadge level={level} />
		</View>
		<TransText style={styles.p} transkey={title} />
	</View>
)

ShowreelQualification.propTypes = {
	title: PropTypes.string.isRequired,
	level: PropTypes.number.isRequired,
	progress: PropTypes.number,
}

ShowreelQualification.defaultProps = {
	progress: null,
}


// StyleSheet
const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	container: {
		// backgroundColor: 'rgba(0, 0, 0, .1)', // NOTE testing flexbox
		alignItems: 'center',
	},
	qualification: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: size(15),
	},
	p: {
		...p,
		color: 'white',
		textAlign: 'center',
	},
})

export default ShowreelQualification
