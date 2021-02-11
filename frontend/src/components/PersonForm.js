/* eslint-disable react/prop-types */
import React from 'react'

const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  addName,
}) => (
  <form onSubmit={addName}>
    <div>
      name:
      {' '}
      <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number:
      {' '}
      <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm
