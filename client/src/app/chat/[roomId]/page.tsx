"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { use } from "react"

// ChatClient Component
function ChatClient({ roomId }: { roomId: string }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "other", timestamp: new Date().toISOString() },
    { id: 2, text: "Hi there!", sender: "user", timestamp: new Date().toISOString() },
  ])

  const handleSend = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: message,
          sender: "user",
          timestamp: new Date().toISOString(),
        },
      ])
      setMessage("")
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="h-screen flex items-center justify-center bg-black from-background to-muted w-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="border-2 h-full w-full">
          <CardHeader className="relative border-b">
            <Button variant="ghost" size="icon" className="absolute left-4 top-4" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-background">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
              </div>
              <span>Room: {roomId}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(80vh-140px)]">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <AnimatePresence initial={false}>
                <div className="space-y-4 py-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-end gap-2 max-w-[80%]">
                        {/* Uncomment if needed */}
                        {/* {msg.sender === "other" && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback>U2</AvatarFallback>
                          </Avatar>
                        )} */}
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <div>{msg.text}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t pt-4 mt-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" className="h-10 w-10" disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ChatPage Component
export default function ChatPage({ params }: { params: Promise<{ roomId: string }> }) {
  // Use React.use() to unwrap the Promise
  const { roomId } = use(params)

  return <ChatClient roomId={roomId} />
}
