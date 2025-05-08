"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Bot, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useChat } from "ai/react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hola, soy DevArchitect, tu asistente especializado en desarrollo de software, arquitectura, buenas prácticas y despliegues en la nube. ¿En qué puedo ayudarte hoy?",
      },
    ],
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    handleInputChange(e)

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim() === "") return

    handleSubmit(e)
    setInputValue("")

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <Card className="flex-1 bg-gray-950/50 border-gray-800 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-start gap-3 max-w-full", message.role === "user" ? "justify-end" : "")}
              >
                <div
                  className={cn(
                    "rounded-lg p-3 max-w-[85%]",
                    message.role === "user"
                      ? "bg-emerald-500/20 border border-emerald-500/30 ml-12"
                      : "bg-gray-800/70 border border-gray-700 mr-12",
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        message.role === "user" ? "bg-emerald-500" : "bg-blue-500",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-300">
                      {message.role === "user" ? "Tú" : "DevArchitect"}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {error && (
          <div className="px-4 py-2 bg-red-900/50 border-t border-red-800">
            <p className="text-sm text-red-300 flex items-center gap-2">
              <span className="rounded-full bg-red-800 p-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Error: {error.message}
              <Button variant="ghost" size="sm" onClick={reload} className="ml-auto">
                <RefreshCw className="w-4 h-4 mr-1" />
                Reintentar
              </Button>
            </p>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-[44px] w-full resize-none bg-gray-950 border-gray-800 focus-visible:ring-emerald-500 text-white pr-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (input.trim()) {
                      handleSubmit(e as any)
                      setInputValue("")
                      if (textareaRef.current) {
                        textareaRef.current.style.height = "auto"
                      }
                    }
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || input.trim() === ""}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-[44px] px-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="sr-only">Enviar mensaje</span>
            </Button>
          </form>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Presiona Enter para enviar, Shift+Enter para nueva línea</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
