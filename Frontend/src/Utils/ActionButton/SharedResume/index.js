import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BluesResumeTemplate from "../../../Components/ResumeTemplates/BlueResumeTemplate";
import ClassicResumeTemplate from "../../../Components/ResumeTemplates/ClassicResumeTemplate";
import ModernResumeTemplate from "../../../Components/ResumeTemplates/ModernResumeTemplate";
import TraditionalTemplate from "../../../Components/ResumeTemplates/TraditionalResumeTemplate";
import { toast } from "react-toastify";

const templateMap = {
    Blues: BluesResumeTemplate,
    Classic: ClassicResumeTemplate,
    Modern: ModernResumeTemplate,
    Traditional: TraditionalTemplate,
};

const SharedResume = () => {
    const { id } = useParams(); // Get the resume ID from the URL
    console.log(id, "wid");
    const [resume, setResume] = useState(null); // Store resume data
    const [loading, setLoading] = useState(true); // Loading state to show a loading indicator

    useEffect(() => {
        const fetchResume = async () => {
            try {
                // Assuming you may want to pass an authorization token, check localStorage or sessionStorage
                const token = localStorage.getItem("token"); // Retrieve token from localStorage

                // Add the token to your fetch request headers
                const res = await fetch(`http://localhost:5000/resume/${id}`, {
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
    }, [id]); // Fetch resume whenever the resume ID changes

    if (loading) return <div>Loading...</div>;

    const TemplateComponent = templateMap[resume?.template];

    return (
        <div style={{ padding: "2rem" }}>
            {TemplateComponent ? (
                <TemplateComponent resumeData={resume} />
            ) : (
                <p>Template not found</p>
            )}
        </div>
    );
};

export default SharedResume;
