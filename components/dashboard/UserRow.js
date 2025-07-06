// components/dashboard/UserRow.js
import Link from 'next/link';

export default function UserRow({ user }) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return (
    <tr>
      <td>{fullName || '—'}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <Link href={`/dashboard/usuarios/${user.id}`}      className="btn btn-sm btn-outline-info me-1">Ver</Link>
        <Link href={`/dashboard/usuarios/${user.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">Editar</Link>
        <Link href={`/dashboard/usuarios/${user.id}/delete`} className="btn btn-sm btn-outline-danger">Eliminar</Link>
      </td>
    </tr>
  );
}

