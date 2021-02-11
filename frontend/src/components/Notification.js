/* eslint-disable react/prop-types */
import React from 'react'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  if (type === 'error') {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  if (type === 'success') {
    return (
      <div className="success">
        {message}
      </div>
    )
  }
  return null
}

export default Notification
