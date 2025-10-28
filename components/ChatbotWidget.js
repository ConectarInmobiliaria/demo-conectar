// components/ChatbotWidget.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [awaitingOption, setAwaitingOption] = useState(false);
  const [showIntroBubble, setShowIntroBubble] = useState(false);
  const scrollRef = useRef(null);

  // 🔹 Mostrar el globo después de 40s (solo si nunca fue cerrado antes)
  useEffect(() => {
    const introDismissed = localStorage.getItem('introBubbleDismissed') === 'true';
    if (!introDismissed) {
      const timer = setTimeout(() => setShowIntroBubble(true), 40000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 🔹 Abrir chat
  const openChat = () => {
    setIsOpen(true);
    setShowIntroBubble(false);
    localStorage.setItem('introBubbleDismissed', 'true'); // no mostrar más el globo
    setTimeout(() => {
      const greeting = {
        from: 'bot',
        text: '¡Hola! 👋 Soy Coni-E, tu asistente de Conectar Inmobiliaria. ¿En qué servicio estás interesado?',
      };
      setMessages([greeting]);
      setAwaitingOption(true);
    }, 300);
  };

  // 🔹 Cerrar chat
  const closeChat = () => {
    setIsOpen(false);
  };

  // 🔹 Cerrar globo de presentación
  const closeIntroBubble = () => {
    setShowIntroBubble(false);
    localStorage.setItem('introBubbleDismissed', 'true');
  };

  // 🔹 Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔹 Opciones del bot
  const handleOption = (optionText) => {
    setMessages((prev) => [...prev, { from: 'user', text: optionText }]);
    setAwaitingOption(false);

    setTimeout(() => {
      let botReply;
      switch (optionText) {
        case 'Compraventa de Inmuebles':
          botReply = { from: 'bot', text: 'Te ayudamos a comprar o vender inmuebles de manera segura y transparente. ¿Querés que te asesoremos?' };
          break;
        case 'Alquileres':
          botReply = { from: 'bot', text: 'Gestionamos alquileres de forma integral, cuidando tanto al propietario como al inquilino. ¿Querés más info?' };
          break;
        case 'Asesoramiento Legal y Financiero':
          botReply = { from: 'bot', text: 'Contamos con profesionales que te asesoran en lo legal y financiero para tomar las mejores decisiones. ¿Querés hablar con un especialista?' };
          break;
        case 'Administración de Propiedades':
          botReply = { from: 'bot', text: 'Ofrecemos administración completa de propiedades: cobros, mantenimiento y gestión de inquilinos. ¿Querés recibir detalles?' };
          break;
        case 'Tasación':
          botReply = { from: 'bot', text: 'Realizamos tasaciones precisas basadas en nuestra experiencia y el mercado actual. ¿Querés coordinar una?' };
          break;
        default:
          botReply = { from: 'bot', text: '¡Entendido! 😊' };
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
      <div key={i} className={`d-flex mb-2 ${m.from === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}>
        <div
          className={`p-2 rounded position-relative ${
            m.from === 'bot' ? 'bg-light text-dark bot-bubble' : 'bg-primary text-white'
          }`}
          style={{ maxWidth: '70%', wordBreak: 'break-word' }}
        >
          {m.text}
        </div>
      </div>
    ));

  return (
    <>
      {/* 🔹 Botón flotante */}
      <div
        className="position-fixed"
        style={{ bottom: '20px', right: '50px', zIndex: 1050 }}
      >
        {/* 🔹 Globo de presentación */}
        {showIntroBubble && !isOpen && (
          <div
            className="bg-light border rounded shadow p-2 mb-2 bot-bubble position-relative"
            style={{
              position: 'absolute',
              bottom: '100%',
              right: '0',
              width: '230px',
              fontSize: '0.9rem',
            }}
          >
            <button
              onClick={closeIntroBubble}
              className="btn-close position-absolute top-0 end-0 me-1 mt-1"
              style={{ fontSize: '0.7rem' }}
              aria-label="Cerrar"
            ></button>
            👋 ¡Hola! Soy <strong>Coni-E</strong>, la asistente virtual de <strong>Conectar Inmobiliaria</strong>.<br />
            ¿Querés que te ayude?
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

      {/* 🔹 Ventana del chat */}
      {isOpen && (
        <div
          className="position-fixed bg-white border rounded shadow d-flex flex-column"
          style={{
            bottom: '90px',
            right: '20px',
            width: '300px',
            height: '420px',
            zIndex: 1040,
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-2 bg-primary text-white rounded-top">
            <strong>Coni-E • ChatBot</strong>
            <button
              onClick={closeChat}
              className="btn btn-sm btn-light text-primary"
              style={{ lineHeight: 1, padding: '0 6px' }}
            >
              ✕
            </button>
          </div>

          <div className="flex-grow-1 p-2 overflow-auto" ref={scrollRef} style={{ backgroundColor: '#f8f9fa' }}>
            {renderMessages()}

            {awaitingOption && (
              <div className="mt-2">
                {[
                  'Compraventa de Inmuebles',
                  'Alquileres',
                  'Asesoramiento Legal y Financiero',
                  'Administración de Propiedades',
                  'Tasación',
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="btn btn-outline-primary btn-sm me-2 mb-2 w-100"
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

      {/* 🔹 Estilos */}
      <style jsx>{`
        .bot-bubble {
          position: relative;
        }
        .bot-bubble::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 20px;
          border-width: 8px 8px 0 8px;
          border-style: solid;
          border-color: #f8f9fa transparent transparent transparent;
        }
      `}</style>
    </>
  );
}
