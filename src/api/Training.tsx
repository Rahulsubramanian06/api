import Cookies from "js-cookie";
import { get_exam_results } from "./all_api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const navigate = useNavigate();
  const [exam_array, setExam_array] = useState<any>([]);

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const header = {
          headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
        };
        const exam_result = await get_exam_results(header);
        const sortedResults = exam_result.data.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setExam_array(sortedResults);
      } catch (error) {
        console.error("Error fetching exam results:", error);
      }
    };
    fetchExamResults();
  }, []);
  
  const logout = (): void => {
    Cookies.remove("Token");
    localStorage.removeItem("Posp_id");
    navigate("/");
  };

  return (
    <>
      <div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2>Training</h2>
    <button onClick={logout} className="btn btn-danger">Log out</button>
  </div>

  <div className="row">
    {exam_array
    .filter((item: any) => item.is_passed)
    .map((item:any, id:any) => (
      <div key={id} className="col-md-6 col-lg-4 mb-4">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5 className="card-title">{item.paper_name}</h5>
            <p className="card-text"><strong>POSP ID:</strong> {item.posp_id}</p>
            <p className="card-text"><strong>Total Marks:</strong> {item.total_marks}</p>
            <p className="card-text"><strong>Passing Marks:</strong> {item.passing_marks}</p>
            <p className="card-text"><strong>Marks obtained:</strong> {item.total_marks_obtained}</p>
            <p className="card-text">
              <strong>Result:</strong>{" "}
              <span className={item.is_passed ? "text-success" : "text-danger"}>
                {item.is_passed ? "Pass" : "Failed"}
              </span>
            </p>
            <p className="card-text"><small className="text-muted">Created at: {item.created_at}</small></p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
    </>
  );
};

export default Training;
