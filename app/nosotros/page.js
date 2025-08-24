// app/nosotros/page.js
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Nosotros | Conectar Inmobiliaria",
  description:
    "Conoce a Conectar Inmobiliaria: visión, misión, valores y nuestro equipo.",
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
      {/* Quiénes Somos */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Quiénes Somos</h2>
        <p className="text-secondary fs-5 text-center px-3">
          Conectar Inmobiliaria es más que una agencia, somos tu socio en el camino
          de encontrar el lugar perfecto para vivir o invertir. Nos dedicamos a conectar
          personas con sus sueños a través de un servicio transparente, profesional y de
          alta calidad. Nuestro equipo está formado por expertos comprometidos en ofrecerte
          una experiencia inmobiliaria sin estrés, adaptada a tus necesidades.
        </p>
      </section>

      {/* Misión y Visión */}
      <section className="container py-5">
        <div className="row g-4">
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
                  Facilitar la compra, venta y alquiler de propiedades, creando
                  conexiones significativas entre personas y sus futuros hogares.
                  Nos esforzamos por ser la inmobiliaria de referencia, destacándonos
                  por nuestro profesionalismo, honestidad y un profundo conocimiento
                  del mercado.
                </p>
              </div>
            </div>
          </div>

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
                  Ser líderes en el mercado inmobiliario, reconocidos por nuestra
                  innovación, excelencia en el servicio al cliente y por ser la
                  primera opción para quienes buscan soluciones inmobiliarias confiables.
                  Queremos ser un pilar de confianza y crecimiento en la comunidad,
                  ayudando a construir el futuro de nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-4">Nuestros Valores</h2>
        <ul className="list-unstyled fs-5 text-secondary px-3">
          <li className="mb-2">
            <strong>• Honestidad:</strong> Actuamos con total transparencia en cada
            transacción, construyendo relaciones de confianza a largo plazo.
          </li>
          <li className="mb-2">
            <strong>• Profesionalismo:</strong> Nos formamos y actualizamos constantemente
            para ofrecer el mejor asesoramiento y servicio, garantizando resultados exitosos.
          </li>
          <li className="mb-2">
            <strong>• Compromiso:</strong> Nos dedicamos por completo a nuestros clientes,
            trabajando incansablemente para superar sus expectativas y lograr sus objetivos.
          </li>
          <li>
            <strong>• Empatía:</strong> Entendemos que cada cliente tiene una historia
            y una necesidad única. Nos ponemos en su lugar para ofrecer soluciones
            personalizadas y humanas.
          </li>
        </ul>
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
