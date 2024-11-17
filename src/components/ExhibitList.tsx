import React, { useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import ExhibitCard from "./ExhibitCard";
import Pagination from "./Pagination";
import { useRequest } from "ahooks";
import axiosInstance from "../api/axiosInstance";
import { Exhibit } from "../types/types";
import SocketNotification from "./SocketNotification";

const fetchExhibits = (page: number) =>
  axiosInstance.get<{ data: Exhibit[]; lastPage: number }>("api/exhibits", {
    params: { page },
  });

const ExhibitList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useRequest(
    () => fetchExhibits(currentPage),
    { refreshDeps: [currentPage] }
  );

  const exhibits = data?.data?.data || [];
  const lastPage = data?.data?.lastPage || 1;

  const handleNewPost = () => {
    console.log("New post received");
  };

  return (
    <Container
      className="my-5 d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <SocketNotification onNewPost={handleNewPost} currentPage={currentPage} />
      {error && <Alert variant="danger">{error.message}</Alert>}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <span className="ms-3">Loading...</span>
        </div>
      ) : (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center">
            {exhibits.map((exhibit: Exhibit) => (
              <ExhibitCard key={exhibit.id} exhibit={exhibit} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </Container>
  );
};
export default ExhibitList;
