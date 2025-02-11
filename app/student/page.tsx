"use client"

import { SetStateAction, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GamificationStatus } from "@/components/gamification"
import { SubjectSelection } from "@/components/subject-selection"
import axios from 'axios'
//
//
interface ChatMessage {
  from_me: boolean
  type: string
  text: string
  createdAt: string
}

export default function StudentPortal() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [points, setPoints] = useState(150)
  const [level, setLevel] = useState(2)
  const [badges, setBadges] = useState(["Pelajar Pantas", "Pakar Matematik"])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const getAssistantId = (subject: string) => {
    switch (subject) {
      case "math":
        return process.env.NEXT_PUBLIC_MATH_ASSISTANT_ID
      case "science":
        return process.env.NEXT_PUBLIC_SCIENCE_ASSISTANT_ID
      case "english":
        return process.env.NEXT_PUBLIC_ENGLISH_ASSISTANT_ID
      case "malay":
        return process.env.NEXT_PUBLIC_MALAY_ASSISTANT_ID
      default:
        throw new Error("Invalid subject")
    }
  }

  const getWelcomeMessage = (subject: string): ChatMessage => {
    const welcomeMessages = {
      math: "Selamat datang ke sesi Matematik Form 1! 🔢\n\nSaya boleh bantu anda dengan topik-topik berikut:\n\n• Nombor Rasional\n• Faktor dan Kelipatan\n• Kuasa Dua dan Punca Kuasa Dua\n• Nisbah dan Kadar\n• Ungkapan Algebra\n• Persamaan Linear\n• Pertidaksamaan Linear\n• Garis dan Sudut\n• Poligon Asas\n• Keliling dan Luas\n• Pengenalan kepada Set\n• Pengendalian Data\n• Teorem Pythagoras\n\nApa topik yang anda ingin pelajari hari ini? Saya akan membantu anda memahami konsep asas dan menyelesaikan masalah berkaitan topik tersebut. 😊",
      
      science: "Selamat datang ke sesi Sains Form 1! 🔬\n\nSaya boleh bantu anda dengan topik-topik berikut:\n\n• Penyelidikan Saintifik\n• Sel Sebagai Unit Asas Kehidupan\n• Koordinasi dan Tindak Balas\n• Pembiakan\n• Jirim (Matter)\n• Jadual Berkala\n• Udara\n• Cahaya dan Optik\n\nPilih satu topik yang anda ingin pelajari, dan saya akan bantu anda memahaminya dengan lebih mendalam! 🧪",
      
      english: "Welcome to Form 1 English! 📚\n\nI can help you with these topics:\n\n• Basic Grammar (Parts of Speech)\n• Tenses (Past, Present, Future)\n• Sentence Structure\n• Vocabulary Building\n• Reading Comprehension\n• Writing Skills\n• Listening and Speaking\n• Literature Appreciation\n\nWhat would you like to learn today? I'll help you understand and practice these skills in a fun way! 🌟",
      
      malay: "Selamat datang ke sesi Bahasa Melayu Form 1! 📖\n\nSaya boleh bantu anda dengan tema-tema berikut:\n\n• Amalan Gaya Hidup Sihat\n• Beringat Supaya Selamat\n• Cahaya Perpaduan\n• Seni Bersendikan Budaya\n• Jati Diri dan Kewarganegaraan\n• Sains, Teknologi dan Inovasi\n• Teknologi Amalan Hijau\n• Sektor Pertanian\n• Ekonomi dan Pengurusan Kewangan\n\nPilih satu tema yang anda ingin pelajari, dan saya akan bantu anda mengukuhkan kemahiran bahasa anda! 📝"
    }

    return {
      from_me: false,
      type: 'text',
      text: welcomeMessages[subject as keyof typeof welcomeMessages] || "Selamat datang! Apa yang anda ingin tanya?",
      createdAt: new Date().toISOString()
    }
  }

  const sendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (input.trim() === "" || isLoading || !selectedSubject) return

    const newMessage = { 
      from_me: true, 
      type: 'text',
      text: input.trim(),
      createdAt: new Date().toISOString()
    }
 setMessages([...messages, newMessage])
    setInput("")
    setIsLoading(true)

    try {
      const assistantId = getAssistantId(selectedSubject)
      const baseUrl =  'https://juta.ngrok.app'
      
      const res = await axios.get(`${baseUrl}/api/assistant-test/`, {
        params: {
          message: input.trim(),
          email: 'test@test.com', // You'll need to implement user authentication
          assistantid: assistantId
        },
      })
      //print(res);
      const assistantResponse = {
        from_me: false,
        type: 'text',
        text: formatResponse(res.data.answer),
        createdAt: new Date().toISOString(),
      }
      
    setMessages((prevMessages) => [...prevMessages, assistantResponse])

      // Update points
      setPoints(points + 10)
      if (points + 10 >= 200) {
        setLevel(level + 1)
        setBadges([...badges, "Naik Taraf!"])
      }
    } catch (error) {
      console.error("Error:", error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  const formatResponse = (text: string) => {
    // Replace markdown headers with styled text
    text = text.replace(/###\s+([^\n]+)/g, '🔷 $1')
    
    // Replace bold text with actual bold markers
    text = text.replace(/\*\*([^*]+)\*\*/g, '𝗕 $1')
    
    // Format lists with proper indentation and bullets
    text = text.replace(/^\d+\.\s+/gm, '• ')
    
    // Format math expressions
    text = text.replace(/\\[\(\)]/g, '')
    text = text.replace(/\\\s*frac{([^}]+)}{([^}]+)}/g, '$1/$2')
    
    return text
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.32))] max-w-4xl mx-auto p-4">
      {!selectedSubject ? (
        <Card className="shadow-lg rounded-2xl border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
            <CardTitle className="text-2xl text-center text-blue-600">
              👋 Pilih Subjek Kegemaran Anda!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SubjectSelection onSelectSubject={(subject: SetStateAction<string | null>) => {
              setSelectedSubject(subject)
              setMessages([getWelcomeMessage(subject as string)])
            }} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-6 h-full">
          <div className="col-span-2">
            <Card className="h-full flex flex-col shadow-lg rounded-2xl border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <CardTitle className="text-xl text-blue-600 flex items-center gap-2">
                  {selectedSubject === 'math' && '🔢 '}
                  {selectedSubject === 'science' && '🔬 '}
                  {selectedSubject === 'english' && '📚 '}
                  {selectedSubject === 'malay' && '📖 '}
                  Perbualan Projek Ilham 
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-4">
                <div 
                  className="space-y-4 mb-4 flex-grow overflow-y-auto h-[calc(100vh-300px)] pr-4"
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#93C5FD transparent'
                  }}
                >
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.from_me ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`rounded-2xl p-4 max-w-[80%] ${
                          message.from_me 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                            : "bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800 shadow-sm border border-blue-100 whitespace-pre-wrap"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="flex space-x-3 mt-auto">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Sila tunggu..." : "Tanya soalan anda di sini..."}
                    className={`flex-grow rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className={`rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Memikirkan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        ✨ Hantar
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <GamificationStatus points={points} level={level} badges={badges} />
            <Button 
              onClick={() => {
                setSelectedSubject(null)
                setMessages([])
              }} 
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            >
              🔄 Tukar Subjek
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

