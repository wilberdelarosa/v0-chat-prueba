import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"
import { NextResponse } from "next/server"

// Definimos el runtime como nodejs explícitamente
export const runtime = "nodejs"

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

export async function POST(req: Request) {
  try {
    // Parsear el cuerpo de la solicitud
    const body = await req.json()
    const messages = body.messages || []

    // Verificar que hay mensajes
    if (messages.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron mensajes" }, { status: 400 })
    }

    // Usar streamText que es la función correcta
    const stream = await streamText({
      model: xai("grok-1"),
      messages,
      system: SYSTEM_PROMPT,
    })

    // Devolver el stream como respuesta
    return new Response(stream)
  } catch (error: any) {
    console.error("Error en la API de chat:", error)

    // Devolver un mensaje de error detallado
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        details: error.message || "Error desconocido",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
