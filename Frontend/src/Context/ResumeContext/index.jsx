import { createContext, useEffect, useState } from "react";
import { decodeToken } from "../../Utils/Token";

export const ResumeContext = createContext();

const ResumeProvider = ({ children }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [templateName, setTemplateName] = useState("");
    const [templateId, setTemplateId] = useState("");


    /**
     * @name fetchResume
     * @description Fetches resumes that match the logged-in user's ID
     */

    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * @name updateResume
     * @description Updates a specific resume field by ID
     * @param {string} resumeId - ID of the resume to update
     * @param {string} field - The field to update
     * @param {any} value - The new value for the field
     */

    const updateResume = async (resumeId, section, data) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${baseUrl}/resume/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                throw new Error(result.message || 'Failed to update resume');
            }
            await fetchResume();
        } catch (error) {
            console.error('Update errorecvefcve:', error.message);
        }
    };


    const deleteResume = async (resumeId) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${baseUrl}/resume/delete/${resumeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ resumeID: resumeId }),
            });
            const result = await response.json();
            console.log(result)

            await fetchResume();

        } catch (error) {
            console.error('Delete error:', error.message);
            return { success: false, message: error.message };
        }
    };




    return (
        <ResumeContext.Provider value={{
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
            setTemplateId
        }}>
            {children}
        </ResumeContext.Provider>
    );
};

export default ResumeProvider;
