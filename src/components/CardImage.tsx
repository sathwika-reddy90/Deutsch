import { imageFile, type Category } from '../data/vocabulary';

interface CardImageProps {
  images: string[];
  category: Category;
  size?: 'large' | 'small';
  /** Text shown instead of the illustrations, e.g. "Aa". */
  glyph?: string;
}

/** One illustration, or a small group (e.g. four seasons) for plural/abstract words. */
export function CardImage({ images, category, size = 'large', glyph }: CardImageProps) {
  return (
    <div
      className={`card__image card__image--${size} card__image--count-${images.length} panel--${category.toLowerCase()}`}
      aria-hidden="true"
    >
      {glyph && <span className="card__glyph">{glyph}</span>}
      {images.map((source, i) => (
        <img
          key={`${source}-${i}`}
          src={`${import.meta.env.BASE_URL}vocab/${imageFile(source)}`}
          alt=""
          width={256}
          height={256}
          loading="lazy"
          draggable={false}
        />
      ))}
    </div>
  );
}
