import { EntryForm } from "../../_components/EntryForm";

export default function LogsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8">
                <h1 className="text-2xl font-bold">Log Your Time</h1>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">New Entry</h2>
                <EntryForm />
            </div>
        </div>
    );
}