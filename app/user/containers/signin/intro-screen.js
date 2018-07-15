import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	View,
	Image,
	Text,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux'

import UserActions from '../../actions/creator'
import common from '../../../common'
import FooterSignIn from '../../components/sign-in-footer'
import ss from '../../../styles'

const { Button, Loading, TransText } = common.components.core


class IntroScreen extends Component {

	handleSocialLoginAttempt = (service) => {
		if (service === 'facebook') {
			this.props.loginWithFacebook()
		}
	}

	render() {
		const {
			userId,
			attemptingLoginWithEmail,
			attemptingLoginWithFacebook,
			navigateToSignIn,
			navigateToSignUpWithEmail,
		} = this.props
		const attempting = (attemptingLoginWithEmail || attemptingLoginWithFacebook)

		if (userId) {
			// TODO BUG RNRF bug on Switch so... need to show loading here
			return <Loading />
		}

		return (
			<View style={styles.wrapper}>
				<View style={styles.viewLogo}>
					<Image style={styles.logo} resizeMode="contain" source={ss.images.logo} />
				</View>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<View style={styles.viewSocial}>
						<TransText style={styles.p} transkey="Sign Up with your social account"/>
						{/* <Button
							style={{marginVertical: size(20)}}
							iconSize={20}
							color="#FE4A34"
							label="Sign up with Google"
							iconName="google-plus"
							onPress={() => this._handleSocialLoginAttempt('Google')}
						/>
						<Button
							style={{marginBottom: size(20)}}
							color="#00ABD6"
							label="Sign up with Twitter"
							iconName="twitter"
							onPress={() => this._handleSocialLoginAttempt('Twitter')}
						/> */}
						<Button
							style={{ marginVertical: size(20) }}
							color="#27599A"
							label="Sign up with Facebook"
							iconName="facebook"
							onPress={() => this.handleSocialLoginAttempt('facebook')}
							isLoading={attemptingLoginWithFacebook}
							disabled={attempting}
						/>
					</View>
					<View style={styles.viewSignUp}>
						<View style={styles.hr}>
							<View style={styles.hrBorder} />
							<Text style={[styles.p, styles.hrParagraph]}>Or</Text>
							<View style={styles.hrBorder} />
						</View>
						<Button
							style={{ marginBottom: size(20) }}
							type="outline"
							label="Sign up with Email"
							onPress={navigateToSignUpWithEmail}
							disabled={attempting}
						/>
					</View>
				</View>
				<FooterSignIn disabled={attempting} onPress={navigateToSignIn} />
			</View>
		)
	}
}

IntroScreen.propTypes = {
	userId: PropTypes.number,
	attemptingLoginWithEmail: PropTypes.bool.isRequired,
	attemptingLoginWithFacebook: PropTypes.bool.isRequired,
	loginWithFacebook: PropTypes.func.isRequired,
	navigateToSignIn: PropTypes.func.isRequired,
	navigateToSignUpWithEmail: PropTypes.func.isRequired,
}

IntroScreen.defaultProps = {
	userId: null,
}

// StyleSheet
const {
	size,
	base: { wrapper, hr, hrBorder, hrParagraph },
	typo: { p },
} = ss

const styles = ss.create({
	wrapper: {
		...wrapper,
		// backgroundColor: 'gray', // NOTE testing flexbox
		justifyContent: 'space-between',
		paddingHorizontal: size(30),
	},
	viewLogo: {
		// backgroundColor: 'green', // NOTE testing flexbox
		paddingTop: size(50),
		alignItems: 'center',
	},
	viewSocial: {
		// backgroundColor: 'blue', // NOTE testing flexbox
	},
	viewSignUp: {
		// backgroundColor: 'red', // NOTE testing flexbox
	},
	logo: {
		width: 273,
		height: 44,
	},
	p: {
		...p,
		textAlign: 'center',
	},
	hr,
	hrBorder,
	hrParagraph,
})


// Redux mappings
const mapStateToProps = state => ({
	userId: state.user.data && state.user.data.member_id,
	attemptingLoginWithEmail: state.auth.attemptingLoginWithEmail,
	attemptingLoginWithFacebook: state.auth.attemptingLoginWithFacebook,
})

const mapDispatchToProps = dispatch => ({
	loginWithFacebook: () => dispatch(UserActions.loginWithFacebookAttempt()),
	navigateToSignIn: () => NavigationActions.SignIn(),
	navigateToSignUpWithEmail: () => NavigationActions.SignUpWithEmail(),
})

export default connect(mapStateToProps, mapDispatchToProps)(IntroScreen)
