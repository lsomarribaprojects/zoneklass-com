'use client';

import { useState } from 'react';
import { seedMarketingLessons } from '@/actions/seed-marketing-lessons';

export default function SeedMarketingPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    setStatus('Iniciando inserción de lecciones...');

    try {
      const result = await seedMarketingLessons();

      if (result.success) {
        setStatus('✅ Éxito: 12 lecciones insertadas en módulos 0, 1 y 2');
      } else {
        setStatus(`❌ Error en módulo ${result.module}: ${result.error}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setStatus(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Seed Marketing Course Lessons</h1>
        <p className="text-gray-600 mb-6">
          Esto insertará 12 lecciones (4 por módulo) para los módulos 0, 1 y 2 del curso &quot;IA para Marketing y Negocios&quot;.
        </p>

        <button
          onClick={handleSeed}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Insertando...' : 'Insertar Lecciones'}
        </button>

        {status && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap font-mono text-sm">{status}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
