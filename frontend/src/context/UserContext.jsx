import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { userDataContext } from './userDataContext'

function UserContext({ children }) {
  const serverUrl =
    import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

  const [userData, setUserData] = useState(null)
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleCurrentUser = useCallback(async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      )

      setUserData(result.data)
      console.log("Current User:", result.data)
    } catch (error) {
      console.log("Current User Error:", error)
    }
  }, [serverUrl])

  const getGeminiResponse = async (command) => {
    console.log("===========")
    console.log("Sending command:", command)
    console.log("Server URL:", serverUrl)

    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      )

      console.log("API SUCCESS")
      console.log(result.data)

      return result.data
    } catch (error) {
      console.log("API FAILED")
      console.log(error)
      console.log(error.response?.data)

      return {
        type: "error",
        userInput: command,
        response:
          error.response?.data?.response ||
          "Sorry, I could not reach the assistant right now."
      }
    }
  }

  useEffect(() => {
    handleCurrentUser()
  }, [handleCurrentUser])

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext