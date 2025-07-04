// app/nosotros/page.js
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Nosotros | Conectar Inmobiliaria',
  description: 'Conoce a Conectar Inmobiliaria: visión, misión y nuestro equipo.',
};

export default function NosotrosPage() {
  const team = [
    {
      name: 'Nidia Paola Gauna',
      title: 'Martillera Pública y Corredora Inmobiliaria. Matrícula N° 50 CCPIN',
      extra: [
        'Técnica en Higiene y Seguridad',
        'Miembro de la comisión directiva del CCPIM',
        'Coordinadora comisión de Mujeres inmobiliarias',
      ],
      image: '/equipo/paola.jpeg',
      links: { linkedin: '#', instagram: '#' },
    },
    {
      name: 'Fernando Javier A.',
      title: 'Martillero Público y Corredor Inmobiliario',
      extra: [],
      image: '/equipo/fernando.jpeg',
      links: { linkedin: '#', instagram: '#' },
    },
    {
      name: 'Milton M. De Campos',
      title: 'Asesor',
      extra: [
        'Experto en arquitectura de software y desarrollo de sistemas',
        '+20 años implementando soluciones tecnológicas para empresas líderes',
      ],
      image: '/equipo/milton.jpeg',
      links: { linkedin: '#', instagram: '#' },
    },
  ];

  return (
    <div>
      {/* Visión y Misión */}
      <section className="container py-5">
        <h2 className="text-center mb-4">Visión y Misión</h2>
        <div className="row g-4 mb-5">
          {/* Visión */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="overflow-hidden" style={{ height: '300px' }}>
                <Image
                  src="/nosotros/vision.jpg"
                  alt="Visión"
                  width={600}
                  height={300}
                  className="card-img-top object-fit-cover"
                />
              </div>
              <div className="card-body">
                <h3 className="card-title">Nuestra Visión</h3>
                <p className="card-text">
                  Ser la inmobiliaria referente en el noreste argentino, incorporando tecnología de vanguardia
                  para ofrecer experiencias ágiles y transparentes. Creemos que <strong>“la llave está en tus
                  manos”</strong> para encontrar el espacio ideal, pues <strong>“tu vida merece un lugar”</strong>
                  donde crecer, prosperar y construir sueños.
                </p>
              </div>
            </div>
          </div>
          {/* Misión */}
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="overflow-hidden" style={{ height: '300px' }}>
                <Image
                  src="/nosotros/mision.jpg"
                  alt="Misión"
                  width={600}
                  height={300}
                  className="card-img-top object-fit-cover"
                />
              </div>
              <div className="card-body">
                <h3 className="card-title">Nuestra Misión</h3>
                <p className="card-text">
                  Poner al servicio de nuestros clientes más de 15 años de experiencia en negocios inmobiliarios
                  en el noreste argentino. Ofrecemos un trato cercano y personalizado, gestión integral y
                  administración de propiedades en Posadas y las principales ciudades de Misiones. Con
                  profesionalismo y ética, acompañamos cada paso para que cada proyecto inmobiliario sea un éxito.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <p>
              En Conectar Inmobiliaria, nuestra trayectoria nos respalda y nuestra pasión nos impulsa: combinamos
              conocimiento local con herramientas digitales para facilitar cada operación. Creemos en la
              innovación continua, en la confianza como pilar y en la cercanía como valor diferencial. Porque más
              que propiedades, construimos relaciones y abrimos puertas a nuevas oportunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="container py-5">
        <h2 className="text-center mb-5">Nuestro Equipo</h2>
        <div className="row g-4">
          {team.map((member, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="card h-100 shadow-sm border-0">
                <div className="overflow-hidden" style={{ height: '250px' }}>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={250}
                    className="card-img-top object-fit-cover"
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{member.name}</h5>
                  <p className="card-subtitle mb-2 text-muted">{member.title}</p>
                  {member.extra.length > 0 && (
                    <ul className="list-unstyled mb-3">
                      {member.extra.map((item, i) => (
                        <li key={i} className="small mb-1">• {item}</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto d-flex gap-3">
                    <Link href={member.links.linkedin} target="_blank" className="text-decoration-none">
                      <i className="bi bi-linkedin fs-4 text-primary"></i>
                    </Link>
                    <Link href={member.links.instagram} target="_blank" className="text-decoration-none">
                      <i className="bi bi-instagram fs-4 text-warning"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
