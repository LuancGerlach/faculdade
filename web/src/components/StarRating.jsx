export default function StarRating({ rating }) {
  const filledStars = Math.round(rating);
  return (
    <span className="stars" role="img" aria-label={`Avaliação ${rating.toFixed(1)} de 5`}>
      {'★'.repeat(filledStars)}{'☆'.repeat(5 - filledStars)}
    </span>
  );
}
