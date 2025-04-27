import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CommonShareTemplate from "../../../Components/ResumeTemplates/CommonShareTemplate";

const SharedResume = () => {
    const { id } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSharing, setIsSharing] = useState(false);

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
                    setIsSharing(true)
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
                <CommonShareTemplate resumeData={resume} isSharing={isSharing} />
            ) : (
                <p>Resume data not available</p>
            )}
        </div>
    );
};

export default SharedResume;
