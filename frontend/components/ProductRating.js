/**
 * Componente de Formulario de Calificación de Productos
 * Permite a usuarios calificar y comentar productos
 */

import { useState } from 'react';

export default function ProductRating({ productId, productName, onRatingSubmit }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const ratingData = {
      productId,
      rating,
      comment,
      date: new Date().toISOString(),
      author: 'Usuario Anónimo',
    };

    onRatingSubmit?.(ratingData);
    alert('✓ ¡Gracias por tu reseña!');
    setComment('');
    setRating(5);
    setShowForm(false);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 border border-blue-500/20 rounded-lg p-6">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        ⭐ Calificar Producto
      </h3>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 py-2 rounded-lg text-white font-semibold transition"
        >
          Escribir Reseña
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div>
            <p className="text-sm text-gray-300 mb-2">Calificación: {rating} ⭐</p>
            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition transform hover:scale-125 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Tu Comentario (Opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              maxLength="500"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:border-yellow-500 focus:outline-none resize-none"
              placeholder="Cuéntanos tu experiencia con este producto..."
            />
            <p className="text-xs text-gray-400 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-white font-bold transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Publicar Reseña'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-white font-bold transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
