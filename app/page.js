// app/page.js
'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Esta cuenta debe su pago
        </h1>
        <p className="mt-4 text-gray-700">
          Contacte con el administrador para regularizar la situación.
        </p>
      </div>
    </main>
  );
}
