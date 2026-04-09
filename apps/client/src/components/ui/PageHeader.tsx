type Props = {
    title: string;
};

export default function PageHeader({ title }: Props) {
    return (
        <div className="pb-2 border-b">
            <h1 className="text-xl font-semibold">{title}</h1>
        </div>
    );
}
