'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [awaitingOption, setAwaitingOption] = useState(false);
  const [showIntroBubble, setShowIntroBubble] = useState(false);
  const scrollRef = useRef(null);

  // Mostrar globo de presentación a los 40s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroBubble(true);
    }, 40000); // 40 segundos
    return () => clearTimeout(timer);
  }, []);

  const openChat = () => {
    setIsOpen(true);
    setShowIntroBubble(false); // ocultar el globo cuando se abre
    setTimeout(() => {
      const greeting = {
        from: 'bot',
        text: '¡Hola! 👋 Soy Coni-E, tu asistente de Conectar Inmobiliaria. ¿En qué te puedo ayudar hoy?',
      };
      const optionsPrompt = {
        from: 'bot',
        text: 'Selecciona una opción:',
      };
      setMessages([greeting, optionsPrompt]);
      setAwaitingOption(true);
    }, 300);
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOption = (optionText) => {
    setMessages((prev) => [...prev, { from: 'user', text: optionText }]);
    setAwaitingOption(false);

    setTimeout(() => {
      let botReply;
      switch (optionText) {
        case 'Tasaciones':
          botReply = {
            from: 'bot',
            text: 'Realizamos tasaciones profesionales basadas en más de 30 años de experiencia. ¿Querés que te enviemos más info?',
          };
          break;
        case 'Administración de Propiedades':
          botReply = {
            from: 'bot',
            text: 'Ofrecemos administración integral de tus inmuebles: alquileres, mantenimiento y cobros. ¿Te gustaría contactarte ahora?',
          };
          break;
        case 'Comercialización de Alquileres':
          botReply = {
            from: 'bot',
            text: 'Nos encargamos de publicar y gestionar tu alquiler. Filtramos postulantes y garantizamos cobros. ¿Te gustaría hablar con un asesor?',
          };
          break;
        default:
          botReply = {
            from: 'bot',
            text: '¡Entendido! Si necesitas más ayuda, podés contactarnos:',
          };
          break;
      }

      setMessages((prev) => [...prev, botReply]);

      setTimeout(() => {
        const finalMsg = {
          from: 'bot',
          text: 'Podés escribirnos por WhatsApp o completar el formulario de contacto:',
        };
        setMessages((prev) => [...prev, finalMsg]);
      }, 700);
    }, 700);
  };

  const renderMessages = () =>
    messages.map((m, i) => (
      <div
        key={i}
        className={`d-flex mb-2 ${
          m.from === 'bot' ? 'justify-content-start' : 'justify-content-end'
        }`}
      >
        <div
          className={`p-2 rounded ${
            m.from === 'bot' ? 'bg-light text-dark' : 'bg-primary text-white'
          }`}
          style={{ maxWidth: '70%', wordBreak: 'break-word' }}
        >
          {m.text}
        </div>
      </div>
    ));

  return (
    <>
      {/* Botón flotante */}
      <div
        className="position-fixed"
        style={{
          bottom: '20px',
          right: '50px',
          zIndex: 1050,
        }}
      >
        {/* Globo de presentación */}
        {showIntroBubble && !isOpen && (
          <div
            className="bg-light border rounded shadow p-2 mb-2"
            style={{
              position: 'absolute',
              bottom: '100%',
              right: '0',
              width: '220px',
              fontSize: '0.9rem',
            }}
          >
            👋 ¡Hola! Soy <strong>Coni-E</strong>, la asistente virtual de <strong>Conectar Inmobiliaria</strong>.  
            ¿En qué puedo ayudarte?
          </div>
        )}

        <button
          onClick={openChat}
          className="rounded-circle border-0"
          style={{
            width: '80px',
            height: '100px',
            backgroundColor: 'transparent',
            backgroundImage: "url('/coni-e.png')",
            backgroundSize: 'cover',
            cursor: 'pointer',
          }}
          aria-label="Abrir chat"
        />
      </div>

      {/* Ventana del chat */}
      {isOpen && (
        <div
          className="position-fixed bg-white border rounded shadow d-flex flex-column"
          style={{
            bottom: '90px',
            right: '20px',
            width: '300px',
            height: '400px',
            zIndex: 1040,
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-2 bg-primary text-white rounded-top">
            <strong>Coni-E • ChatBot</strong>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-light text-primary"
              style={{ lineHeight: 1, padding: '0 6px' }}
            >
              ✕
            </button>
          </div>

          <div
            className="flex-grow-1 p-2 overflow-auto"
            ref={scrollRef}
            style={{ backgroundColor: '#f8f9fa' }}
          >
            {renderMessages()}

            {awaitingOption && (
              <div className="mt-2">
                {['Tasaciones', 'Administración de Propiedades', 'Comercialización de Alquileres'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="btn btn-outline-primary btn-sm me-2 mb-2"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {!awaitingOption &&
              messages.some((m) => m.text.toLowerCase().includes('whatsapp')) && (
                <div className="mt-3">
                  <a
                    href="https://wa.me/543764728718"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-sm w-100 mb-2"
                  >
                    Chatear por WhatsApp
                  </a>
                  <Link href="/contacto" className="btn btn-secondary btn-sm w-100">
                    Ir al formulario de contacto
                  </Link>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
