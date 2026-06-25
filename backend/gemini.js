import axios from "axios"
const geminiResponse=async (command,assistantName,userName)=>{
try {
    
    console.log("========== GEMINI START =========="); 
    console.log("Command:", command); 
    console.log("Assistant:", assistantName); 
    console.log("User:", userName); 
    console.log("API KEY:", process.env.GEMINI_API_KEY);

    const apiUrl=process.env.GEMINI_API_URL || (
        process.env.GEMINI_API_KEY
            ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`
            : ""
    )
    if(!apiUrl){
        return {
            error: "Gemini is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend."
        }
    }
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month"|"calculator-open" | "instagram-open" |"facebook-open" |"weather-show"
  ,
  "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
- "google-search": if user wants to search something on Google .
- "youtube-search": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video or song.
- "calculator-open": if user wants to  open a calculator .
- "instagram-open": if user wants to  open instagram .
- "facebook-open": if user wants to open facebook.
-"weather-show": if user wants to know weather
- "get-time": if user asks for current time.
- "get-date": if user asks for today's date.
- "get-day": if user asks what day it is.
- "get-month": if user asks for the current month.

Important:
- Use ${userName} agar koi puche tume kisne banaya 
- Only respond with the JSON object, nothing else.


now your userInput- ${command}
`;




    console.log("Using Gemini URL:", apiUrl);
console.log("API URL EXISTS:", !!apiUrl);

    const result=await axios.post(apiUrl,{
    "contents": [{
    "parts":[{"text": prompt}]
    }]
    })
return {
    text: result.data.candidates?.[0]?.content?.parts?.[0]?.text || ""
}
} catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.log("Status:", error.response?.status);
    console.log("Data:", JSON.stringify(error.response?.data, null, 2));
    console.log("Message:", error.message);
    console.log("Stack:", error.stack);

    return {
        error: error.response?.data?.error?.message || error.message
    };
}
}

export default geminiResponse
