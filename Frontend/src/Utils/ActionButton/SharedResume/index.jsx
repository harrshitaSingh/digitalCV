import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommonShareTemplate from "../../../Components/ResumeTemplates/CommonShareTemplate";

const SharedResume = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await fetch(`${baseUrl}/resume/share/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const result = await res.json();
                if (res.ok) {
                    setResume(result.data);
                } else {
                    toast.warn(result.message || "Failed to load resume.");
                }
            } catch (err) {
                toast.error("Error fetching resume.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [baseUrl, id]);

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


    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: "2rem" }}>
            {console.log(resume,"hhjj")}
            {resume ? (
                <CommonShareTemplate resumeData={resume} />
            ) : (
                <p>Resume data not available</p>
            )}
        </div>
    );
};

export default SharedResume;
