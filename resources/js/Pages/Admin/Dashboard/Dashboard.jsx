import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, Row, Col, Container, Form } from "react-bootstrap";

export default function Dashboard({
    banmod,
    umkm,
    kerja,
    pertanian,
    pelatihan_banmod,
    ekraf,
    can,
    selected_year,
    banmod_registration_open,
}) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.includes("admin");

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "terverifikasi":
                return "text-success";
            case "ditolak":
                return "text-danger";
            case "belum lengkap":
            case "belum upload":
            case "belum terverifikasi":
                return "text-warning";
            default:
                return "";
        }
    };

    const createPieChartOptions = (title, data) => ({
        chart: { type: "pie" },
        title: { text: title },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                },
            },
        },
        series: [
            {
                name: "Pendaftar",
                colorByPoint: true,
                data: data,
            },
        ],
    });

    const createBarChartOptions = (title, data, vertical = false) => ({
        chart: {
            type: vertical ? "column" : "bar",
            height: 400, // Tambahkan tinggi chart
        },
        title: { text: title },
        xAxis: {
            categories: data.map((item) => item.name),
            crosshair: true,
        },
        yAxis: [
            {
                min: 0,
                title: { text: "Jumlah Pendaftar" },
            },
        ],
        tooltip: {
            shared: true,
        },
        series: [
            {
                name: "Pendaftar",
                data: data.map((item) => item.pendaftar || item.y),
            },
            // Tampilkan jumlah Lolos & Tidak Lolos jika tersedia
            ...(data[0]?.lolos !== undefined
                ? [
                      {
                          name: "Lolos",
                          data: data.map((item) => item.lolos),
                          color: "#28a745",
                      },
                  ]
                : []),
            ...(data[0]?.tidak_lolos !== undefined
                ? [
                      {
                          name: "Tidak Lolos",
                          data: data.map((item) => item.tidak_lolos),
                          color: "#dc3545",
                      },
                  ]
                : []),
            // Hanya tampilkan RAB jika ada datanya
            ...(data[0]?.rab
                ? [
                      {
                          name: "RAB",
                          yAxis: 1,
                          data: data.map((item) => item.rab),
                          tooltip: {
                              valuePrefix: "Rp ",
                          },
                      },
                  ]
                : []),
        ],
    });

    return (
        <AdminLayout header={<h2 className="h3 mb-0">Dashboard</h2>}>
            <Head title="Dashboard" />

            {selected_year && (
                <div className="alert alert-info mb-0 py-2 small">
                    <strong>Tahun Pelaksanaan:</strong> {selected_year}
                </div>
            )}

            {/* Banmod Section */}
            {can.viewBanmod && (
                <DashboardSection
                    type="banmod"
                    title="Dashboard Bantuan Modal"
                    registrationOpen={banmod_registration_open}
                    onToggleRegistration={() =>
                        router.post(
                            route("admin.banmod.registration-status"),
                            { open: !banmod_registration_open },
                            {
                                preserveScroll: true,
                                onSuccess: () => router.reload(),
                                onError: () =>
                                    console.error(
                                        "Gagal mengubah status pendaftaran"
                                    ),
                            }
                        )
                    }
                    isAdmin={isAdmin}
                    summary={banmod.summary}
                    charts={[
                        {
                            title: "Sebaran Kategori",
                            options: createPieChartOptions(
                                "Sebaran Kategori",
                                banmod.byKategori
                            ),
                        },
                        {
                            title: "Sebaran Kecamatan",
                            options: createBarChartOptions(
                                "Sebaran per Kecamatan",
                                banmod.byKecamatan,
                                true
                            ),
                        },
                        {
                            title: "Sebaran Jenis Usaha",
                            options: createBarChartOptions(
                                "Sebaran Jenis Usaha",
                                banmod.byJenisUsaha
                            ),
                        },
                        {
                            title: "Status Verifikasi",
                            options: createPieChartOptions(
                                "Status Verifikasi Dokumen",
                                banmod.byVerifikasiDokumen
                            ),
                        },
                    ]}
                    data={banmod.byKelurahan}
                />
            )}

            {/* UMKM Section */}
            {can.viewUmkm && (
                <DashboardSection
                    type="umkm"
                    title="Dashboard UMKM"
                    isAdmin={isAdmin}
                    summary={umkm.summary}
                    charts={[
                        {
                            title: "Sebaran Kecamatan",
                            options: createBarChartOptions(
                                "Sebaran per Kecamatan",
                                umkm.byKecamatan,
                                true
                            ),
                        },
                        {
                            title: "Jenis Pelatihan Prioritas 1",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                umkm.byPrioritas1
                            ),
                        },
                        {
                            title: "Jenis Pelatihan Prioritas 2",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                umkm.byPrioritas2
                            ),
                        },
                        {
                            title: "Jenis Pelatihan Prioritas 3",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                umkm.byPrioritas3
                            ),
                        },
                        {
                            title: "Status Verifikasi",
                            options: createPieChartOptions(
                                "Status Verifikasi Dokumen",
                                umkm.byVerifikasiDokumen
                            ),
                        },
                    ]}
                    data={umkm.byKelurahan}
                />
            )}

            {/* Kerja Section */}
            {can.viewKerja && (
                <DashboardSection
                    type="kerja"
                    title="Dashboard Pelatihan Kerja"
                    isAdmin={isAdmin}
                    summary={kerja.summary}
                    charts={[
                        {
                            title: "Sebaran Kecamatan",
                            options: createBarChartOptions(
                                "Sebaran per Kecamatan",
                                kerja.byKecamatan,
                                true
                            ),
                        },
                        {
                            title: "Pendidikan",
                            options: createPieChartOptions(
                                "Tingkat Pendidikan",
                                kerja.byPendidikan
                            ),
                        },
                        {
                            title: "Jenis Pelatihan",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                kerja.byJenisPelatihan
                            ),
                        },
                        {
                            title: "Status Verifikasi",
                            options: createPieChartOptions(
                                "Status Verifikasi Dokumen",
                                kerja.byVerifikasiDokumen
                            ),
                        },
                    ]}
                    data={kerja.byKelurahan}
                />
            )}

            {/* Pelatihan Banmod Section */}
            {can.viewPelatihanBanmod && (
                <DashboardSection
                    type="pelatihan_banmod"
                    title="Dashboard Pelatihan Penerima Banmod"
                    isAdmin={isAdmin}
                    summary={pelatihan_banmod.summary}
                    charts={[
                        {
                            title: "Sebaran Tahun Pemerimaan",
                            options: createPieChartOptions(
                                "Tahun Penerimaan",
                                pelatihan_banmod.byTahunPenerimaan,
                                true
                            ),
                        },
                        {
                            title: "Sebaran Kecamatan",
                            options: createBarChartOptions(
                                "Sebaran per Kecamatan",
                                pelatihan_banmod.byKecamatan,
                                true
                            ),
                        },
                        {
                            title: "Jenis Pelatihan",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                pelatihan_banmod.byJenisPelatihan
                            ),
                        },
                        {
                            title: "Status Verifikasi",
                            options: createPieChartOptions(
                                "Status Verifikasi Dokumen",
                                pelatihan_banmod.byVerifikasiDokumen
                            ),
                        },
                    ]}
                    data={pelatihan_banmod.byKelurahan}
                />
            )}

            {/* Pertanian Section */}
            {can.viewPertanian && (
                <DashboardSection
                    type="pertanian"
                    title="Dashboard Pelatihan Pertanian"
                    isAdmin={isAdmin}
                    summary={pertanian.summary}
                    charts={[
                        {
                            title: "Sebaran Kecamatan",
                            options: createBarChartOptions(
                                "Sebaran per Kecamatan",
                                pertanian.byKecamatan,
                                true
                            ),
                        },
                        {
                            title: "Jenis Pelatihan",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                pertanian.byJenisPelatihan
                            ),
                        },
                        {
                            title: "Status Verifikasi",
                            options: createPieChartOptions(
                                "Status Verifikasi Dokumen",
                                pertanian.byVerifikasiDokumen
                            ),
                        },
                    ]}
                    data={pertanian.byKelurahan}
                />
            )}

            {/* Ekraf Section */}
            {can.viewEkraf && (
                <DashboardSection
                    type="ekraf"
                    title="Dashboard Pelatihan Ekonomi Kreatif"
                    isAdmin={isAdmin}
                    summary={ekraf.summary}
                    charts={[
                        {
                            title: "Sebaran Kecamatan",
                            options: createBarChartOptions(
                                "Sebaran per Kecamatan",
                                ekraf.byKecamatan,
                                true
                            ),
                        },
                        {
                            title: "Jenis Pelatihan",
                            options: createBarChartOptions(
                                "Jenis Pelatihan",
                                ekraf.byJenisPelatihan
                            ),
                        },
                        {
                            title: "Status Verifikasi",
                            options: createPieChartOptions(
                                "Status Verifikasi Dokumen",
                                ekraf.byVerifikasiDokumen
                            ),
                        },
                    ]}
                    data={ekraf.byKelurahan}
                />
            )}
        </AdminLayout>
    );
}

