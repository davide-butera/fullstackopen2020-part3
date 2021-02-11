/* eslint-disable react/prop-types */
import React from 'react'
import Person from './Person'

const Persons = ({ contactsToShow, deleteName }) => (
  <ul>
    {contactsToShow.map((person) => (
      <Person
        key={person.name}
        name={person.name}
        number={person.number}
        deleteName={() => deleteName(person)}
      />
    ))}
  </ul>
)

export default Persons
