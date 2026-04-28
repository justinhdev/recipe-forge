/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthForm from "./AuthForm";

const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}));

vi.mock("../utils/api", () => ({
  default: {
    post: postMock,
  },
}));

const renderAuthForm = (isLogin = true) =>
  render(
    <MemoryRouter initialEntries={[isLogin ? "/login" : "/register"]}>
      <Routes>
        <Route
          path={isLogin ? "/login" : "/register"}
          element={<AuthForm isLogin={isLogin} />}
        />
        <Route path="/generate" element={<h1>Generate Route</h1>} />
      </Routes>
    </MemoryRouter>
  );

describe("AuthForm", () => {
  beforeEach(() => {
    postMock.mockReset();
    localStorage.clear();
  });

  it("submits login credentials and stores the returned token", async () => {
    postMock.mockResolvedValue({ data: { token: "test-token" } });
    const user = userEvent.setup();

    renderAuthForm();

    await user.type(screen.getByPlaceholderText("Email"), "cook@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/api/auth/login", {
        email: "cook@example.com",
        password: "password123",
      });
    });
    expect(localStorage.getItem("token")).toBe("test-token");
    expect(await screen.findByRole("heading", { name: "Generate Route" })).toBeTruthy();
  });

  it("submits registration details and stores the user's display name", async () => {
    postMock.mockResolvedValue({ data: { token: "register-token" } });
    const user = userEvent.setup();

    renderAuthForm(false);

    await user.type(screen.getByPlaceholderText("Name"), "Avery");
    await user.type(screen.getByPlaceholderText("Email"), "avery@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith("/api/auth/register", {
        name: "Avery",
        email: "avery@example.com",
        password: "password123",
      });
    });
    expect(localStorage.getItem("token")).toBe("register-token");
    expect(localStorage.getItem("name")).toBe("Avery");
  });
});
