import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
	Text,
} from 'react-native'

import ss from '../../../styles'
import TransText from '../core/transtext'

class Label extends Component {

	render() {
		const { label, labelColor, required, error, numberOfLines } = this.props
		return (
			<TransText 
				ref={(c) => { this.label = c }} 
				numberOfLines={numberOfLines} 
				style={styles.label} 
				transkey={!error && required ? ', Required' : null}
				innertop={<TransText style={[styles.dirty, (error && styles.error), (labelColor && { color: labelColor, opacity: 1 })] } transkey={error || label} />}
			/>				
		)
	}

}

Label.propTypes = {
	label: PropTypes.string.isRequired,
	required: PropTypes.bool.isRequired,
	error: PropTypes.string.isRequired,
	labelColor: PropTypes.string,
	numberOfLines: PropTypes.any,
}

Label.defaultProps = {
	required: false,
	error: '',
	labelColor: '#000000',
	numberOfLines: 1,
}


// StyleSheet

const {
	size,
	typo: { p },
} = ss

const styles = ss.create({
	label: {
		...p,
		fontSize: size(15),
	},
	dirty: {
		opacity: 0.7,
	},
	error: {
		color: ss.constants.COLOR_ACCENT_RED,
		opacity: 1,
	},
})

export default Label