const DASHBOARD_THEMES = {
    banmod: {
        headerBg: "bg-primary-head",
        sectionBg: "bg-primary-subtle",
    },
    umkm: {
        headerBg: "bg-success-head",
        sectionBg: "bg-success-subtle",
    },
    kerja: {
        headerBg: "bg-info-head",
        sectionBg: "bg-info-subtle",
    },
    pelatihan_banmod: {
        headerBg: "bg-warning-head",
        sectionBg: "bg-warning-subtle",
    },
    pertanian: {
        headerBg: "bg-danger-head",
        sectionBg: "bg-danger-subtle",
    },
    ekraf: {
        headerBg: "bg-primary-head",
        sectionBg: "bg-primary-subtle",
    },
};
const CircularProgress = ({ value, color, size = 60 }) => {
    const radius = size * 0.4;
    const circumference = radius * 2 * Math.PI;
    const progress = ((100 - value) / 100) * circumference;

    return (
        <div className="position-relative d-inline-flex align-items-center justify-content-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`text-${color}`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className={`position-absolute text-${color} fw-bold`}>
                {value}%
            </span>
        </div>
    );
};
// DashboardSection Component
const DashboardSection = ({
    title,
    summary,
    charts,
    data,
    type = "banmod",
    registrationOpen,
    onToggleRegistration,
    isAdmin,
}) => {
    const theme = DASHBOARD_THEMES[type];

    return (
        <Container
            fluid
            className={`dashboard-section py-5 ${theme.sectionBg}`}
        >
            {/* Header Card */}
            <Card
                className={`border-0 ${theme.headerBg} text-white shadow-lg mb-4 rounded-4`}
            >
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className="h2 mb-0">{title}</h3>
                        <div className="d-flex align-items-center gap-3">
                            {registrationOpen !== undefined && isAdmin && (
                                <div className="d-flex align-items-center gap-2">
                                    <span
                                        className={`fw-semibold small ${
                                            registrationOpen
                                                ? "text-success"
                                                : "text-warning"
                                        }`}
                                    >
                                        {registrationOpen
                                            ? "Pendaftaran Terbuka"
                                            : "Pendaftaran Ditutup"}
                                    </span>
                                    <Form.Check
                                        type="switch"
                                        id={`registration-switch-${type}`}
                                        checked={registrationOpen}
                                        onChange={onToggleRegistration}
                                    />
                                </div>
                            )}
                            <div className="dashboard-date h5">
                                {new Date().toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Summary Stats */}
            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="stat-icon bg-info p-3 rounded-3 mb-3">
                                        <i className="bi bi-people fs-4 text-white"></i>
                                    </div>
                                    <h6 className="text-muted text-uppercase small ms-2">
                                        Total Pendaftar
                                    </h6>
                                </div>
                            </div>
                            <h1 className="fw-bold mb-0">
                                {summary.total_pendaftar}
                            </h1>
                            {/* <div className="d-flex align-items-center justify-content-between text-muted small">
                            <span>Total Progress</span>
                            <span className="fw-semibold">
                                {summary.total_pendaftar} Pendaftar
                            </span>
                        </div> */}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="stat-icon bg-success p-3 rounded-3 mb-3">
                                        <i className="bi bi-check-circle fs-4 text-white"></i>
                                    </div>
                                    <h6 className="text-muted text-uppercase small ms-2">
                                        Dokumen Terverifikasi
                                    </h6>
                                </div>
                                <CircularProgress
                                    value={Math.round(
                                        (summary.total_pendaftar_lulus /
                                            summary.total_pendaftar) *
                                            100
                                    )}
                                    color="success"
                                />
                            </div>
                            <h1 className="fw-bold text-success mb-0">
                                {summary.total_pendaftar_lulus}
                            </h1>
                            {/* <div className="d-flex align-items-center justify-content-between text-muted small">
                            <span>Dari Total</span>
                            <span className="fw-semibold">
                                {summary.total_pendaftar} Pendaftar
                            </span>
                        </div> */}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="stat-icon bg-danger p-3 rounded-3 mb-3">
                                        <i className="bi bi-x-circle fs-4 text-white"></i>
                                    </div>
                                    <h6 className="text-muted text-uppercase small ms-2">
                                        Dokumen Ditolak
                                    </h6>
                                </div>
                                <CircularProgress
                                    value={Math.round(
                                        (summary.total_pendaftar_tidak_lulus /
                                            summary.total_pendaftar) *
                                            100
                                    )}
                                    color="danger"
                                />
                            </div>
                            <h1 className="fw-bold text-danger mb-0">
                                {summary.total_pendaftar_tidak_lulus}
                            </h1>
                            {/* <div className="d-flex align-items-center justify-content-between text-muted small">
                            <span>Dari Total</span>
                            <span className="fw-semibold">
                                {summary.total_pendaftar} Pendaftar
                            </span>
                        </div> */}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center">
                                    <div className="stat-icon bg-warning p-3 rounded-3 mb-3">
                                        <i className="bi bi-clock fs-4 text-white"></i>
                                    </div>
                                    <h6 className="text-muted text-uppercase small ms-2">
                                        Dokumen Belum Diverifikasi
                                    </h6>
                                </div>
                                <CircularProgress
                                    value={Math.round(
                                        (summary.total_pendaftar_belum_verifikasi /
                                            summary.total_pendaftar) *
                                            100
                                    )}
                                    color="warning"
                                />
                            </div>
                            <h1 className="fw-bold text-warning mb-0">
                                {summary.total_pendaftar_belum_verifikasi}
                            </h1>
                            {/* <div className="d-flex align-items-center justify-content-between text-muted small">
                            <span>Dari Total</span>
                            <span className="fw-semibold">
                                {summary.total_pendaftar} Pendaftar
                            </span>
                        </div> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Status summary: Lolos / Tidak Lolos / Diterima Pelatihan Lain */}
            <Row className="g-4 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-2">
                                <div className="stat-icon bg-success p-3 rounded-3 mb-3 me-2">
                                    <i className="bi bi-trophy fs-4 text-white"></i>
                                </div>
                                <h6 className="text-muted text-uppercase small">
                                    Peserta Lolos
                                </h6>
                            </div>
                            <h1 className="fw-bold text-success mb-0">
                                {summary.total_pendaftar_lulus}
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-2">
                                <div className="stat-icon bg-danger p-3 rounded-3 mb-3 me-2">
                                    <i className="bi bi-x-octagon fs-4 text-white"></i>
                                </div>
                                <h6 className="text-muted text-uppercase small">
                                    Peserta Tidak Lolos
                                </h6>
                            </div>
                            <h1 className="fw-bold text-danger mb-0">
                                {summary.total_pendaftar_tidak_lulus}
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 stat-card">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-2">
                                <div className="stat-icon bg-primary p-3 rounded-3 mb-3 me-2">
                                    <i className="bi bi-arrow-left-right fs-4 text-white"></i>
                                </div>
                                <h6 className="text-muted text-uppercase small">
                                    Diterima Pelatihan Lain
                                </h6>
                            </div>
                            <h1 className="fw-bold text-primary mb-0">
                                {summary.total_diterima_lain ?? 0}
                            </h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row className="g-4 mb-4">
                {charts.map((chart, index) => (
                    <Col md={6} key={index}>
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Body className="p-4">
                                <h5 className="card-title mb-4">
                                    {chart.title}
                                </h5>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={chart.options}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Kelurahan Data */}
            {data && data.length > 0 && (
                <Row className="g-4">
                    {data.map((kecamatan, index) => (
                        <Col lg={4} md={6} key={index}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Header className="bg-light border-0 pt-4 pb-3 px-4">
                                    <h5 className="mb-0">{kecamatan.name}</h5>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="border-0">
                                                        No
                                                    </th>
                                                    <th className="border-0">
                                                        Kelurahan
                                                    </th>
                                                    <th className="border-0 text-end">
                                                        Pendaftar
                                                    </th>
                                                    <th className="border-0 text-end">
                                                        Lolos
                                                    </th>
                                                    <th className="border-0 text-end">
                                                        Tidak Lolos
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {kecamatan.kelurahan.map(
                                                    (kel, idx) => (
                                                        <tr key={idx}>
                                                            <td width="40">
                                                                {idx + 1}
                                                            </td>
                                                            <td>{kel.name}</td>
                                                            <td className="text-end fw-semibold">
                                                                {kel.total}
                                                            </td>
                                                            <td className="text-end fw-semibold text-success">
                                                                {kel.lolos ?? 0}
                                                            </td>
                                                            <td className="text-end fw-semibold text-danger">
                                                                {kel.tidak_lolos ?? 0}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr className="border-top">
                                                    <td
                                                        colSpan="2"
                                                        className="fw-bold"
                                                    >
                                                        Total
                                                    </td>
                                                    <td className="text-end fw-bold">
                                                        {kecamatan.kelurahan.reduce(
                                                            (sum, kel) =>
                                                                sum + kel.total,
                                                            0
                                                        )}
                                                    </td>
                                                    <td className="text-end fw-bold text-success">
                                                        {kecamatan.kelurahan.reduce(
                                                            (sum, kel) =>
                                                                sum + (kel.lolos ?? 0),
                                                            0
                                                        )}
                                                    </td>
                                                    <td className="text-end fw-bold text-danger">
                                                        {kecamatan.kelurahan.reduce(
                                                            (sum, kel) =>
                                                                sum + (kel.tidak_lolos ?? 0),
                                                            0
                                                        )}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};
