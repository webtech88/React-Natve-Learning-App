import PropTypes from 'prop-types'
import React from 'react'
import { View } from 'react-native'

import common from '../../common'

import ss from '../../styles'

const { Button, TransText } = common.components.core

const FooterSignIn = ({
	disabled,
	onPress,
}) =>
	(<View style={styles.viewFooter}>
		<View style={styles.footer}>
			<TransText style={styles.p} transkey="ALREADY_HAVE_ACCOUNT" />
			<View style={{ width: ss.constants.WIDTH_BUTTON_SMALL }}>
				<Button
					style={{ marginLeft: 10 }}
					type="outline"
					height={ss.constants.HEIGHT_BUTTON_SMALL}
					label="Sign In"
					onPress={onPress}
					disabled={disabled}
				/>
			</View>
		</View>
	</View>)


FooterSignIn.propTypes = {
	disabled: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired,
}


// StyleSheet
const {
	typo: { p },
} = ss

const styles = ss.create({
	viewFooter: {
		// backgroundColor: 'pink', // NOTE testing flexbox
		justifyContent: 'flex-end',
		paddingBottom: 20,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	p,
})

export default FooterSignIn
