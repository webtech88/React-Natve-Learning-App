import React from 'react'
import { 
	View,
	Text,
} from 'react-native'

import ss from '../../../styles'
import common from '../../../common'

const { TransText } = common.components.core

const SettingsRegistrationCodesScreen = () => {
	// TODO: User registration code
	const dashes = []
	for (let i = 0; i < 30; i += 1) {
		dashes.push(<View key={`dash ${i}`} style={styles.dash} />)
	}

	const ticketCircles = []
	for (let j = 0; j < 5; j += 1) {
		ticketCircles.push(<View key={`circle ${j}`} style={styles.circle} />)
	}

	return (
		<View style={styles.wrapper}>
			<TransText style={styles.pLight} transkey="" />
			<View style={styles.ticketContainer}>
				<View style={styles.ticket}>
					<Text style={styles.h1}>
						HH-65-J8-KK-7Y
					</Text>
					<View style={styles.dashedLine}>
						{dashes}
					</View>
					<TransText 
						style={[styles.p, { marginBottom: size(5) }]} 
						transkeys={['Qualification', ': ', 'Health and social care traineeship']} 
						tindices={[0]}	
					/>
					<TransText 
						style={styles.p} 
						transkeys={['Activated', ': ', '10 June 2016']} 
						tindices={[0]}	
					/>
					<View style={styles.ticketEdge}>
						{ticketCircles}
					</View>
				</View>
			</View>
		</View>
	)
}

// StyleSheet
const {
	size,
	base: { wrapper },
	typo: { h1, p, pLight },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		paddingHorizontal: size(20),
		paddingVertical: size(20),
	},
	h1: {
		...h1,
	},
	p: {
		...p,
		backgroundColor: 'transparent',
		color: ss.constants.COLOR_CORE_PRIMARY,
		fontSize: size(12),
	},
	pLight: {
		...pLight,
		fontSize: size(18),
		marginVertical: size(20),
	},
	ticketContainer: {
		position: 'relative',
	},
	ticket: {
		backgroundColor: ss.constants.COLOR_CORE_SECONDARY,
		borderRadius: size(5),
		justifyContent: 'space-around',
		padding: size(20),
	},
	dashedLine: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginVertical: size(20),
	},
	dash: {
		backgroundColor: ss.constants.COLOR_CORE_PRIMARY,
		height: 1,
		width: size(6),
		opacity: 0.3,
	},
	ticketEdge: {
		justifyContent: 'space-around',
		paddingVertical: size(5),
		position: 'absolute',
		top: 0,
		right: -size(15),
		bottom: 0,
	},
	circle: {
		backgroundColor: 'white',
		borderRadius: size(20),
		height: size(20),
		width: size(20),
	},
})

export default SettingsRegistrationCodesScreen
