type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
    return (
        <input
            {...props}
            className="w-full h-12 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}
