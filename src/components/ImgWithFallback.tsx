'use client';

type Props = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

export function ImgWithFallback({ src, alt, className, style }: Props) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
