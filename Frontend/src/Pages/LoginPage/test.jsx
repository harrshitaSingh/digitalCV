import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import LoginPage from "../LoginPage/index";
import '@testing-library/jest-dom';


jest.mock("react-toastify", () => ({
    toast: {
        warn: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => <div />,
}));


global.fetch = jest.fn();

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
    const setUserState = jest.fn();

    const renderWithContext = () =>
        render(
            <UserContext.Provider value={{ setUserState }}>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </UserContext.Provider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders login form elements", () => {
        renderWithContext();
        expect(screen.getByText("DigitalCV")).toBeInTheDocument();
        expect(screen.getByLabelText(/enter your email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/enter your password/i)).toBeInTheDocument();
        expect(screen.getByText("Submit")).toBeInTheDocument();
        expect(screen.getByText(/create an account\?/i)).toBeInTheDocument();
    });

    test("shows warning if email or password is missing", () => {
        renderWithContext();
        fireEvent.click(screen.getByText("Submit"));
        expect(require("react-toastify").toast.warn).toHaveBeenCalledWith(
            "Please enter both email and password",
            { position: "top-right" }
        );
    });

    test("handles successful login", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                user: { token: "abc123", name: "Test User" },
            }),
        });

        renderWithContext();

        fireEvent.change(screen.getByLabelText(/enter your email/i), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/enter your password/i), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(setUserState).toHaveBeenCalledWith({ token: "abc123", name: "Test User" });
            expect(localStorage.getItem("token")).toBe("abc123");
            expect(mockNavigate).toHaveBeenCalledWith("/home");
        });
    });

    test("handles failed login", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                error: "Invalid credentials",
            }),
        });

        renderWithContext();

        fireEvent.change(screen.getByLabelText(/enter your email/i), {
            target: { value: "wrong@example.com" },
        });
        fireEvent.change(screen.getByLabelText(/enter your password/i), {
            target: { value: "wrongpass" },
        });

        fireEvent.click(screen.getByText("Submit"));

        await waitFor(() => {
            expect(require("react-toastify").toast.error).toHaveBeenCalledWith("Invalid credentials", {
                position: "top-right",
            });
        });
    });
});
