// app/nosotros/page.js
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Nosotros | Conectar Inmobiliaria',
  description: 'Conoce al equipo de Conectar Inmobiliaria.',
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
    <section className="container py-5">
      <h2 className="text-center mb-5">Nuestro Equipo</h2>
      <div className="row g-4">
        {team.map((member, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card h-100 shadow-sm">
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
  );
}
