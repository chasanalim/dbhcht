import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AdminLayout header={<h2>Dashboard</h2>}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-4xl font-bold text-center mt-5">
                                Dashboard
                            </h3>

                            <h1 className="text-4xl p-5 font-bold text-center mt-5">
                                Coming soon
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
