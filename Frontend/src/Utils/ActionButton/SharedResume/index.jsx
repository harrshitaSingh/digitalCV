import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommonShareTemplate from "../../../Components/ResumeTemplates/CommonShareTemplate";
;

const SharedResume = () => {
    const { id } = useParams();
    console.log(id, "wid");
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`${baseUrl}/resume/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await res.json();
                console.log(result, "result");

                if (res.ok) {
                    setResume(result.data);
                } else {
                    toast.warn(result.message || "Failed to load resume.");
                }
            } catch (err) {
                toast.error("Error fetching resume.");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    if (loading) return <div>Loading...</div>;


    return (
        <div style={{ padding: "2rem" }}>
            {resume ? (
                <CommonShareTemplate resumeData={resume} />
            ) : (
                <p>Resume data not available</p>
            )}
        </div>
    );
};

export default SharedResume;
