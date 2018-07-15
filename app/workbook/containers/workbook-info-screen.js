import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	ScrollView,
	View,
	Text,
	Animated,
	Platform,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import ss from '../../styles'
import common from '../../common'

const {
	size,
	base: { wrapper },
	typo: { p, h1, h2 },
} = ss

const { ProgressBadge } = common.components.workbook
const { TextFadeSvg } = common.components.svg
const { Button, DraftRenderer, TransText } = common.components.core
const { BackButton } = common.components.navigation


class WorkbookInfoScreen extends Component {

	state = {
		animOpacity: new Animated.Value(0),
		animTransform: new Animated.Value(ss.constants.WIDTH_DEVICE),
	}

	componentDidMount() {
		this.animateIn()
	}

	animateIn = () => {
		const parallel = Animated.parallel
		const spring = Animated.spring

		parallel([
			spring(this.state.animOpacity, {
				toValue: 1,
				friction: 9,
				useNativeDriver: true,
			}),
			spring(this.state.animTransform, {
				toValue: 0,
				friction: 9,
				useNativeDriver: true,
			}),
		]).start()
	}

	animateOut = (onComplete) => {
		const parallel = Animated.parallel
		const timing = Animated.timing

		parallel([
			timing(this.state.animOpacity, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}),
			timing(this.state.animTransform, {
				toValue: ss.constants.WIDTH_DEVICE,
				duration: 250,
				useNativeDriver: true,
			}),
		]).start(onComplete)
	}

	closeModal = () => {
		this.animateOut(NavigationActions.pop)
	}

	render() {
		const { userId, workbook } = this.props

		return (
			<View style={styles.modal}>
				<Animated.View
					style={{
						flex: 1,
						opacity: this.state.animOpacity,
						transform: [{ translateX: this.state.animTransform }],
					}}
				>
					<BackButton name="back" onPress={this.closeModal} style={{ top: 0 }} />
					<TextFadeSvg position="top" style={Platform.OS === 'android' ? { marginTop: size(10) } : {}} />
					<ScrollView
						style={styles.scroll}
						contentContainerStyle={styles.scrollContainer}
						directionalLockEnabled
					>
						<View style={styles.header}>
							<Text style={styles.h1}>{workbook.title}</Text>
							<View>
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
						</View>
						<ProgressBadge
							style={{
								alignSelf: 'center',
								marginTop: -size(30),
								shadowOffset: {
									height: 0,
									width: 0,
								},
								shadowRadius: 1,
								elevation: 1,
							}}
							dimensions={size(60)}
							percentage={workbook.progress_percentage}
							animated
						/>
						{workbook.overview &&
							<View style={styles.info}>
								<DraftRenderer content={workbook.overview} />
							</View>
						}
					</ScrollView>
					<TextFadeSvg />
					<Button
						label="Open Workbook"
						borderRadius={0}
						onPress={() => NavigationActions.Workbook({ memberId: userId, workbookId: workbook.workbook_id })}
					/>
				</Animated.View>
			</View>
		)
	}

}

WorkbookInfoScreen.propTypes = {
	userId: PropTypes.number.isRequired,
	workbook: PropTypes.object.isRequired,
}

// StyleSheet
const styles = ss.create({
	modal: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'white',
		ios: {
			paddingTop: size(20),
		},
		android: {
			paddingTop: size(10),
		},
	},
	scroll: {
		// backgroundColor: 'pink', // NOTE testing flexbox
	},
	scrollContainer: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingTop: size(30),
		paddingBottom: size(10),
	},
	header: {
		alignItems: 'center',
		paddingHorizontal: size(20),
		paddingBottom: size(50),
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
	h1: {
		...h1,
		textAlign: 'center',
		marginBottom: size(15),
	},
	info: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		paddingTop: size(30),
		paddingBottom: size(20),
		paddingHorizontal: size(20),
	},
	h2: {
		...h2,
		marginBottom: size(10),
	},
	p: {
		...p,
		marginBottom: size(20),
	},
	pSmall: {
		...p,
		fontSize: size(12),
		textAlign: 'center',
	},
})

// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data.member_id,
})

export default connect(mapStateToProps)(WorkbookInfoScreen)
