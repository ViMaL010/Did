import { useEffect, useRef, useState } from 'react';
import * as sdk from "@d-id/client-sdk";

function DID() {
  const [agentId] = useState("agt__Wn9qEep");
  const [auth] = useState({ type: 'key', clientKey: "Z29vZ2xlLW9hdXRoMnwxMDEyMzg3MTgzNzA5NjkxMzEyMTM6RHdqS001QkpsTUVaenhlUERQTGdz" });
  const [streamOptions] = useState({ compatibilityMode: "auto", streamWarmup: true });
  const [agentManager, setAgentManager] = useState(null);
  const [connectionState, setConnectionState] = useState("Connecting..");
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([]);

  const videoElementRef = useRef(null);
  const textAreaRef = useRef(null);
  const answersRef = useRef(null);
  const speechButtonRef = useRef(null);

  // Callbacks
  const callbacks = {
    onSrcObjectReady(value) {
      console.log("onSrcObjectReady():", value);
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = value;
      }
      return value;
    },

    onConnectionStateChange(state) {
      console.log("onConnectionStateChange(): ", state);
      setConnectionState(state === "connected" ? "Online" : state === "connecting" ? "Connecting.." : "");

      if (state === "connected") {
        if (textAreaRef.current) {
          textAreaRef.current.addEventListener('keypress', (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              chat();
            }
          });
        }
      } else if (state === "disconnected" || state === "closed") {
        if (textAreaRef.current) {
          textAreaRef.current.removeEventListener('keypress', (event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              chat();
            }
          });
        }
        setIsHidden(true);
      }
    },

    onVideoStateChange(state) {
      console.log("onVideoStateChange(): ", state);
      if (state === "STOP" && videoElementRef.current) {
        videoElementRef.current.muted = true;
        videoElementRef.current.srcObject = undefined;
        if (agentManager) {
          videoElementRef.current.src = agentManager.agent.presenter.idle_video;
        }
      } else if (videoElementRef.current) {
        videoElementRef.current.muted = false;
        videoElementRef.current.src = "";
        if (agentManager) {
          videoElementRef.current.srcObject = agentManager.srcObject;
        }
        setConnectionState("Online");
      }
    },

    onNewMessage(msgArray, type) {
      console.log("onNewMessage():", msgArray, type);
      const lastIndex = msgArray.length - 1;
      const msg = msgArray[lastIndex];

      if (!msg || !msg.role) {
        console.error("Invalid message format:", msg);
        return;
      }

      const newMessage = {
        role: msg.role === "assistant" ? "agent" : "user",
        content: msg.content,
        id: msg.id,
        type: type,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMessage]);

      if (answersRef.current) {
        answersRef.current.scrollTop = answersRef.current.scrollHeight;
      }
    },

    onError(error, errorData) {
      setConnectionState("Something went wrong :(");
      console.log("Error:", error, "Error Data", errorData);
    }
  };

  // Initialize agent manager
  useEffect(() => {
    const initializeAgentManager = async () => {
      if (agentId && auth.clientKey) {
        try {
          const manager = await sdk.createAgentManager(agentId, { auth, callbacks, streamOptions });
          setAgentManager(manager);
          console.log("sdk.createAgentManager()", manager);
          
          if (videoElementRef.current && manager.agent.presenter.source_url) {
            videoElementRef.current.style.backgroundImage = `url(${manager.agent.presenter.source_url})`;
          }
          
          manager.connect();
          console.log("agentManager.connect()");
        } catch (error) {
          console.error("Error initializing agent manager:", error);
        }
      } else {
        console.error("Missing agentID and auth.clientKey variables");
      }
    };

    initializeAgentManager();

    return () => {
      if (agentManager) {
        agentManager.disconnect();
      }
    };
  }, [agentId, auth.clientKey]);

  // Functions
  const speak = () => {
    const val = textAreaRef.current?.value;
    if (val && val.length > 2 && agentManager) {
      agentManager.speak({ type: "text", input: val });
      console.log(`agentManager.speak("${val}")`);
      setConnectionState("Streaming..");
    }
  };

  const chat = () => {
    const val = textAreaRef.current?.value;
    if (val && val !== "" && agentManager) {
      const userMessage = {
        role: "user",
        content: val,
        id: `user-${Date.now()}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      agentManager.chat(val);
      console.log("agentManager.chat()");
      setConnectionState("Thinking..");
      textAreaRef.current.value = "";
    }
  };

  const rate = (messageID, score) => {
    if (agentManager) {
      agentManager.rate(messageID, score);
      console.log(`Message ID: ${messageID} Rated:${score}`);
    }
  };

  const reconnect = () => {
    if (agentManager) {
      agentManager.reconnect();
      console.log("agentManager.reconnect()");
      setIsHidden(false);
    }
  };

  const toggleStartStop = () => {
    if (speechButtonRef.current.classList.contains('recording')) {
      window.stopSpeechRecognition();
      speechButtonRef.current.classList.remove('recording');
    } else {
      window.startSpeechRecognition();
      speechButtonRef.current.classList.add('recording');
    }
  };

  const createMessageElement = (message) => {
    return (
      <div 
        key={message.id} 
        className={`flex gap-2.5 mb-4 w-full animate-[messageSlideIn_0.5s_ease-out_forwards] opacity-0 translate-y-5 ${
          message.role === 'agent' ? 'agent' : 'user'
        }`}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <img src="/api/placeholder/36/36" alt={`${message.role} Avatar`} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className={`
            p-2.5 px-4 rounded-2xl max-w-[85%] shadow-sm transition-transform duration-300 ease-in-out break-words
            ${message.role === 'agent' ? 'bg-blue-50' : 'bg-gray-50'}
            hover:-translate-y-0.5 hover:shadow-md
          `}>
            {message.content}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {message.timestamp.getHours()}:{message.timestamp.getMinutes().toString().padStart(2, '0')}
          </div>
          {message.role === "agent" && messages.length !== 1 && message.type === "answer" && (
            <div className="flex gap-2 mt-1 justify-end">
              <button 
                id={`${message.id}_plus`} 
                title="agentManager.rate() -> Rate this answer (+)"
                onClick={() => rate(message.id, 1)}
                className="w-6 h-6 rounded-full bg-gray-50 border border-gray-300 cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-200 hover:scale-110"
              >+</button>
              <button 
                id={`${message.id}_minus`} 
                title="agentManager.rate() -> Rate this answer (-)"
                onClick={() => rate(message.id, -1)}
                className="w-6 h-6 rounded-full bg-gray-50 border border-gray-300 cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-200 hover:scale-110"
              >-</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 text-gray-800 leading-normal flex items-center justify-center">
      {/* Reconnect overlay */}
      {isHidden && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[999]">
          <h2 className="text-white mb-5 text-2xl">
            {agentManager?.agent?.preview_name || 'Your Agent'} Disconnected
          </h2>
          <button 
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md cursor-pointer transition-colors duration-300 hover:bg-orange-600"
            title="agentManager.reconnect() -> Reconnects the previous WebRTC session" 
            onClick={reconnect}
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Main container */}
      <div 
        id="container" 
        className="max-w-[1200px] mx-5 my-5 grid grid-cols-[2fr_1fr] gap-5 bg-white rounded-xl shadow-lg overflow-hidden"
        style={{ display: isHidden ? "none" : "grid" }}
      >
        {/* Video section */}
        <div className="p-0 relative rounded-lg overflow-hidden col-span-1 row-span-3 border border-gray-300 transition-all duration-500 ease-in-out hover:shadow-xl">
          <div className="absolute top-0 left-0 w-full p-5 bg-gradient-to-b from-black/50 to-transparent text-white flex justify-between items-center z-10">
            <span className="text-2xl font-semibold">
              {agentManager?.agent?.preview_name || 'Your Agent'}
            </span>
            <span className="text-sm px-3 py-1 bg-black/50 rounded-full">
              {connectionState}
            </span>
          </div>
          
          <video 
            id="videoElement" 
            ref={videoElementRef} 
            className="w-full h-full object-cover bg-center bg-no-repeat bg-cover min-h-[600px] transition-transform duration-[8s] ease-in-out hover:scale-105"
            autoPlay 
            loop
          ></video>
          
          <div className="absolute bottom-5 left-5 text-white z-5">
            <h2 className="text-2xl font-semibold mb-1">Family Health Insurance</h2>
            <p className="text-sm opacity-80">13 May 2025</p>
          </div>
          
          <div className="absolute bottom-5 left-0 w-full flex justify-center gap-4 z-10 opacity-0 translate-y-5 transition-all duration-400 ease-in-out hover:opacity-100 hover:translate-y-0">
            <button className="w-12 h-12 rounded-full bg-black/60 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/80 hover:scale-110">
              <span className="material-symbols-outlined">file_download</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-black/60 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/80 hover:scale-110">
              <span className="material-symbols-outlined">closed_caption</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-black/60 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/80 hover:scale-110">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button className="px-5 py-3 bg-red-500 rounded-2xl text-white cursor-pointer transition-all duration-300 hover:bg-red-700">
              Leave Meeting
            </button>
            <button className="w-12 h-12 rounded-full bg-black/60 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/80 hover:scale-110">
              <span className="material-symbols-outlined">chat</span>
            </button>
            <button className="w-12 h-12 rounded-full bg-black/60 border-none text-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-black/80 hover:scale-110">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>
        </div>
        
        {/* Chat section */}
        <div className="flex flex-col border-l border-gray-200">
          <div className="flex border-b border-gray-200">
            <div className="py-3 px-5 font-medium cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:bg-gray-50 border-b-orange-500 text-orange-500">
              Messages
            </div>
            <div className="py-3 px-5 font-medium cursor-pointer border-b-2 border-transparent transition-all duration-300 ease-in-out hover:bg-gray-50">
              Policies
            </div>
          </div>
          
          <div className="py-2.5 px-4 text-sm text-gray-600 text-center bg-gray-50 border-b border-gray-200">
            You can chat here with the agent during the meeting and they will be deleted after the meeting.
          </div>
          
          <div 
            id="answers" 
            ref={answersRef}
            className="h-[400px] overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth"
          >
            {messages.map(message => createMessageElement(message))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <textarea 
              id="textArea" 
              ref={textAreaRef}
              className="w-full p-3 px-4 border border-gray-300 rounded-3xl resize-none outline-none transition-all duration-300 ease-in-out h-12 shadow-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:-translate-y-0.5"
              placeholder="Type a message" 
              autoFocus
            ></textarea>
          </div>
          
          <div className="flex gap-2.5 px-4 pb-4">
            <select 
              id="langSelect" 
              title="Speech to Text - Language Selection"
              className="p-2 px-3 border border-gray-300 rounded mr-2.5"
            >
              <option value="en_US" disabled selected>TTS Language</option>
              <option value="en_US" default>English</option>
              <option value="es_ES">Spanish</option>
              <option value="fr_FR">French</option>
              <option value="it_IT">Italian</option>
              <option value="de_DE">German</option>
              <option value="he_IL">Hebrew</option>
              <option value="ru_RU">Russian</option>
            </select>
            <button 
              id="speechButton" 
              ref={speechButtonRef}
              title="Speech to Text - Web Speech API (MDN)" 
              onClick={toggleStartStop}
              className="w-9 h-9 rounded-full bg-gray-50 border-none cursor-pointer flex items-center justify-center transition-all duration-300 relative hover:bg-gray-200 hover:scale-110"
            >🎤</button>
            <button 
              id="chatButton" 
              title="agentManager.chat() -> Communicate with your Agent (D-ID LLM)"
              onClick={chat}
              className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-orange-600 hover:scale-105 active:scale-95"
            >Chat</button>
            <button 
              id="speakButton" 
              title="agentManager.speak() -> Streaming API (Bring your own LLM)"
              onClick={speak}
              className="px-5 py-2.5 bg-orange-500 text-white font-medium rounded-3xl cursor-pointer transition-all duration-300 relative overflow-hidden hover:bg-orange-600 hover:scale-105 active:scale-95"
            >Speak</button>
          </div>
        </div>
      </div>

      {/* Animation keyframes style */}
      <style jsx>{`
        @keyframes messageSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 0.5;
          }
          20% {
            transform: scale(25, 25);
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 107, 53, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default DID;