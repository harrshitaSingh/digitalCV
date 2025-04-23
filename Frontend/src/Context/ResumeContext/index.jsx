import { createContext, useEffect, useState } from "react";
import { decodeToken } from "../../Utils/Token";

export const ResumeContext = createContext();

const ResumeProvider = ({ children }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [templateName, setTemplateName] = useState("");
    const [templateId, setTemplateId] = useState("");

    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    /**
     * @name fetchResume
     * @description Fetches resumes that match the logged-in user's ID
     */
    const fetchResume = async () => {
        const token = localStorage.getItem("token");
        const userId = token ? decodeToken(token)?.id : null;

        if (!userId) {
            console.error("No userId found");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/resume/home`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (Array.isArray(data)) {
                setResumes(data);
            }
        } catch (error) {
            console.error("Error fetching resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResume();
    }, []);

    /**
     * @name updateResume
     * @description Updates a specific resume field by ID
     */
    const updateResume = async (resumeId, section, data) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${baseUrl}/resume/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    resumeID: resumeId,
                    section,
                    data,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update resume");
            }

            await fetchResume();
        } catch (error) {
            console.error("Update error:", error.message);
        }
    };

    /**
     * @name deleteResume
     * @description Deletes a resume by ID
     */
    const deleteResume = async (resumeId) => {
        try {
            console.log("Are you deleting?", resumeId);

            const token = localStorage.getItem("token");

            const response = await fetch(`${baseUrl}/resume/delete/${resumeId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ resumeID: resumeId }),
            });

            const result = await response.json();
            console.log(result);

            await fetchResume();
        } catch (error) {
            console.error("Delete error:", error.message);
            return { success: false, message: error.message };
        }
    };

    return (
        <ResumeContext.Provider
            value={{
                resumes,
                updateResume,
                deleteResume,
                setResumes,
                loading,
                setLoading,
                fetchResume,
                resumeData,
                setResumeData,
                templateName,
                setTemplateName,
                templateId,
                setTemplateId,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeProvider;
