import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"
import { NextResponse } from "next/server"

// Sistema de instrucciones para el asistente
const SYSTEM_PROMPT = `Eres DevArchitect, un asistente especializado en desarrollo de software, arquitectura, buenas prácticas, y despliegues en la nube.

Tus capacidades incluyen:
- Proporcionar consejos detallados sobre arquitectura de software
- Explicar patrones de diseño y mejores prácticas
- Crear diagramas de flujo y esquemas usando markdown
- Ofrecer guías paso a paso para implementaciones
- Explicar conceptos de DevOps y CI/CD
- Ayudar con estrategias de despliegue en la nube
- Recomendar herramientas y tecnologías

Cuando sea apropiado, utiliza markdown para crear diagramas, tablas y código formateado.
Para diagramas de flujo, utiliza la sintaxis de mermaid cuando sea posible.
Sé detallado, profesional y preciso en tus respuestas.`

export const runtime = "nodejs" // Aseguramos que se ejecute en el entorno Node.js

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Extraer el último mensaje del usuario
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return NextResponse.json({ error: "No se encontró un mensaje de usuario" }, { status: 400 })
    }

    // Crear el stream de respuesta
    const stream = await streamText({
      model: xai("grok-1"),
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    // Devolver el stream como respuesta
    return new Response(stream)
  } catch (error) {
    console.error("Error en la API de chat:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
