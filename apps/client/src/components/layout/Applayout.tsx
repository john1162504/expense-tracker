import Toast from "../ui/Toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen">
                <div className="p-4 space-y-6">{children}</div>
            </div>
            <Toast />
        </div>
    );
}
