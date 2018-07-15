import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { View } from 'react-native'

import redraft from 'redraft'

import ss from '../../../styles'
import TransText from './transtext'

class DraftRenderer extends Component {

	render() {
		const { content } = this.props

		if (content) {
			const renderers = {
				inline: {
					heading: (children, { key }) => <TransText key={`Heading_${key}`} selectable style={styles.bold} transkey={children} />,
					bold: (children, { key }) => <TransText key={`Bold_${key}`} selectable style={styles.bold} transkey={children} />,
					italic: (children, { key }) => <TransText key={`Italic_${key}`} selectable style={{ fontStyle: 'italic' }} transkey={children} />,
					// highlight: (children, { key }) => <TransText key={`Highlight_${key}`} selectable style={{ backgroundColor: 'yellow' }} transkey={children} />
				},
				blocks: {
					unstyled: (children, { key }) => children.map(child => <TransText style={styles.p} transkey={child} />),
					'header-one': children => children.map((child, index) => null),
					'header-two': children => children.map(child => null),
					'header-three': children => children.map(child => null),
					'header-four': children => children.map(child => null), // NOTE not needed
					'header-five': children => children.map(child => null), // NOTE not needed
					'header-six': children => children.map(child => null), // NOTE not needed
					blockquote: children => children.map(child => null),
					'code-block': children => children.map(child => null), // NOTE not needed
					atomic: children => children.map(child => null), // NOTE be careful...
					'unordered-list-item': children => children.map(child => null), // NOTE not needed
					'ordered-list-item': children => children.map(child => null), // NOTE not needed
				},
			}

			const rendered = redraft(JSON.parse(content), renderers, { cleanup: false })

			return (
				<View style={styles.renderer}>
					{rendered}
				</View>
			)
		}

		return null
	}
}

DraftRenderer.propTypes = {
	content: PropTypes.string.isRequired,
}

// StyleSheet
const {
	size,
	typo: { h2, p },
} = ss

const styles = ss.create({
	renderer: {
		backgroundColor: 'white',
		// backgroundColor: 'pink', // NOTE testing flexbox
		flex: 1,
	},
	bold: {
		...h2,
	},
	p: {
		...p,
	},
})

export default DraftRenderer
