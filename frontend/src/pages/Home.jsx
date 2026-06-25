import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
import { userDataContext } from '../context/userDataContext'

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [typedCommand, setTypedCommand] = useState("")
  const [processing, setProcessing] = useState(false)
  const [ham, setHam] = useState(false)
  const [micMessage, setMicMessage] = useState("Tap voice button and ask a question")
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const processingRef = useRef(false)
  const synth = window.speechSynthesis

  useEffect(() => {
    processingRef.current = processing
  }, [processing])

  const startRecognition = useCallback(() => {
    if (processing || isRecognizingRef.current) return

    if (!recognitionRef.current) {
      setMicMessage("Speech recognition is not supported in this browser.")
      return
    }

    try {
      synth.cancel()
      setAiText("")
      setUserText("")
      setMicMessage("Listening...")
      recognitionRef.current.start()
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error)
        setMicMessage("Could not start microphone. Try again.")
      }
    }
  }, [processing, synth])

  const speak = useCallback((text) => {
    if (!text || !("SpeechSynthesisUtterance" in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    const englishVoice = synth.getVoices().find((voice) => voice.lang === 'en-US')

    if (englishVoice) {
      utterance.voice = englishVoice
    }

    isSpeakingRef.current = true
    utterance.onend = () => {
      isSpeakingRef.current = false
      setMicMessage("Tap voice button to ask another question")
    }
    utterance.onerror = () => {
      isSpeakingRef.current = false
      setMicMessage("Tap voice button to ask another question")
    }

    synth.cancel()
    synth.speak(utterance)
  }, [synth])

  const handleStartListening = () => {
    startRecognition()
  }

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
    } catch (error) {
      console.log(error)
    } finally {
      setUserData(null)
      navigate("/signin")
    }
  }

  const handleCommand = useCallback((data) => {
    if (!data?.response) return

    const { type, userInput, response } = data
    speak(response)

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }

    if (type === 'calculator-open') {
      window.open(`https://www.google.com/search?q=calculator`, '_blank')
    }

    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank')
    }

    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank')
    }

    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank')
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank')
    }
  }, [speak])

  const runAssistantCommand = useCallback(async (command) => {
  console.log("RUN ASSISTANT CALLED");
  console.log("Command =", command);

  const cleanCommand = command.trim();

  if (!cleanCommand || processing) {
    console.log("BLOCKED");
    return;
  }

  setProcessing(true);
  setAiText("");
  setUserText(cleanCommand);
  setMicMessage("Thinking...");

  try {
    console.log("Calling Gemini API...");

    if (recognitionRef.current && isRecognizingRef.current) {
      recognitionRef.current.stop();
    }

    const data = await getGeminiResponse(cleanCommand);

    console.log("Gemini Response:", data);

    handleCommand(data);

    setAiText(
      data?.response || "Sorry, I could not understand that."
    );

    setTypedCommand("");
  } catch (error) {
    console.log("Assistant Error:", error);
  } finally {
    setUserText("");
    setProcessing(false);
  }
}, [getGeminiResponse, handleCommand, processing]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setListening(false)
      setMicMessage("Speech recognition is not supported in this browser.")
      return undefined
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
      setMicMessage("Listening...")
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      if (!processingRef.current && !isSpeakingRef.current) {
        setMicMessage("Tap voice button and ask a question")
      }
    }

    recognition.onerror = (event) => {
      isRecognizingRef.current = false
      setListening(false)

      if (event.error === "no-speech") {
        setMicMessage("I did not hear anything. Tap voice button and try again.")
        return
      }

      if (event.error === "network") {
        setMicMessage("Speech service network error. Use Chrome or try the typed Ask box.")
        return
      }

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMicMessage("Microphone permission was denied. Allow mic access and try again.")
        return
      }

      setMicMessage("Microphone stopped. Tap voice button and try again.")
    }

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim()
      setMicMessage(`Heard: ${transcript}`)
      await runAssistantCommand(transcript)
    }

    return () => {
      recognition.abort()
      recognitionRef.current = null
      setListening(false)
      isRecognizingRef.current = false
    }
  }, [runAssistantCommand])

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden'>
      <CgMenuRight className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(true)} />
      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ? "translate-x-0" : "translate-x-full"} transition-transform`}>
        <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]' onClick={() => setHam(false)} />
        <button className='min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
        <button className='min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] ' onClick={() => navigate("/customize")}>Customize your Assistant</button>

        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold text-[19px]'>History</h1>

        <div className='w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate'>
          {userData.history?.map((historyItem, index) => (
            <div key={`${historyItem}-${index}`} className='text-gray-200 text-[18px] w-full h-[30px]  '>{historyItem}</div>
          ))}
        </div>
      </div>

      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] ' onClick={handleLogOut}>Log Out</button>
      <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block ' onClick={() => navigate("/customize")}>Customize your Assistant</button>
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt="" className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[18px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-[200px]' />}
      {aiText && <img src={aiImg} alt="" className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
      
      <form
  className='w-[90%] max-w-[520px] flex gap-[10px]'
  onSubmit={(event) => {
    event.preventDefault();

    console.log("FORM SUBMITTED");
    console.log("typedCommand =", typedCommand);

    runAssistantCommand(typedCommand);
  }}
>
  <input
    type="text"
    value={typedCommand}
    onChange={(event) => {
      console.log("Typing:", event.target.value);
      setTypedCommand(event.target.value);
    }}
    placeholder="Type a command"
    className="min-w-0 flex-1 h-[50px] rounded-full px-[20px] text-[16px] outline-none"
  />

  <button
    type="submit"
    disabled={processing}
    className="min-w-[90px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[17px]"
  >
    Ask
  </button>
</form>


      <button
        className='min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[17px] disabled:opacity-60'
        onClick={handleStartListening}
        disabled={listening || processing}
      >
        {listening ? "Listening..." : "Ask by Voice"}
      </button>
      <p className='text-blue-100 text-[14px]'>{listening ? "Listening..." : micMessage}</p>
    </div>
  )
}

export default Home
