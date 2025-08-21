// app/nosotros/page.js
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nosotros | Conectar Inmobiliaria",
  description:
    "Conoce a Conectar Inmobiliaria: visión, misión y nuestro equipo.",
};

export default function NosotrosPage() {
  const member = {
    name: "Nidia Paola Gauna (CEO)",
    bio: `Con más de 15 años de experiencia, se ha consolidado como una profesional clave en el ámbito de los bienes raíces de la provincia de Misiones y una de las referentes más respetadas del rubro. 
    Su trayectoria combina una profunda experticia en el mercado inmobiliario con una sólida formación, capacitación constante y un compromiso activo con el crecimiento de la profesión formando parte de la comisión directiva del Colegio de Corredores Públicos Inmobiliarios de la provincia de Misiones (CCPIM). 
    Este rol la posiciona como una voz influyente en la toma de decisiones y en la promoción de las mejores prácticas dentro del sector, asegurando la ética, la profesionalidad y la defensa de los intereses tanto de sus colegas como de los clientes. 
    
    Además de su carrera en el sector inmobiliario, es técnica en Higiene y Seguridad Laboral Matriculada, una especialización que demuestra su enfoque integral y su capacidad para abordar el trabajo desde múltiples perspectivas. 
    Esta formación adicional le permite tener una comprensión más amplia de las normativas y la gestión de riesgos, aspectos cada vez más relevantes en transacciones comerciales y en el desarrollo de propiedades, con una labor reconocida por su profesionalismo y por su dedicación a la comunidad impulsando la calidad y la seriedad en cada operación, acompañando en cada paso a sus clientes.`,
    image: "/equipo/paola.jpeg",
    alt: "Retrato de Nidia Paola Gauna",
    links: {
      facebook: "https://www.facebook.com/share/1GRaFFadtn/",
      instagram:
        "https://www.instagram.com/nidiagau?igsh=MXQ4aXhmOTRydDlpOQ==",
    },
  };

  return (
    <div>
      {/* Visión y Misión */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-5">Visión y Misión</h2>

        <div className="row g-4 mb-5">
          {/* Visión */}
          <div className="col-md-6">
            <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden">
              <Image
                src="/nosotros/vision.gif"
                alt="Imagen ilustrativa de la visión de Conectar Inmobiliaria"
                width={600}
                height={300}
                className="w-100 object-fit-cover"
                priority
              />
              <div className="card-body p-4">
                <h3 className="card-title fw-semibold mb-3">Nuestra Visión</h3>
                <p className="card-text text-secondary">
                  Ser la inmobiliaria referente en el noreste argentino,
                  incorporando tecnología de vanguardia para ofrecer experiencias
                  ágiles y transparentes. Creemos que{" "}
                  <strong>“la llave está en tus manos”</strong> para encontrar el
                  espacio ideal, pues <strong>“tu vida merece un lugar”</strong>{" "}
                  donde crecer, prosperar y construir sueños.
                </p>
              </div>
            </div>
          </div>

          {/* Misión */}
          <div className="col-md-6">
            <div className="card h-100 shadow-lg border-0 rounded-4 overflow-hidden">
              <Image
                src="/nosotros/mision.jpg"
                alt="Imagen ilustrativa de la misión de Conectar Inmobiliaria"
                width={600}
                height={300}
                className="w-100 object-fit-cover"
                priority
              />
              <div className="card-body p-4">
                <h3 className="card-title fw-semibold mb-3">Nuestra Misión</h3>
                <p className="card-text text-secondary">
                  Poner al servicio de nuestros clientes más de 15 años de
                  experiencia en negocios inmobiliarios en el noreste argentino.
                  Ofrecemos un trato cercano y personalizado, gestión integral y
                  administración de propiedades en Posadas y las principales
                  ciudades de Misiones. Con profesionalismo y ética, acompañamos
                  cada paso para que cada proyecto inmobiliario sea un éxito.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-muted fs-5 px-3">
          En Conectar Inmobiliaria, nuestra trayectoria nos respalda y nuestra
          pasión nos impulsa: combinamos conocimiento local con herramientas
          digitales para facilitar cada operación. Creemos en la innovación
          continua, en la confianza como pilar y en la cercanía como valor
          diferencial. Porque más que propiedades, construimos relaciones y
          abrimos puertas a nuevas oportunidades.
        </p>
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
                <p className="card-text text-secondary" style={{ whiteSpace: "pre-line" }}>
                  {member.bio}
                </p>
                <div className="mt-auto d-flex gap-3 pt-3">
                  <Link
                    href={member.links.facebook}
                    target="_blank"
                    aria-label={`${member.name} en Facebook`}
                    className="text-decoration-none"
                  >
                    <i className="bi bi-facebook fs-4 text-primary"></i>
                  </Link>
                  <Link
                    href={member.links.instagram}
                    target="_blank"
                    aria-label={`${member.name} en Instagram`}
                    className="text-decoration-none"
                  >
                    <i className="bi bi-instagram fs-4 text-warning"></i>
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
