import React from 'react'

// selected USer arg in this i have changed myself
// writing here for future debugging 

const RightSidebar = ({selectedUser, setSelectedUser }) => {
  return selectedUser ? (
    <div>RightSidebar</div>
  ):(
    <p></p>
  )
}

export default RightSidebar