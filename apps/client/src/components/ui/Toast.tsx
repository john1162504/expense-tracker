import { useEffect, useState } from "react";

export default function Toast() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        const handler = (e: any) => {
            setMessage(e.detail);

            setTimeout(() => {
                setMessage("");
            }, 3000);
        };

        window.addEventListener("api-error", handler);

        return () => window.removeEventListener("api-error", handler);
    }, []);

    if (!message) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-xl shadow">
            {message}
        </div>
    );
}
