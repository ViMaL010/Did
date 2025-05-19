import { useEffect, useRef, useState } from 'react';
import * as sdk from "@d-id/client-sdk";
import Navbar from '../components/Navbar';
import { IoSend } from 'react-icons/io5';
import { FaMicrophoneAlt } from 'react-icons/fa';

function DID() {
  const [agentId] = useState("agt__Wn9qEep");
  const [auth] = useState({ type: 'key', clientKey: "" });
  const [agentManager, setAgentManager] = useState(null);
  const [connectionState, setConnectionState] = useState("Connecting...");
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const videoElementRef = useRef(null);
  const textAreaRef = useRef(null);
  const answersRef = useRef(null);
  const speechButtonRef = useRef(null);
  const recognitionRef = useRef(null);
  const processedMessageIds = useRef(new Set());

  // Safe speak function with error handling
  const safeSpeak = async (content) => {
    if (!agentManager) {
      console.warn("Agent manager not available for speaking");
      return;
    }
    
    try {
      await agentManager.speak({
        type: "text",
        input: content,
        lipSync: true
      });
    } catch (error) {
      console.error("Speaking failed:", error);
      throw error;
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      if (textAreaRef.current) {
        textAreaRef.current.value = transcript;
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      if (speechButtonRef.current) {
        speechButtonRef.current.classList.remove('recording');
      }
    };

    recognitionRef.current.onend = () => {
      if (isListening) {
        recognitionRef.current.start();
      }
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // Initialize agent manager
  useEffect(() => {
    let isMounted = true;
    let manager = null;

    const initializeAgent = async () => {
      setIsInitializing(true);
      try {
        const callbacks = {
          onSrcObjectReady: (stream) => {
            if (videoElementRef.current) {
              videoElementRef.current.srcObject = stream;
            }
          },
          onConnectionStateChange: (state) => {
            setConnectionState(state === "connected" ? "Online" : "Connecting...");
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
          onVideoStateChange: (state) => {
            if (!videoElementRef.current) return;
            
            if (state === "STOP") {
              videoElementRef.current.muted = true;
              if (manager?.agent?.presenter?.idle_video) {
                videoElementRef.current.src = manager.agent.presenter.idle_video;
              }
            } else {
              videoElementRef.current.muted = false;
              if (manager?.srcObject) {
                videoElementRef.current.srcObject = manager.srcObject;
              }
            }
          },
          onNewMessage: async (newMessages) => {
            if (!newMessages?.length || !manager) return;
            
            const lastMsg = newMessages[newMessages.length - 1];
            
            if (processedMessageIds.current.has(lastMsg.id)) {
              return;
            }

            if (lastMsg?.role === "assistant") {
              try {
                processedMessageIds.current.add(lastMsg.id);
                setIsSpeaking(true);
                
                setMessages(prev => {
                  const exists = prev.some(msg => msg.id === lastMsg.id);
                  if (!exists) {
                    return [...prev, {
                      role: "agent",
                      content: lastMsg.content,
                      id: lastMsg.id,
                      timestamp: new Date()
                    }];
                  }
                  return prev;
                });

                await safeSpeak(lastMsg.content);

              } catch (error) {
                console.error("Speak error:", error);
              } finally {
                setIsSpeaking(false);
              }
            }
          },
          onError: (error, errorData) => {
            setConnectionState("Error");
            console.error("Agent Error:", error, errorData);
          }
        };

        manager = await sdk.createAgentManager(agentId, {
          auth,
          callbacks,
          streamOptions: {
            compatibilityMode: "auto",
            streamWarmup: true
          }
        });

        if (isMounted) {
          setAgentManager(manager);
          await manager.connect();
        }

      } catch (error) {
        console.error("Initialization failed:", error);
        if (isMounted) {
          setConnectionState("Initialization Failed");
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeAgent();

    return () => {
      isMounted = false;
      if (manager) {
        manager.disconnect();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not initialized");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      speechButtonRef.current?.classList.remove('recording');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        speechButtonRef.current?.classList.add('recording');
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const chat = async () => {
    const message = textAreaRef.current?.value.trim();
    if (!message) return;

    if (!agentManager) {
      setMessages(prev => [...prev, {
        role: "agent",
        content: "Agent is not ready yet. Please try again.",
        id: `error-${Date.now()}`,
        timestamp: new Date()
      }]);
      return;
    }

    // Add user message to chat
    setMessages(prev => [...prev, {
      role: "user",
      content: message,
      id: `user-${Date.now()}`,
      timestamp: new Date()
    }]);

    textAreaRef.current.value = '';

    try {
      setConnectionState("Agent is responding...");
      await agentManager.chat(message);
      setConnectionState("Online");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "agent",
        content: "Sorry, I couldn't process that request.",
        id: `error-${Date.now()}`,
        timestamp: new Date()
      }]);
      setConnectionState("Error");
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
<div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${
  message.role === 'agent' ? 'bg-blue-100' : 'bg-gray-100'
}`}>
  <span className={`text-sm font-medium ${
    message.role === 'agent' ? 'text-blue-600' : 'text-gray-600'
  }`}>
    {message.role === 'agent' ? 'A' : 'U'}
  </span>
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
        
        {/* Loading overlay */}
        {isInitializing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <p>Initializing agent...</p>
            </div>
          </div>
        )}

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
            {/* Video section */}
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
                muted={false}
                style={{
                  backgroundImage: agentManager?.agent?.presenter?.source_url 
                    ? `url(${agentManager.agent.presenter.source_url})` 
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
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
            
            {/* Chat section */}
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
                <button 
                  ref={speechButtonRef}
                  onClick={toggleListening}
                  disabled={!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
                  }`}
                  title={isListening ? "Stop listening" : "Start speaking"}
                >
                  <FaMicrophoneAlt />
                </button>

                <button
                  onClick={chat}
                  className="flex-grow flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-full transition-all duration-300 hover:bg-gray-800 active:scale-95"
                >
                  Send <IoSend />
                </button>
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