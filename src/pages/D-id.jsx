import { useEffect, useRef, useState } from 'react';
import * as sdk from "@d-id/client-sdk";
import Navbar from '../components/Navbar';
import { IoSend } from 'react-icons/io5';
import { FaMicrophoneAlt } from 'react-icons/fa';

function DID() {
  const [agentId] = useState("agt__Wn9qEep");
  const [auth] = useState({ type: 'key', clientKey: "Z29vZ2xlLW9hdXRoMnwxMDEyMzg3MTgzNzA5NjkxMzEyMTM6RHdqS001QkpsTUVaenhlUERQTGdz" });
  const [streamOptions] = useState({ compatibilityMode: "auto", streamWarmup: true });
  const [agentManager, setAgentManager] = useState(null);
  const [connectionState, setConnectionState] = useState("Connecting...");
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  const videoElementRef = useRef(null);
  const textAreaRef = useRef(null);
  const answersRef = useRef(null);
  const speechButtonRef = useRef(null);

  // Callbacks
  const callbacks = {
    onSrcObjectReady(value) {
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = value;
      }
      return value;
    },

    onConnectionStateChange(state) {
      setConnectionState(state === "connected" ? "Online" : state === "connecting" ? "Connecting..." : "");

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
      setConnectionState("Error");
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
          
          if (videoElementRef.current && manager.agent.presenter.source_url) {
            videoElementRef.current.style.backgroundImage = `url(${manager.agent.presenter.source_url})`;
          }
          
          // manager.connect();
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
      setConnectionState("Streaming...");
      textAreaRef.current.value = "";
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
      setConnectionState("Thinking...");
      textAreaRef.current.value = "";
    }
  };

  const rate = (messageID, score) => {
    if (agentManager) {
      agentManager.rate(messageID, score);
    }
  };

  const reconnect = () => {
    if (agentManager) {
      agentManager.reconnect();
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

  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
  };

  const formatTime = (date) => {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const createMessageElement = (message) => {
    return (
      <div 
        key={message.id} 
        className={`flex gap-2.5 mb-4 w-full animate-[messageSlideIn_0.5s_ease-out_forwards] opacity-0 translate-y-5 ${
          message.role === 'agent' ? 'agent' : 'user'
        }`}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img src="/api/placeholder/32/32" alt={`${message.role} Avatar`} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-[calc(100%-40px)]">
          <div className={`
            p-2.5 px-4 rounded-2xl shadow-sm transition-transform duration-300 ease-in-out break-words
            ${message.role === 'agent' ? 'bg-blue-50' : 'bg-gray-50'}
            hover:-translate-y-0.5 hover:shadow-md
          `}>
            {message.content}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatTime(message.timestamp)}
          </div>
          {message.role === "agent" && messages.length !== 1 && message.type === "answer" && (
            <div className="flex gap-2 mt-1">
              <button 
                id={`${message.id}_plus`} 
                title="Rate this answer (+)"
                onClick={() => rate(message.id, 1)}
                className="w-6 h-6 rounded-full bg-gray-50 border border-gray-300 cursor-pointer flex items-center justify-center transition-all duration-200 ease-in-out hover:bg-gray-200 hover:scale-110"
              >+</button>
              <button 
                id={`${message.id}_minus`} 
                title="Rate this answer (-)"
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
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="w-full py-4 px-4 md:px-6 max-w-6xl mx-auto">
        
        {/* Reconnect overlay */}
        {isHidden && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
            <h2 className="text-white mb-5 text-2xl">
              {agentManager?.agent?.preview_name || 'Your Agent'} Disconnected
            </h2>
            <button 
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-md cursor-pointer transition-colors duration-300 hover:bg-orange-600"
              onClick={reconnect}
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Main container */}
        <div 
          className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isHidden ? 'hidden' : 'block'}`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Video section - smaller as requested */}
            <div className={`relative transition-all duration-300 ${isChatExpanded ? 'w-full md:w-1/3' : 'w-full md:w-2/3'}`}>
              <div className="absolute top-0 left-0 w-full p-3 bg-gradient-to-b from-black/50 to-transparent text-white flex justify-between items-center z-10">
                <span className="text-lg font-semibold">
                  {agentManager?.agent?.preview_name || 'D-ID Agent'}
                </span>
                <span className="text-xs px-2 py-1 bg-black/50 rounded-full">
                  {connectionState}
                </span>
              </div>
              
              <video 
                ref={videoElementRef} 
                className="w-full object-cover bg-center bg-no-repeat bg-cover aspect-[4/3] md:aspect-auto md:h-full"
                autoPlay 
                loop
              ></video>
              
              <button 
                onClick={toggleChatExpansion} 
                className="absolute bottom-3 right-3 bg-black/60 text-white p-2 rounded-full z-10 md:hidden"
              >
                <span className="material-symbols-outlined">
                  {isChatExpanded ? 'videocam' : 'chat'}
                </span>
              </button>
            </div>
            
            {/* Chat section - larger as requested */}
            <div className={`bg-white transition-all duration-300 flex flex-col ${isChatExpanded ? 'w-full md:w-2/3' : 'w-full md:w-1/3'}`}>
              <div className="flex border-b border-gray-200">
                <div className="py-2 px-4 font-medium cursor-pointer border-b-2 border-b-grey-500 text-grey-500">
                  Chat
                </div>
                <button 
                  onClick={toggleChatExpansion} 
                  className="ml-auto py-2 px-4 hidden md:block"
                >
                  <span className="material-symbols-outlined text-gray-500">
                    {isChatExpanded ? '' : ''}
                  </span>
                </button>
              </div>
              
              <div className="py-2 px-4 text-xs text-gray-600 text-center bg-gray-50 border-b border-gray-200">
                Chat with the digital agent - messages will be deleted after the session
              </div>
              
              <div 
                ref={answersRef}
                className="flex-grow h-[400px] overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10">
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Start your conversation with the agent</p>
                  </div>
                ) : (
                  messages.map(message => createMessageElement(message))
                )}
              </div>
              
              <div className="p-3 border-t border-gray-200">
                <textarea 
                  ref={textAreaRef}
                  className="w-full p-3 px-4 border border-gray-300 rounded-md resize-none outline-none transition-all duration-300 ease-in-out h-12 shadow-sm focus:border-grey-500 focus:ring-1 focus:ring-grey-200"
                  placeholder="Type a message..." 
                  autoFocus
                ></textarea>
              </div>
              
              <div className="flex gap-2 px-3 pb-3">
                {/* <button 
                  ref={speechButtonRef}
                  onClick={toggleStartStop}
                  className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center transition-all duration-300 hover:bg-gray-200"
                >🎤</button> */}

<button
  onClick={chat}
  className="flex-grow flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-full transition-all duration-300 hover:bg-gray-800 active:scale-95"
>
  Send <IoSend />
</button>

                <button 
                  onClick={speak}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-full border border-gray-200 transition-all duration-300 hover:bg-gray-200 active:scale-95"
                ><FaMicrophoneAlt /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes messageSlideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .recording {
          animation: pulse 1.5s infinite;
          background-color: rgba(239, 68, 68, 0.2);
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  );
}

export default DID;