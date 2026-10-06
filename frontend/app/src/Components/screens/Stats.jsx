import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";

function Stats() {
  const [selectedStatus, setSelectedStatus] = useState("");
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  const fetchData = async (status) => {
    try {
        const response = await fetch(`/api/connectionrequestdata/?status=${status}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      updateChart(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const createChart = (data) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Number of Connection Requests by Month",
            data: data.Total_Count,
            backgroundColor: "rgba(54, 162, 235, 0.25)",
            borderColor: "rgba(54, 162, 235, 0.8)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  };

  const updateChart = (data) => {
    if (chartRef.current) {
      chartRef.current.data.labels = data.labels;
      chartRef.current.data.datasets[0].data = data.Total_Count;
      chartRef.current.update();
    } else {
      createChart(data);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="border p-3">
        <Link to="/" className="btn btn-dark rounded-0 px-4 py-3">
          GO BACK
        </Link>

        <h6
          className="mt-3 text-secondary text-uppercase"
          style={{ letterSpacing: "2px" }}
        >
          Number of Connection Requests in Every Month Visualization
        </h6>

        <div className="mt-4" style={{ maxWidth: "300px" }}>
          <label className="form-label text-secondary">
            Filter By Connection Status
          </label>
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-3" style={{ maxWidth: "600px" }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default Stats;