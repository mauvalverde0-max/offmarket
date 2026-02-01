import { useRouter } from 'next/router';
import useSWR from 'swr';
import AlertForm from '@/components/AlertForm';
import Stars from '@/components/Stars';
import { apiCall } from '@/utils/fetcher';
import { useState } from 'react';

const fetcher = (url, token) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch');
    return r.json();
  });

export default function ProductDetail({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const { data: product, error, mutate } = useSWR(
    id ? `/api/products/${id}` : null,
    (url) => fetcher(url, token)
  );

  if (!id) return <div>Loading...</div>;
  if (error) return <div className="p-8">Product not found</div>;
  if (!product)
    return <div className="p-8">Loading product details...</div>;

  const handleRating = async (e) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }

    if (!rating) {
      alert('Please select a rating');
      return;
    }

    setSubmittingRating(true);
    try {
      await apiCall('POST', `/api/products/${id}/ratings`, { rating, comment }, token);
      setRating(0);
      setComment('');
      mutate();
      alert('Rating submitted!');
    } catch (err) {
      alert('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleCheckout = () => {
    if (product.website) {
      window.open(`${product.website}?product=${product.id}`, '_blank');
    } else {
      alert('Store checkout URL not available');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 hover:underline"
        >
          Back to products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="mb-4">
                  <Stars value={product.rating} />
                  <div className="text-sm text-gray-600 mt-1">
                    {product.rating ? `${product.rating.toFixed(1)}/5` : 'No ratings'} (
                    {product.rating_count || 0} reviews)
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{product.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="text-sm">
                    <strong>Store:</strong> {product.store_name}
                  </div>
                  {product.bulk_price && (
                    <div className="text-sm">
                      <strong>Bulk Price:</strong> ${product.bulk_price} (min:{' '}
                      {product.min_quantity})
                    </div>
                  )}
                  <div className="text-sm">
                    <strong>Stock:</strong> {product.stock_quantity || 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 h-fit">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-1">Regular Price</div>
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    ${product.price}
                  </div>
                  <div className="text-xs text-gray-500">{product.currency}</div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Go to Store Checkout
                  </button>

                  {token && (
                    <AlertForm
                      productId={parseInt(id)}
                      onAlertCreated={() => {
                        alert('Alert created successfully!');
                      }}
                      token={token}
                    />
                  )}

                  {!token && (
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      Login to Create Alerts
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4 mb-8">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Stars value={review.rating} />
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600 mb-8">No reviews yet</div>
              )}

              {token && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                  <form onSubmit={handleRating} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment (optional)
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingRating || !rating}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                    >
                      {submittingRating ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
