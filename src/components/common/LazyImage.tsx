import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  effect?: "blur" | "opacity" | "black-and-white";
  placeholderSrc?: string;
  fallbackSrc?: string; // 添加备用图片
  className?: string;
  wrapperClassName?: string;
  onClick?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  effect = "blur",
  placeholderSrc = "/images/placeholder.png", // 加载时的占位图
  fallbackSrc = "/images/fallback.png", // 加载失败时的备用图
  className = "",
  wrapperClassName = "",
  onClick,
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <LazyLoadImage
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      effect={effect}
      placeholderSrc={placeholderSrc}
      onError={handleError}
      className={`${className} ${error ? "error-image" : ""}`}
      wrapperClassName={wrapperClassName}
      onClick={onClick}
    />
  );
};

export default LazyImage;
