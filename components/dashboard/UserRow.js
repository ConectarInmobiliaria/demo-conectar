// components/dashboard/UserRow.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UserRow({ user }) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);

  const handleChangeRole = async (e) => {
    const newRole = e.target.value;
    const res = await fetch('/api/dashboard/usuarios/role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, role: newRole }),
    });
    if (res.ok) {
      setRole(newRole);
      toast.success('Rol actualizado');
      router.refresh(); // refresca datos server-side
    } else {
      const data = await res.json();
      toast.error('Error: ' + (data.error || res.statusText));
    }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar al usuario ${user.email}? Esta acción no se puede deshacer.`)) return;
    const res = await fetch('/api/dashboard/usuarios/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    if (res.ok) {
      toast.success('Usuario eliminado');
      router.refresh();
    } else {
      const data = await res.json();
      toast.error('Error: ' + (data.error || res.statusText));
    }
  };

  return (
    <tr>
      <td>{user.name || '-'}</td>
      <td>{user.email}</td>
      <td>
        <select value={role} onChange={handleChangeRole} className="form-select form-select-sm">
          <option value="ADMIN">ADMIN</option>
          <option value="CORREDOR">CORREDOR</option>
          <option value="PROPIETARIO">PROPIETARIO</option>
          <option value="INQUILINO">INQUILINO</option>
        </select>
      </td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <button onClick={handleDelete} className="btn btn-sm btn-danger">
          Eliminar
        </button>
      </td>
    </tr>
  );
}
