import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { TextInput } from 'react-native'
import { connect } from 'react-redux'

import lang from '../../../core/config/lang'

const { locales, getText } = lang

class TransTextInput extends Component {
	render() {
    const { placeholder, locale, component, ...otherProps } = this.props
    const text = getText(placeholder, locale)

    if (component) {
      console.log(component)
      return (
        <component
          placeholder={text}
          {...otherProps}        
        />
      )
    } 
      return (
        <TextInput 
          placeholder={text}
          {...otherProps}        
        />
      )
    
  }
}

TransTextInput.propTypes = {
	placeholder: PropTypes.string,
	locale: PropTypes.string,
  component: PropTypes.object,
  otherProps: PropTypes.object,
}

const mapStateToProps = state => ({
	locale: state.app.locale,
})

export default connect(mapStateToProps, null)(TransTextInput)
