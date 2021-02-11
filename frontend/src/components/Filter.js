import React from 'react'

// eslint-disable-next-line react/prop-types
const Filter = ({ search, searchName, addName }) => (
  <form onSubmit={addName}>
    <div>
      filter shown with:
      {' '}
      <input value={search} onChange={searchName} />
    </div>
  </form>
)

export default Filter
