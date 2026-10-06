import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Form, Container } from "react-bootstrap";
import Message from "./Message";

function EditApplicant() {
  const { id } = useParams();
  const [applicantData, setApplicantData] = useState({});
  const [connectionData, setConnectionData] = useState({});
  const [message, setMessage] = useState("");
  const [applicant, setApplicant] = useState({
    Applicant_Name: "",
    Gender: "",
    District: "",
    State: "",
    Pincode: "",
    Ownership: "",
    GovtID_Type: "",
    ID_Number: "",
    Category: "",
  });
  const [connection, setConnection] = useState({
    Applicant: "",
    Load_Applied: "",
    Date_of_Application: "",
    Date_of_Approval: "",
    Modified_Date: "",
    Status: "",
    Reviewer_ID: "",
    Reviewer_Name: "",
    Reviewer_Comments: "",
  });

  const fetchApplicantData = async () => {
    try {
      const response = await fetch(`/api/update_applicant/${id}/`);
      const data = await response.json();
      setApplicantData(data.applicant || {});
      setConnectionData(data.connection || {});
    } catch (error) {
      console.error("Error fetching applicant data:", error);
    }
  };

  useEffect(() => {
    fetchApplicantData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicantData({ ...applicantData, [name]: value });
  };

  const handleConnectionChange = (e) => {
    const { name, value } = e.target;
    setConnectionData({ ...connectionData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Number(connectionData.Load_Applied) > 200) {
        setMessage("Load Applied cannot be greater than 200");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return;
      }

      await fetch(`/api/update_applicant/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicant: applicantData,
          connection: connectionData,
        }),
      });

      setMessage("Applicant Updated Successfully.");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error updating applicant data:", error);
    }
  };

  return (
    <Container className="pb-5">
      <div className="row">
        <div className="col-md-3">
          <Link to="/" className="btn btn-dark my-1">
            Go Back
          </Link>
        </div>
      </div>
      <hr />
      <h5>Edit Applicant or Connection Details</h5>
      <hr />

      <Form onSubmit={handleSubmit}>
        {message && <Message variant="info">{message}</Message>}

        <Row>
          {/* LEFT: Applicant details */}
          <Col md={6}>
            <Form.Group controlId="Applicant_Name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="Applicant_Name"
                value={applicantData.Applicant_Name || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="Gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="Gender"
                value={applicantData.Gender || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="District">
              <Form.Label>District</Form.Label>
              <Form.Control
                type="text"
                name="District"
                value={applicantData.District || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="State">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="State"
                value={applicantData.State || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="Pincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="number"
                name="Pincode"
                value={applicantData.Pincode || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="Ownership">
              <Form.Label>Ownership</Form.Label>
              <Form.Control
                as="select"
                name="Ownership"
                value={applicantData.Ownership || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Ownership</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="JOINT">Joint</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="GovtID_Type">
              <Form.Label>Govt ID Type</Form.Label>
              <Form.Control
                as="select"
                name="GovtID_Type"
                value={applicantData.GovtID_Type || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select ID Type</option>
                <option value="AADHAR">Aadhar</option>
                <option value="PAN">PAN</option>
                <option value="VOTERID">Voter ID</option>
                <option value="PASSPORT">Passport</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="ID_Number">
              <Form.Label>ID Number</Form.Label>
              <Form.Control
                type="text"
                name="ID_Number"
                value={applicantData.ID_Number || ""}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          {/* RIGHT: Connection details */}
          <Col md={6}>
            <Form.Group controlId="Category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="Category"
                value={applicantData.Category || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="Load_Applied">
              <Form.Label>Load Applied</Form.Label>
              <Form.Control
                type="number"
                name="Load_Applied"
                value={connectionData.Load_Applied || ""}
                onChange={handleConnectionChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="Date_of_application">
              <Form.Label>Date of Application</Form.Label>
              <Form.Control
                type="date"
                name="Date_of_application"
                value={connectionData.Date_of_application || ""}
                onChange={handleConnectionChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="Date_of_approval">
              <Form.Label>Date of Approval</Form.Label>
              <Form.Control
                type="date"
                name="Date_of_approval"
                value={connectionData.Date_of_approval || ""}
                onChange={handleConnectionChange}
              />
            </Form.Group>

            <Form.Group controlId="modified_date">
              <Form.Label>Modified Date</Form.Label>
              <Form.Control
                type="date"
                name="modified_date"
                value={connectionData.modified_date || ""}
                onChange={handleConnectionChange}
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={connectionData.status || ""}
                onChange={handleConnectionChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="Reviewer_ID">
              <Form.Label>Reviewer ID</Form.Label>
              <Form.Control
                type="number"
                name="Reviewer_ID"
                value={connectionData.Reviewer_ID || ""}
                onChange={handleConnectionChange}
              />
            </Form.Group>

            <Form.Group controlId="Reviewer_Name">
              <Form.Label>Reviewer Name</Form.Label>
              <Form.Control
                type="text"
                name="Reviewer_Name"
                value={connectionData.Reviewer_Name || ""}
                onChange={handleConnectionChange}
              />
            </Form.Group>

            <Form.Group controlId="Reviewer_comments">
              <Form.Label>Reviewer Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Reviewer_comments"
                value={connectionData.Reviewer_comments || ""}
                onChange={handleConnectionChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {message && <div className="alert alert-info mt-3">{message}</div>}

        <button type="submit" className="btn btn-primary my-3">
          Update
        </button>
      </Form>
    </Container>
  );
}

export default EditApplicant;