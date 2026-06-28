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
  const [conversationMode, setConversationMode] = useState(false);
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
  const conversationModeRef = useRef(false)
  const synth = window.speechSynthesis

  useEffect(() => {
    processingRef.current = processing
  }, [processing])

  useEffect(() => {
    conversationModeRef.current = conversationMode;
  }, [conversationMode]);

  const startRecognition = useCallback(() => {
  if (processing || isRecognizingRef.current) return;

  if (!recognitionRef.current) {
    setMicMessage("Speech recognition is not supported.");
    return;
  }

  try {
    synth.cancel();
    setAiText("");
    setUserText("");
    setMicMessage("Listening...");

    recognitionRef.current.start();

  } catch (err) {
    console.log(err);
  }
}, [processing]);

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

    console.log("✅ SPEAK FINISHED");

    isSpeakingRef.current = false;

    if (conversationModeRef.current) {

        console.log("🎤 STARTING AGAIN");

        setTimeout(() => {
            startRecognition();
        }, 500);

    }

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
    recognition.lang = 'en-US'
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
      setMicMessage("Listening...")
    }

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (
    conversationModeRef.current &&
    !processingRef.current &&
    !isSpeakingRef.current
) {
        setTimeout(() => {
          try {
            startRecognition();
          } catch (e) {}
        }, 300);
      }
    };

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

        recognition.stop();

        const transcript = event.results[0][0].transcript.trim();

        console.log("Transcript:", transcript);

        setMicMessage(`Heard: ${transcript}`);

        await runAssistantCommand(transcript);

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
        <button className="mt-5 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-3xl shadow-[0_0_40px_rgba(0,255,255,.4)] hover:scale-110 duration-300" onClick={handleLogOut}>Log Out</button>
        <button className="mt-5 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-3xl shadow-[0_0_40px_rgba(0,255,255,.4)] hover:scale-110 duration-300" onClick={() => navigate("/customize")}>Customize your Assistant</button>

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
      <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_40px_rgba(0,255,255,0.35)] flex justify-center items-center">
        <img
    src={userData?.assistantImage}
    alt=""
    className="w-full h-full object-cover"
/>
      </div>
      <div className="text-center">

<h1 className="text-4xl font-bold text-white">

{userData?.assistantName}

</h1>

<p className="text-cyan-300 text-lg">

Your Smart AI Assistant

</p>

</div>
      {!aiText && <img
src={userImg}
alt=""
className="w-44 rounded-full"
/>}
      {aiText && <img
src={aiImg}
alt=""
className="w-44 rounded-full shadow-[0_0_60px_rgba(0,255,255,.4)]"
/>}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>{userText || aiText || null}</h1>
      
      <form
onSubmit={(e)=>{
e.preventDefault()
runAssistantCommand(typedCommand)
}}
className="w-full max-w-3xl mt-6"
>

<div className="flex items-center bg-white/10 backdrop-blur-xl border border-cyan-400 rounded-full p-2 shadow-[0_0_20px_rgba(0,255,255,.3)]">

<input
type="text"
value={typedCommand}
onChange={(e)=>setTypedCommand(e.target.value)}
placeholder="Ask SIFRA anything..."
className="flex-1 bg-transparent text-white placeholder-gray-300 text-lg px-5 outline-none"
/>

<button
type="submit"
disabled={processing}
className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-105 duration-300"
>

Ask

</button>

</div>

</form>


      <button
  className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-full cursor-pointer text-[17px]"
  onClick={() => {
    if (conversationModeRef.current) {
      setConversationMode(false);
      recognitionRef.current?.stop();
      synth.cancel();
      setListening(false);
      setMicMessage("Conversation stopped");
    } else {
      setConversationMode(true);
      startRecognition();
    }
  }}
>
  {conversationMode ? "🛑 Stop" : "🎤 Ask by Voice"}
</button>
      <p className='text-blue-100 text-[14px]'>{listening ? "Listening..." : micMessage}</p>
    </div>
  )
}

export default Home
