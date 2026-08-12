import Layout from "@/Layouts/Layout";
import { Head, Link } from "@inertiajs/react";

export default function Closed({ meta }) {
    return (
        <Layout>
            <Head title={meta.title} />
            <div className="py-5">
                <div className="card-hero text-center py-5">
                    <div className="display-1 mb-3">
                        <i className="bi bi-calendar-x text-warning"></i>
                    </div>
                    <h2 className="mb-3">Pendaftaran Ditutup</h2>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: 480 }}>
                        Mohon maaf, pendaftaran Bantuan Modal (Banmod) sedang
                        ditutup sementara. Silakan kembali lagi nanti atau hubungi
                        pihak terkait untuk informasi lebih lanjut.
                    </p>
                    <Link href={route("home")} className="btn btn-primary btn-lg">
                        <i className="bi bi-house-door me-2"></i>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </Layout>
    );
}