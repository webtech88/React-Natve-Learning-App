import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	Keyboard,
	KeyboardAvoidingView,
	View,
	ViewPropTypes,
	Text,
	TextInput,
	Image,
	TouchableOpacity,
	Animated,
	Platform,
} from 'react-native'

import { Actions as NavigationActions } from 'react-native-router-flux'

import HeaderIcon from './header-icon'
import TransText from './transtext'
import Icon from './icon'

import ss from '../../../styles'

const {
	size,
	typo: { p, pLight },
} = ss

class Search extends Component {
	state = {
		animOpacity: new Animated.Value(0),
		animTranslateY: new Animated.Value(-ss.constants.HEIGHT_NAV_BAR),
		animTransform: new Animated.Value(0.5),
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
			spring(this.state.animTranslateY, {
				toValue: 0,
				friction: 9,
				useNativeDriver: true,
			}),
			spring(this.state.animTransform, {
				toValue: 1,
				friction: 12,
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
			timing(this.state.animTranslateY, {
				toValue: -ss.constants.HEIGHT_NAV_BAR,
				duration: 150,
				useNativeDriver: true,
			}),
		]).start(onComplete)
	}

	closeModal = () => {
		Keyboard.dismiss()
		this.animateOut(NavigationActions.pop)
	}

	renderNoResults() {
		return (
			<View style={styles.viewSearch}>
				<HeaderIcon style={{ marginVertical: size(15) }}
					name="workbook-search"
				/>
				<View style={{ marginBottom: 20 }}>
					{this.props.query
					?
						<View>
							<TransText style={styles.p} transkey="YOUR_SEARCH_QUERY" />
							<TransText style={styles.p} transkey="NO_RESULT" />
						</View>
					:
						<View>
							<TransText style={styles.p} transkey="SEARCH_RESULT" />
							<TransText style={styles.p} transkey="WILL_BE_SHOWN_HERE" />
							<TransText style={styles.p} transkey="START_TYPING" />
						</View>
					}
				</View>
			</View>
		)
	}

	render() {
		const { query, onSearch, autoFocus, searchBarStyle, cancelButton, children } = this.props
		const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View
		return (
			<Animated.View
				style={[styles.modal, { opacity: this.state.animOpacity }]}
			>
				<Animated.View style={[
					styles.searchBar,
					searchBarStyle,
					{ transform: [{ translateY: this.state.animTranslateY }] }]}
				>
					<View style={styles.searchField}>
						<Icon name="search" size={14} />
						<TextInput
							style={styles.searchInput}
							underlineColorAndroid="transparent" // NOTE Android only
							keyboardAppearance="dark" // NOTE iOS only
							placeholder="Search"
							onChangeText={text => onSearch(text)}
							autoFocus={autoFocus}
							autoCapitalize="none"
							returnKeyType="search"
							value={query}
						/>
					</View>
					{cancelButton && <TouchableOpacity
						style={styles.searchCancel}
						activeOpacity={0.9}
						onPress={this.closeModal}
					>
						<TransText style={styles.searchCancelText} transkey="CANCEL" />
					</TouchableOpacity>}
				</Animated.View>
				<Wrapper behavior="padding" style={{ flex: 1 }}>
					{children || this.renderNoResults()}
				</Wrapper>
			</Animated.View>
		)
	}

}

Search.propTypes = {
	query: PropTypes.string.isRequired,
	onSearch: PropTypes.func.isRequired,
	autoFocus: PropTypes.bool,
	searchBarStyle:  ViewPropTypes.style,
	cancelButton: PropTypes.bool,
}

Search.defaultProps = {
	autoFocus: true,
	searchBarStyle: {},
	cancelButton: true,
}


// StyleSheet
const styles = ss.create({
	modal: {
		flex: 1,
		backgroundColor: 'white',
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		transform: [{
			translateY: -ss.constants.HEIGHT_NAV_BAR,
		}],
		height: ss.constants.HEIGHT_NAV_BAR,
		paddingTop: ss.constants.HEIGHT_STATUS_BAR,
		backgroundColor: '#F9F9F9',
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
		borderBottomWidth: 1,
	},
	searchField: {
		flex: 1,
		flexDirection: 'row',
		borderRadius: 5,
		alignItems: 'center',
		height: size(30),
		marginHorizontal: size(10),
		paddingVertical: 1,
		paddingHorizontal: 10,
		backgroundColor: 'white',
		borderColor: 'rgba(0, 0, 0, 0.1)',
		borderWidth: 1,
	},
	searchInput: {
		...p,
		fontSize: size(14),
		flex: 1,
		marginHorizontal: size(10),
		backgroundColor: 'transparent',
		android: {
			paddingTop: size(5),
			paddingBottom: size(3),
		},
	},
	searchCancel: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		marginRight: size(15),
		marginLeft: size(5),
	},
	searchCancelText: {
		...p,
		fontSize: size(17),
		textAlign: 'center',
		color: ss.constants.COLOR_HEADING,
	},
	viewSearch: {
		// backgroundColor: 'green', // NOTE testing flexbox
		flex: 1,
		justifyContent: 'center',
		paddingBottom: size(10),
	},
	p: {
		...pLight,
		fontSize: size(18),
		textAlign: 'center',
	},
})


export default Search
