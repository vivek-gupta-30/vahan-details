"use client";

import { useEffect, useState, useRef } from "react";
import useVahanVehicleDetails from "@/hooks/useVahanVehicleDetails";

const WATERMARK_TEXT = "VIVEK GUPTA";

const display = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value
      .map((item) => (Array.isArray(item) ? item[0] : item))
      .filter(Boolean)
      .join(", ");
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

const createWatermarkPattern = (container, text) => {
  if (!container) return;

  container.innerHTML = "";

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const watermarkHeight = 36;
  const watermarkWidth = 140;

  const rows = Math.ceil(containerHeight / watermarkHeight) * 3;
  const cols = Math.ceil(containerWidth / watermarkWidth) * 3;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const span = document.createElement("span");
      span.innerText = text;

      const leftPos = j * watermarkWidth - containerWidth / 2;
      const topPos = i * watermarkHeight - containerHeight / 2;

      span.style.left = `${leftPos}px`;
      span.style.top = `${topPos}px`;

      container.appendChild(span);
    }
  }
};

const Detail = ({ label, value, full = false, mono = false }) => (
  <div className={`detail-item${full ? " full" : ""}`}>
    <span className="key">{label}</span>
    <span className={`value${mono ? " mono" : ""}`}>{display(value)}</span>
  </div>
);

