import axios from "axios";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzdW5rYXJhYWpheTg2QGdtYWlsLmNvbSIsImV4cCI6MTc3ODMwODkxMywiaWF0IjoxNzc4MzA4MDEzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiMmJlNWYyODItOTM1NC00ODhlLWJlZDgtM2VmODM5MDE4MzIzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3Vua2FyYSBhamF5Iiwic3ViIjoiZTAxMDYxMjctZTkxMi00MWYyLWI1NDktYWRmNjY3NWY5MGE3In0sImVtYWlsIjoic3Vua2FyYWFqYXk4NkBnbWFpbC5jb20iLCJuYW1lIjoic3Vua2FyYSBhamF5Iiwicm9sbE5vIjoiMjM0ODFhNTRnOCIsImFjY2Vzc0NvZGUiOiJlSmRDdUMiLCJjbGllbnRJRCI6ImUwMTA2MTI3LWU5MTItNDFmMi1iNTQ5LWFkZjY2NzVmOTBhNyIsImNsaWVudFNlY3JldCI6InJLbVNHVXFlV3BtSmpoUU0ifQ.YlHz-f3SvR-QiE_KuDPcihJhxUC7nitC5zFhubhePtw";

const LOG_API = "http://localhost:3001/logs";

export const Log = async (
  stack: "frontend" | "backend",
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg:
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style"
    | "auth"
    | "config"
    | "middleware"
    | "utils",
  message: string
) => {
  try {
    const response = await axios.post(
      LOG_API,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(
      "Log Created Successfully:",
      response.data
    );

    return response.data;

  } catch (error: any) {
    console.error("Logging error:", error.message);
    throw error;
  }
};