import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	View,
} from 'react-native'

import ss from '../../../styles'
import TransText from '../core/transtext'

class NavBarTitleText extends Component {

	render() {
		// StyleSheet
		const {
			size,
			navBar: { navTitleWrapper, navTitle },
		} = ss

		const titleStyle = this.props.titleStyle || {}

		this.styles = ss.create({
			navTitleWrapper,
			navTitle: {
				...navTitle,
				...titleStyle,
			},
		})
		const { title } = this.props

		return (
			<View style={this.styles.navTitleWrapper}>
				<TransText style={this.styles.navTitle} transkey={title} />
			</View>
		)
	}

}


NavBarTitleText.propTypes = {
	title: PropTypes.string,
	titleStyle: PropTypes.object,
}

const mapStateToProps = state => ({
	locale: state.app.locale,
})

export default connect(mapStateToProps, null)(NavBarTitleText)
