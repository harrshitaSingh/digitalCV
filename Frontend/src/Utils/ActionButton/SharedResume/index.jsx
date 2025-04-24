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
            const token = localStorage.getItem("token");

            // Redirect if the token is missing
            if (!token) {
                toast.warn("You need to be logged in to view this resume.");
                navigate("/login"); // Redirect to login if no token is found
                return;
            }

            try {
                const res = await fetch(`${baseUrl}/resume/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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
    }, [baseUrl, id, navigate]); 

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
