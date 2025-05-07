import Cookies from "js-cookie";
import { get_exam_results } from "./all_api";
import { useState, useEffect } from "react";

const Training = () => {
  const [exam_array, setExam_array] = useState<any>([]);

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const header = {
          headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
        };
        const exam_result = await get_exam_results(header);
        const sortedResults = exam_result.data.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setExam_array(sortedResults);
      } catch (error) {
        console.error("Error fetching exam results:", error);
      }
    };
    fetchExamResults();
  }, []);
  return (
    <>
      <div>Training</div>
      {exam_array.map((item: {
        posp_id: string;
        paper_name: string;
        total_marks: string;
        passing_marks: boolean;
        is_passed: string;
        created_at: string;
      }, id: number) => (
        <>
        <p key={id}>Exam : {item.paper_name}</p>
        <p key={id}>POSP ID : {item.posp_id}</p>

        <p key={id}>Total marks : {item.total_marks}</p>
        <p key={id}>Passing marks : {item.passing_marks}</p>
        <p key={id}>Result : {item.is_passed ? "Pass" : "Failed"}</p>
        <p key={id}>Created at : {item.created_at}</p>
        </>
      ))}
    </>
  );
};

export default Training;
