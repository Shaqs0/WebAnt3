interface SvgIconProps {
  width?: number | string;
  height?: number | string;
  iconUrl: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SvgIcon({
	width = 24,
	height = 24,
	iconUrl,
	className,
	style = {},
}: SvgIconProps) {
	return (
		<div
			className={className}
			style={{
				width: typeof width === 'number' ? `${width}px` : width,
				height: typeof height === 'number' ? `${height}px` : height,
				display: 'inline-block',
				...style,
			}}
		>
			<img
				src={iconUrl}
				alt="icon"
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'contain',
				}}
			/>
		</div>
	);
}