import React from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

function Home() {
  const [data, setData] = useState([]);
  const [totalpages, setTotalPages] = useState(1);
  const [currentPages, setCurrentPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPages, startDate, endDate, searchQuery]);

  const fetchData = async () => {
    try {
      let url = `/api/getApplicantsData/?page=${currentPages}`;
      if (startDate && endDate) {
        // console.log(startDate)
        // console.log(startDate.toISOString().split("T")[0])
        url += `&start_date=${startDate.toISOString().split("T")[0]}&end_date=${
          endDate.toISOString().split("T")[0]
        }`;
      }
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
      const response = await fetch(url);
      const jsonData = await response.json();
      setData(jsonData.data);
      setTotalPages(jsonData.total_pages);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handelStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <>
      <div className="container">
        <h1>Applicant Details</h1>
        <hr />
        <Row>
          <p>Filter by date of Application</p>
          <Col md={2}>
            <DatePicker
              selected={startDate}
              className="form-control"
              onChange={handelStartDateChange}
              placeholderText="from date"
            />
          </Col>
          <Col md={2}>
            <DatePicker
              selected={endDate}
              className="form-control"
              onChange={handleEndDateChange}
              placeholderText="to date"
            />
          </Col>
          <Col md={3}></Col>
          <Col md={5}>
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search By Applicant ID"
            />
          </Col>
        </Row>
        <hr />

        <div className="table-box">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant Name</th>
                <th>Gender</th>
                <th>District</th>
                <th>State</th>
                <th>Pincode</th>
                <th>OwnerShip</th>
                <th>Govt ID Type</th>
                <th>ID Number</th>
                <th>Category</th>
                <th>Load Applied</th>
                <th>Data of Application</th>
                <th>Status</th>
                <th>Reviewer ID</th>
                <th>Reviewer Name</th>
                <th>Reviewer Comments</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.Applicant.Applicant_Name}</td>
                  <td>{item.Applicant.Gender}</td>
                  <td>{item.Applicant.District}</td>
                  <td>{item.Applicant.State}</td>
                  <td>{item.Applicant.Pincode}</td>
                  <td>{item.Applicant.ownership}</td>
                  <td>{item.Applicant.GovtID_Type}</td>
                  <td>{item.Applicant.ID_Number}</td>
                  <td>{item.Applicant.Category}</td>
                  <td>{item.Load_Applied}</td>
                  <td>{item.Date_of_application}</td>
                  <td>{item.status}</td>
                  <td>{item.Reviewer_ID}</td>
                  <td>{item.Reviewer_Name}</td>
                  <td>{item.Reviewer_comments}</td>
                  <td>
                    <Link to={`/EditApplicant/${item.id}`}>Edit</Link>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-box">
          <button
            onClick={() => setCurrentPages(1)}
            disabled={currentPages === 1}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPages(currentPages - 1)}
            disabled={currentPages === 1}
          >
            Previous
          </button>
          <span className="page-number">{currentPages}</span>
          <button
            onClick={() => setCurrentPages(currentPages + 1)}
            disabled={currentPages === totalpages}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPages(totalpages)}
            disabled={currentPages === totalpages}
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
