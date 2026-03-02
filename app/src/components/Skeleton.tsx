interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string;
    height?: string;
    className?: string;
}

const Skeleton = ({ variant = 'text', width, height, className = '' }: SkeletonProps) => {
    const baseClass = 'animate-pulse bg-gradient-to-r from-[var(--bg-primary)] via-[var(--border)] to-[var(--bg-primary)] bg-[length:200%_100%]';

    const variants = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-xl',
    };

    const style: React.CSSProperties = {
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'text' ? '16px' : variant === 'circular' ? '40px' : '120px'),
    };

    return (
        <div
            className={`${baseClass} ${variants[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
