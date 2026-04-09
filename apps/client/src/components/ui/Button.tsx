type Variant = "primary" | "secondary" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
};

export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: Props) {
    const base =
        "w-full h-12 rounded-xl font-medium cursor-pointer transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<Variant, string> = {
        primary: "bg-black text-white hover:opacity-90",
        secondary: "bg-gray-200 text-black hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button
            {...props}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
