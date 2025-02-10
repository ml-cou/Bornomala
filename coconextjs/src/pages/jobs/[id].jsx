import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useCommonForm from "@/hooks/useCommonForm";
import { Container, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import Head from "next/head";
import Navheader from "@/components/header";
import Layout from "@/components/layout";

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useCommonForm();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only fetch if 'id' and 'token' are available
    if (!id || !token) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/api/circulars/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setJob(data);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="py-5">
        <p>No job data found.</p>
      </Container>
    );
  }

  // Destructure the fields for readability
  const {
    title,
    category,
    description,
    publication_date,
    deadline,
    start_date,
    end_date,
    location,
    eligibility_criteria,
    status,
    link_to_circular,
    attachment_url,
    organization_name,
    updated_at,
  } = job;

  // Determine if job is open or closed
  const isActive = status?.toLowerCase() === "open";

  return (
    <Layout>
      {/* Keep your navheader intact */}
      {/* <Navheader /> */}

      {/* Light-gray background to match your screenshot style */}
      <div style={{ backgroundColor: "#f6f7f9" }}>
        <Head>
          <title>{title ? `${title} | Job Details` : "Job Details"}</title>
          <meta
            name="description"
            content={description || "Find out more about this job opening."}
          />
        </Head>

        {/* Main container, offset from top so it appears below navheader */}
        <Container className="pb-4">
          {/* Optional "Go Back" button */}
          <Button
            variant="light"
            className="mb-4"
            onClick={() => router.back()}
            style={{
              border: "1px solid #ddd",
              boxShadow: "none",
            }}
          >
            &larr; Go Back
          </Button>

          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              {/* Title & Status Badge */}
              <h1 className="mb-2" style={{ fontWeight: "600" }}>
                {title}
              </h1>
              <div className="mb-3">
                <Badge
                  bg={isActive ? "success" : "danger"}
                  style={{ fontSize: "0.9rem", padding: "0.5em 0.75em" }}
                >
                  {isActive ? "OPEN" : "CLOSED"}
                </Badge>
              </div>

              {/* Meta info row - Category, Location, Published, Deadline */}
              <div
                className="d-flex flex-wrap align-items-center mb-4"
                style={{ color: "#6c757d" }}
              >
                {category?.name && (
                  <span className="me-3">
                    <strong>Category:</strong> {category.name}
                  </span>
                )}
                {location && (
                  <span className="me-3">
                    <strong>Location:</strong> {location}
                  </span>
                )}
                {publication_date && (
                  <span className="me-3">
                    <strong>Published:</strong> {publication_date}
                  </span>
                )}
                {deadline && (
                  <span className="me-3">
                    <strong>Deadline:</strong> {deadline}
                  </span>
                )}
              </div>

              {/* Description - styled like a "blog post" section */}
              <section className="mb-4">
                <h5 style={{ fontWeight: "500" }}>Description</h5>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {description || "No description provided."}
                </p>
              </section>

              {/* Eligibility Criteria */}
              <section className="mb-4">
                <h5 style={{ fontWeight: "500" }}>Eligibility Criteria</h5>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {eligibility_criteria || "Not specified."}
                </p>
              </section>

              {/* Additional meta fields */}
              <section className="mb-4" style={{ color: "#6c757d" }}>
                {start_date && (
                  <p className="mb-1">
                    <strong>Start Date:</strong> {start_date}
                  </p>
                )}
                {end_date && (
                  <p className="mb-1">
                    <strong>End Date:</strong> {end_date}
                  </p>
                )}
                {organization_name && (
                  <p className="mb-1">
                    <strong>Organization:</strong> {organization_name}
                  </p>
                )}
                {updated_at && (
                  <p className="mb-1">
                    <strong>Last Updated:</strong>{" "}
                    {new Date(updated_at).toLocaleString()}
                  </p>
                )}
              </section>

              <hr />

              {/* Footer area for external links */}
              <section className="d-flex flex-column flex-sm-row align-items-start mt-3">
                {/* Link to Circular (if any) */}
                {link_to_circular && (
                  <Button
                    as="a"
                    href={link_to_circular}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="me-2 mb-2"
                    style={{ minWidth: "140px" }}
                  >
                    Go to Circular
                  </Button>
                )}

                {/* Attachment Link (if any) */}
                {attachment_url && (
                  <Button
                    as="a"
                    href={attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-secondary"
                    className="mb-2"
                    style={{ minWidth: "140px" }}
                  >
                    View Attachment
                  </Button>
                )}
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}
