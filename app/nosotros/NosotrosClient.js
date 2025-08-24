"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaInstagram,
  FaHandshake,
  FaLightbulb,
  FaStar,
  FaUsers,
} from "react-icons/fa";

export default function NosotrosClient() {
  const member = {
    name: "Nidia Paola Gauna (CEO)",
    bio: `Con más de 15 años de experiencia, se ha consolidado como una profesional clave en el ámbito de los bienes raíces de Misiones. 
    Su trayectoria combina conocimiento del mercado, formación continua y compromiso con la profesión como parte de la comisión directiva del Colegio de Corredores Públicos Inmobiliarios de Misiones (CCPIM).
    
    Además, es Técnica en Higiene y Seguridad Laboral, sumando una mirada integral en normativa y gestión de riesgos. 
    Reconocida por su ética, profesionalismo y cercanía, acompaña a cada cliente en cada paso, impulsando la calidad y seriedad en cada operación.`,
    image: "/equipo/paola.jpeg",
    alt: "Retrato de Nidia Paola Gauna",
    links: {
      facebook: "https://www.facebook.com/share/1GRaFFadtn/",
      instagram:
        "https://www.instagram.com/nidiagau?igsh=MXQ4aXhmOTRydDlpOQ==",
    },
  };

  const timeline = [
    {
      title: "Nuestra Misión",
      description:
        "Facilitar la compra, venta y alquiler de propiedades, conectando personas con sus futuros hogares mediante un servicio honesto y profesional.",
      icon: <FaHandshake className="text-primary fs-3" />,
    },
    {
      title: "Nuestra Visión",
      description:
        "Ser líderes en el mercado inmobiliario de Misiones, innovando en servicios y siendo la primera opción para soluciones confiables.",
      icon: <FaLightbulb className="text-warning fs-3" />,
    },
    {
      title: "Nuestros Valores",
      description:
        "Honestidad, profesionalismo, compromiso y empatía: pilares que guían cada relación con nuestros clientes y comunidad.",
      icon: <FaStar className="text-danger fs-3" />,
    },
    {
      title: "Nuestro Equipo",
      description:
        "Profesionales apasionados y en constante crecimiento, trabajando juntos para superar las expectativas de nuestros clientes.",
      icon: <FaUsers className="text-success fs-3" />,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-light text-center py-5">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fw-bold display-5"
        >
          Conectar Inmobiliaria
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-secondary fs-5 mt-3 px-3"
        >
          Más que una agencia, somos tu socio en el camino de encontrar el lugar
          perfecto para vivir o invertir.
        </motion.p>
      </section>

      {/* Timeline */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">Nuestra Historia</h2>
        <div className="position-relative">
          {/* Línea central */}
          <div className="position-absolute top-0 start-50 translate-middle-x h-100 border-end border-2 border-secondary"></div>
          <div className="row g-5">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className={`col-12 d-flex ${
                  index % 2 === 0
                    ? "justify-content-start"
                    : "justify-content-end"
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="card shadow-lg border-0 rounded-4 p-4 timeline-card w-75">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {item.icon}
                    <h4 className="fw-semibold m-0">{item.title}</h4>
                  </div>
                  <p className="text-secondary">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nidia - Tarjeta Horizontal */}
      <section className="container py-5">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="row g-0">
            {/* Imagen izquierda */}
            <div className="col-md-5">
              <Image
                src={member.image}
                alt={member.alt}
                width={600}
                height={700}
                className="w-100 h-100 object-fit-cover"
                priority
              />
            </div>
            {/* Texto derecha */}
            <div className="col-md-7">
              <div className="card-body p-4 d-flex flex-column h-100">
                <h3 className="card-title fw-bold mb-3">{member.name}</h3>
                <p
                  className="card-text text-secondary"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {member.bio}
                </p>
                <div className="mt-auto d-flex gap-3 pt-3">
                  <Link
                    href={member.links.facebook}
                    target="_blank"
                    aria-label={`${member.name} en Facebook`}
                    className="text-decoration-none"
                  >
                    <FaFacebook className="fs-4 text-primary" />
                  </Link>
                  <Link
                    href={member.links.instagram}
                    target="_blank"
                    aria-label={`${member.name} en Instagram`}
                    className="text-decoration-none"
                  >
                    <FaInstagram className="fs-4 text-danger" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
