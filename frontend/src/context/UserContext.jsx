import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { userDataContext } from './userDataContext'

function UserContext({children}) {
    const serverUrl=import.meta.env.VITE_SERVER_URL || "http://localhost:8000"
    const [userData,setUserData]=useState(null)
    const [frontendImage,setFrontendImage]=useState(null)
     const [backendImage,setBackendImage]=useState(null)
     const [selectedImage,setSelectedImage]=useState(null)
    const handleCurrentUser=useCallback(async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }, [serverUrl])

    const getGeminiResponse=async (command)=>{
try {
  const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
  return result.data
} catch (error) {
  console.log(error)
  return {
    type: "error",
    userInput: command,
    response: error.response?.data?.response || "Sorry, I could not reach the assistant right now."
  }
}
    }

    useEffect(()=>{
handleCurrentUser()
    },[handleCurrentUser])
    const value={
serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage,getGeminiResponse
    }
  const UserDataProvider = userDataContext.Provider
  return (
    <div>
    <UserDataProvider value={value}>
      {children}
      </UserDataProvider>
    </div>
  )
}

export default UserContext
