import React from 'react';

interface SvgIconProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  iconUrl: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export default function SvgIcon({
  width = 24,
  height = 24,
  iconUrl,
  className,
  style = {},
  alt = 'icon',
  ...rest  
}: SvgIconProps) {
  return (
    <div
      className={className}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'inline-block',
        cursor: rest.onClick ? 'pointer' : undefined, 
        ...style,
      }}
      {...rest}  
    >
      <img
        src={iconUrl}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}