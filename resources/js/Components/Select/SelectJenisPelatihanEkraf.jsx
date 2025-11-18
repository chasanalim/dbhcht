import React, { Fragment, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";

export default function SelectJenisPelatihanEkraf({
    value = "",
    onChange = (item) => {},
    errors,
    quotaInfo = {}
}) {
    const [currentQuota, setCurrentQuota] = useState(quotaInfo);
    const [loading, setLoading] = useState(false);

    // Fetch real-time quota info
    const fetchQuotaInfo = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/pelatihan/ekonomi-kreatif/quota-info');
            if (response.data.success) {
                setCurrentQuota(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching quota:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch quota info saat component mount jika belum ada data
        if (Object.keys(currentQuota).length === 0) {
            fetchQuotaInfo();
        }
    }, []);

    // Generate options dengan info kuota
    const generateOptions = () => {
        const baseOptions = [
            { value: "fotografi", label: "Fotografi" },
            { value: "videografi", label: "Videografi" },
        ];

        return baseOptions.map(option => {
            const quota = currentQuota[option.value] || { 
                sisa: 0, 
                total_kuota: 0, 
                penuh: true 
            };

            return {
                ...option,
                label: quota.penuh 
                    ? `${option.label} (KUOTA PENUH)`
                    : `${option.label} (Sisa: ${quota.sisa}/${quota.total_kuota})`,
                isDisabled: quota.penuh,
                className: quota.penuh ? 'quota-full' : 'quota-available'
            };
        });
    };

    const options = generateOptions();

    // Custom styles untuk react-select
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.data.isDisabled 
                ? '#f8d7da' 
                : state.isSelected 
                    ? '#0d6efd' 
                    : state.isFocused 
                        ? '#e9ecef' 
                        : 'white',
            color: state.data.isDisabled 
                ? '#721c24' 
                : state.isSelected 
                    ? 'white' 
                    : '#212529',
            cursor: state.data.isDisabled ? 'not-allowed' : 'pointer',
            '&:hover': {
                backgroundColor: state.data.isDisabled 
                    ? '#f8d7da' 
                    : state.isSelected 
                        ? '#0d6efd' 
                        : '#e9ecef',
            }
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.data?.isDisabled ? '#721c24' : '#212529',
        }),
        control: (provided, state) => ({
            ...provided,
            borderColor: errors ? '#dc3545' : provided.borderColor,
            '&:hover': {
                borderColor: errors ? '#dc3545' : provided.borderColor,
            },
            boxShadow: state.isFocused && errors 
                ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' 
                : provided.boxShadow,
        })
    };

    return (
        <Fragment>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="required mb-0">Jenis Pelatihan</Form.Label>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={fetchQuotaInfo}
                    disabled={loading}
                    title="Refresh kuota"
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" />
                    ) : (
                        '🔄 Refresh'
                    )}
                </button>
            </div>

            <Select
                options={options}
                value={options.find(option => option.value === value)}
                onChange={(selectedOption) => {
                    if (!selectedOption?.isDisabled) {
                        onChange(selectedOption?.value || "");
                    }
                }}
                placeholder="Pilih jenis pelatihan..."
                isClearable
                styles={customStyles}
                isOptionDisabled={(option) => option.isDisabled}
                noOptionsMessage={() => "Tidak ada opsi tersedia"}
            />

            {/* Info kuota */}
            <div className="mt-2">
                <small className="text-muted d-block mb-1">
                    <strong>📊 Info Kuota Real-time:</strong>
                </small>
                <div className="row">
                    {Object.entries(currentQuota).map(([jenis, quota]) => (
                        <div key={jenis} className="col-md-6 mb-1">
                            <span className={`badge ${quota.penuh ? 'bg-danger' : 'bg-success'} me-1`}>
                                {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                            </span>
                            <small className={quota.penuh ? 'text-danger fw-bold' : 'text-success'}>
                                {quota.penuh 
                                    ? 'KUOTA PENUH' 
                                    : `${quota.sisa} tempat tersisa`
                                }
                            </small>
                        </div>
                    ))}
                </div>
                <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                    * Kuota dihitung berdasarkan pendaftar yang sudah diterima
                </small>
            </div>

            {/* Warning jika kuota hampir habis */}
            {Object.values(currentQuota).some(quota => quota.sisa <= 5 && !quota.penuh) && (
                <div className="alert alert-warning mt-2 py-2" style={{ fontSize: "12px" }}>
                    <i className="fa fa-exclamation-triangle me-1"></i>
                    <strong>Perhatian:</strong> Beberapa jenis pelatihan kuotanya hampir habis. Segera daftar!
                </div>
            )}

            {!!errors && (
                <Form.Text className="text-danger d-block mt-1">{errors}</Form.Text>
            )}
        </Fragment>
    );
}