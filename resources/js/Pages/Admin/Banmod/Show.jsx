import AdminLayout from "@/Layouts/admin/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Show({ title, data }) {
    const renderFilePreview = (url, label) => {
        if (!url) return null;

        const extension = url.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png", "gif"].includes(extension);

        return (
            <div className="col-md-4 mb-4">
                <div className="card h-100">
                    <div className="card-header">
                        <h6 className="fw-bold mb-0">{label}</h6>
                    </div>
                    <div className="card-body d-flex flex-column">
                        {isImage ? (
                            <div
                                className="text-center mb-3"
                                style={{ height: "200px" }}
                            >
                                <img
                                    src={url}
                                    alt={label}
                                    className="img-fluid h-100 object-fit-cover"
                                />
                            </div>
                        ) : (
                            <div className="ratio ratio-16x9 mb-3">
                                <embed
                                    src={url}
                                    type="application/pdf"
                                    className="w-100 h-100"
                                />
                            </div>
                        )}
                        <a
                            href={url}
                            className="btn btn-sm btn-primary mt-auto"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-eye me-1"></i>
                            Lihat File
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AdminLayout>
            <Head title={title} />

            <div className="container-fluid py-4">
                <div className="card">
                    <div className="card-header">
                        <h5 className="fw-bold mb-0">{title}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6 className="fw-bold">Data Pribadi</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>NIK</td>
                                            <td>: {data.nik}</td>
                                        </tr>
                                        <tr>
                                            <td>No. KK</td>
                                            <td>: {data.kk}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama</td>
                                            <td>: {data.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Tempat Lahir</td>
                                            <td>: {data.tmp_lhr}</td>
                                        </tr>
                                        <tr>
                                            <td>Tanggal Lahir</td>
                                            <td>: {data.tgl_lhr}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis Kelamin</td>
                                            <td>
                                                :
                                                {data.jenis_kelamin === "L"
                                                    ? " Laki-laki"
                                                    : " Perempuan"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>No. HP</td>
                                            <td>: {data.phone_number}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <h6 className="fw-bold mt-4">Alamat</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Alamat KTP</td>
                                            <td>: {data.alamat}</td>
                                        </tr>
                                        <tr>
                                            <td>RT/RW</td>
                                            <td>
                                                : {data.rt}/{data.rw}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Kelurahan</td>
                                            <td>: {data.kelurahan}</td>
                                        </tr>
                                        <tr>
                                            <td>Kecamatan</td>
                                            <td>: {data.kecamatan}</td>
                                        </tr>
                                        {data.isDomisili && (
                                            <tr>
                                                <td>Alamat Domisili</td>
                                                <td>
                                                    :{" "}
                                                    {data.isDomisili === "0"
                                                        ? " Sesuai KTP"
                                                        : data.alamat_domisili}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold">Data Usaha</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Kategori</td>
                                            <td>: {data.kategori}</td>
                                        </tr>
                                        <tr>
                                            <td>Klaster Usaha</td>
                                            <td>: {data.klaster_usaha}</td>
                                        </tr>
                                        {data.isUsaha && (
                                            <tr>
                                                <td>Alamat Usaha</td>
                                                <td>
                                                    :{" "}
                                                    {data.isUsaha === "0"
                                                        ? " Sesuai KTP"
                                                        : data.alamat_usaha}
                                                </td>
                                                {(data.kategori_id === "1" ||
                                                    data.kategori_id === "2" ||
                                                    data.kategori_id ===
                                                        "3") && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? 3
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? 2
                                                                : 1}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? (4 / 4) * 15
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? (3 / 4) * 15
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? (2 / 4) * 15
                                                                : (1 / 4) * 15}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "4" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? 3
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? 2
                                                                : 1}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? (4 / 4) * 5
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? (3 / 4) * 5
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? (2 / 4) * 5
                                                                : (1 / 4) * 5}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "5" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? 4
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? 3
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? 2
                                                                : 1}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {data.isDomisili ===
                                                                "0" &&
                                                            data.isUsaha === "0"
                                                                ? (4 / 4) * 10
                                                                : data.isDomisili ===
                                                                      "0" &&
                                                                  data.isUsaha ===
                                                                      "1"
                                                                ? (3 / 4) * 10
                                                                : data.isDomisili ===
                                                                      "1" &&
                                                                  data.isUsaha ===
                                                                      "0"
                                                                ? (2 / 4) * 10
                                                                : (1 / 4) * 10}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )}
                                        {data.kategori_id === "5" && (
                                            <>
                                                <tr>
                                                    <td>Tanggungan Keluarga</td>
                                                    <td>
                                                        :{" "}
                                                        {
                                                            data.tanggungan_keluarga
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {
                                                            data.skor_tanggungan_keluarga
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_tanggungan_keluarga /
                                                                3) *
                                                                20
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Status Tempat Tinggal
                                                    </td>
                                                    <td>
                                                        :{" "}
                                                        {
                                                            data.status_tempat_tinggal
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {
                                                            data.skor_status_tempat_tinggal
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_status_tempat_tinggal /
                                                                3) *
                                                                20
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                        <tr>
                                            <td>Lama Usaha</td>
                                            <td>: {data.lama_usaha}</td>
                                            {(data.kategori_id === "1" ||
                                                data.kategori_id === "2" ||
                                                data.kategori_id === "3") && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_lama_usaha}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {(data.skor_lama_usaha /
                                                            4) *
                                                            25}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "4" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_lama_usaha}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {(data.skor_lama_usaha /
                                                            4) *
                                                            15}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "5" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_lama_usaha}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {(data.skor_lama_usaha /
                                                            4) *
                                                            15}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        {data.kategori_id !== "5" && (
                                            <tr>
                                                <td>Jumlah Tenaga Kerja</td>
                                                <td>: {data.jumlah_tenaga}</td>
                                                {(data.kategori_id === "1" ||
                                                    data.kategori_id === "2" ||
                                                    data.kategori_id ===
                                                        "3") && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {
                                                                data.skor_jumlah_tenaga
                                                            }
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {(data.skor_jumlah_tenaga /
                                                                4) *
                                                                35}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "4" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {
                                                                data.skor_jumlah_tenaga
                                                            }
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {(data.skor_jumlah_tenaga /
                                                                4) *
                                                                10}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )}
                                        {data.kategori_id !== "5" && (
                                            <tr>
                                                <td>Omzet per Bulan</td>
                                                <td>: {data.bruto}</td>
                                                {(data.kategori_id === "1" ||
                                                    data.kategori_id === "2" ||
                                                    data.kategori_id ===
                                                        "3") && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.skor_bruto}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {(data.skor_bruto /
                                                                4) *
                                                                20}
                                                        </td>
                                                    </>
                                                )}
                                                {data.kategori_id === "4" && (
                                                    <>
                                                        <td className="text-danger text-bold">
                                                            Skor :{" "}
                                                            {data.skor_bruto}
                                                        </td>
                                                        <td className="text-danger text-bold">
                                                            NA :{" "}
                                                            {(data.skor_bruto /
                                                                4) *
                                                                5}
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )}

                                        <tr>
                                            <td>Aset</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.aset
                                                ).toLocaleString()}
                                            </td>
                                            {(data.kategori_id === "1" ||
                                                data.kategori_id === "2" ||
                                                data.kategori_id === "3") && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? 2
                                                            : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? (3 / 3) * 5
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? parseFloat(
                                                                  (2 / 3) * 5
                                                              ).toFixed(2)
                                                            : parseFloat(
                                                                  (1 / 3) * 5
                                                              ).toFixed(2)}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "4" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? 2
                                                            : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? (3 / 3) * 5
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? parseFloat(
                                                                  (2 / 3) * 5
                                                              ).toFixed(2)
                                                            : parseFloat(
                                                                  (1 / 3) * 5
                                                              ).toFixed(2)}
                                                    </td>
                                                </>
                                            )}
                                            {data.kategori_id === "5" && (
                                                <>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {Number(data.aset) >
                                                        Number(data.hutang)
                                                            ? 3
                                                            : Number(
                                                                  data.aset
                                                              ) ===
                                                              Number(
                                                                  data.hutang
                                                              )
                                                            ? 2
                                                            : 1}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {Math.round(
                                                            Number(data.aset) >
                                                                Number(
                                                                    data.hutang
                                                                )
                                                                ? (3 / 3) * 10
                                                                : Number(
                                                                      data.aset
                                                                  ) ===
                                                                  Number(
                                                                      data.hutang
                                                                  )
                                                                ? parseFloat(
                                                                      (2 / 3) *
                                                                          10
                                                                  ).toFixed(2)
                                                                : parseFloat(
                                                                      (1 / 3) *
                                                                          10
                                                                  ).toFixed(2)
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        <tr>
                                            <td>Hutang</td>
                                            <td>
                                                : Rp{" "}
                                                {Number(
                                                    data.hutang
                                                ).toLocaleString()}
                                            </td>
                                        </tr>

                                        {data.kategori_id === "4" && (
                                            <>
                                                <tr>
                                                    <td>Jumlah Legalitas</td>
                                                    <td>
                                                        :{" "}
                                                        {data.jumlah_legalitas}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_legalitas}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_legalitas /
                                                                3) *
                                                                10
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Jumlah Teknologi</td>
                                                    <td>
                                                        :{" "}
                                                        {data.jumlah_teknologi}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {data.skor_teknologi}
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_teknologi /
                                                                3) *
                                                                10
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Penyerapan Tenaga Kerja
                                                    </td>
                                                    <td>
                                                        :{" "}
                                                        {
                                                            data.jumlah_penyerapan_naker
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        Skor :{" "}
                                                        {
                                                            data.skor_penyerapan_naker
                                                        }
                                                    </td>
                                                    <td className="text-danger text-bold">
                                                        NA :{" "}
                                                        {parseFloat(
                                                            (data.skor_penyerapan_naker /
                                                                3) *
                                                                10
                                                        ).toFixed(2)}
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>

                                <h6 className="fw-bold">SKORING</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr>
                                            <td>Skor Sementara</td>
                                            <td>: {data.skor}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h6 className="fw-bold mb-3">Dokumen</h6>
                            <div className="row">
                                {/* Kelompok Dokumen Identitas */}
                                {renderFilePreview(data.files.foto, "Foto")}
                                {renderFilePreview(data.files.ktp, "KTP")}
                                {renderFilePreview(
                                    data.files.kk,
                                    "Kartu Keluarga"
                                )}

                                {/* Kelompok Dokumen Usaha */}
                                {renderFilePreview(data.files.nib, "NIB")}
                                {renderFilePreview(data.files.sku, "SKU")}
                                {renderFilePreview(data.files.skd, "SKD")}
                                {renderFilePreview(
                                    data.files.produk,
                                    "Foto Produk"
                                )}
                                {renderFilePreview(
                                    data.files.pernyataan,
                                    "Surat Pernyataan"
                                )}

                                {/* Dokumen Perizinan */}
                                {data.files.perizinan?.map((url, index) =>
                                    renderFilePreview(
                                        url,
                                        `Perizinan ${index + 1}`
                                    )
                                )}

                                {/* Dokumen Tambahan */}
                                {renderFilePreview(data.files.siinas, "SIINAS")}
                                {renderFilePreview(
                                    data.files.bp,
                                    "Bukti Pembayaran"
                                )}
                                {renderFilePreview(
                                    data.files.sertifikat_pelatihan,
                                    "Sertifikat Pelatihan"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