const VehicleDetails = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchNumber, setSearchNumber] = useState("");
  const [showMore, setShowMore] = useState(false);
  const watermarkRef = useRef(null);

  const { vehicleData, error, loading } = useVahanVehicleDetails(searchNumber);

  // Support both `{ result: {...} }` and flat payload shapes
  const result = vehicleData?.result || vehicleData || null;

  useEffect(() => {
    if (result && watermarkRef.current) {
      // Wait a tick so layout/height is ready
      const id = requestAnimationFrame(() => {
        createWatermarkPattern(watermarkRef.current, WATERMARK_TEXT);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [result, showMore]);

  useEffect(() => {
    const handleResize = () => {
      if (result && watermarkRef.current) {
        createWatermarkPattern(watermarkRef.current, WATERMARK_TEXT);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [result]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = inputValue.trim().toUpperCase();
    if (!next) return;
    setShowMore(false);
    setSearchNumber(next);
  };

  const isActive = String(result?.status || "").toUpperCase() === "ACTIVE";
  const manufacturer =
    result?.vehicleManufacturerName ||
    result?.mappings?.variantIds?.[0]?.make;
  const insurer =
    result?.vehicleInsuranceCompanyName ||
    result?.mappings?.insurerMapping?.insuranceCompanyName;
  const rtoLabel =
    result?.regAuthority ||
    result?.mappings?.rtoLocationMapping?.rtoDescription;

  return (
    <div className="vehicle-container">
      <header className="page-header">
        <h1>Vehicle Info Checker</h1>
        <p>Enter a registration number to fetch RC &amp; insurance details</p>
      </header>

      <form onSubmit={handleSubmit} className="vehicle-form">
        <input
          type="text"
          placeholder="e.g. XX 00 XX 0000"
          value={inputValue.toUpperCase()}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" disabled={loading || !inputValue.trim()}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {loading && (
        <div className="status-banner loading">
          Fetching vehicle details from registry…
        </div>
      )}
      {error && <div className="status-banner error">Error: {error}</div>}

      {!loading && !error && !result && !searchNumber && (
        <p className="empty-hint">
          Search a vehicle number to view owner, RC, and insurance details.
        </p>
      )}

      {result && (
        <article className="vehicle-card">
          <div className="watermark-text" ref={watermarkRef} />

          <div className="card-inner">
            <div className="card-hero">
              <div className="reg-block">
                <span className="label">Registration number</span>
                <h2 className="reg-no">
                  {display(result.regNo || result.vehicleNumber)}
                </h2>
                <p className="model-line">
                  {[manufacturer, result.model].filter(Boolean).join(" · ")}
                </p>
              </div>

              <div className="hero-meta">
                <span
                  className={`status-pill ${isActive ? "active" : "inactive"}`}
                >
                  {display(result.status)}
                </span>
                <span className="class-chip">{display(result.class)}</span>
              </div>
            </div>

            <div className="highlight-row">
              <div className="stat-box">
                <span className="key">Fuel</span>
                <span className="value">{display(result.type)}</span>
              </div>
              <div className="stat-box">
                <span className="key">Colour</span>
                <span className="value">{display(result.vehicleColour)}</span>
              </div>
              <div className="stat-box">
                <span className="key">Norms</span>
                <span className="value">{display(result.normsType)}</span>
              </div>
            </div>

            <section className="section">
              <h3 className="section-title">Owner details</h3>
              <div className="detail-grid">
                <Detail label="Owner" value={result.owner} />
                <Detail label="Father / Husband" value={result.ownerFatherName} />
                <Detail label="Mobile" value={result.mobileNumber} />
                <Detail label="Owner count" value={result.ownerCount} />
                <Detail
                  label="Present address"
                  value={result.presentAddress}
                  full
                />
                <Detail
                  label="Permanent address"
                  value={result.permanentAddress}
                  full
                />
              </div>
            </section>

            <section className="section">
              <h3 className="section-title">Registration</h3>
              <div className="detail-grid">
                <Detail label="RTO / Authority" value={rtoLabel} />
                <Detail label="RTO code" value={result.rtoCode} mono />
                <Detail label="Reg. date" value={result.regDate} />
                <Detail label="RC expiry" value={result.rcExpiryDate} />
                <Detail label="Tax upto" value={result.vehicleTaxUpto} />
                <Detail label="Status as on" value={result.statusAsOn} />
                <Detail label="Financer" value={result.rcFinancer} />
                <Detail label="Commercial" value={result.isCommercial} />
              </div>
            </section>

            <section className="section">
              <h3 className="section-title">Vehicle identity</h3>
              <div className="detail-grid">
                <Detail label="Manufacturer" value={manufacturer} />
                <Detail label="Model" value={result.model} />
                <Detail label="Chassis no." value={result.chassis} mono />
                <Detail label="Engine no." value={result.engine} mono />
                <Detail label="Category" value={result.vehicleCategory} />
                <Detail label="Body type" value={result.bodyType} />
                <Detail
                  label="Mfg. month/year"
                  value={result.vehicleManufacturingMonthYear}
                />
                <Detail label="Wheelbase" value={result.wheelbase} />
              </div>
            </section>

            <section className="section">
              <h3 className="section-title">Insurance &amp; PUCC</h3>
              <div className="detail-grid">
                <Detail label="Insurer" value={insurer} />
                <Detail
                  label="Insurance upto"
                  value={result.vehicleInsuranceUpto}
                />
                <Detail
                  label="Policy number"
                  value={result.vehicleInsurancePolicyNumber}
                  mono
                  full
                />
                <Detail label="PUCC number" value={result.puccNumber} mono />
                <Detail label="PUCC upto" value={result.puccUpto} />
              </div>
            </section>

            <section className="section">
              <h3 className="section-title">Technical specs</h3>
              <div className="detail-grid">
                <Detail
                  label="Cubic capacity"
                  value={
                    result.vehicleCubicCapacity
                      ? `${result.vehicleCubicCapacity} cc`
                      : null
                  }
                />
                <Detail
                  label="Cylinders"
                  value={result.vehicleCylindersNo}
                />
                <Detail
                  label="Seat capacity"
                  value={result.vehicleSeatCapacity}
                />
                <Detail
                  label="Unladen weight"
                  value={
                    result.unladenWeight ? `${result.unladenWeight} kg` : null
                  }
                />
                <Detail
                  label="Gross weight"
                  value={
                    result.grossVehicleWeight
                      ? `${result.grossVehicleWeight} kg`
                      : null
                  }
                />
                <Detail
                  label="Blacklist"
                  value={result.blacklistStatus}
                />
              </div>
            </section>

            <div className="card-actions">
              <button
                className="toggle-btn"
                type="button"
                onClick={() => setShowMore((prev) => !prev)}
              >
                {showMore ? "Hide raw JSON" : "Show all raw data"}
              </button>

              {showMore && (
                <pre className="raw-json">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  );
};

export default VehicleDetails;
