import { RouteObject } from "react-router-dom";
import TeacherLayout from "@/layouts/teacher-layout";
import Dashboard from "@/pages/teacher/dashboard";
import CreateCourse from "@/pages/teacher/create-course";
import Editor from "@/pages/teacher/create-article";
import CALM from "@/pages/testing-proctoring/CALM";

const teacherRoutes: RouteObject = {
  path: "/teacher",
  element: <TeacherLayout />,
  children: [
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "courses/create",
      element: <CreateCourse />,
    },
    {
      path: "courses/articles/create",
      element: <Editor />,
    },
    {
      index: true,
      element: <Dashboard />, // Default to Dashboard
    },
    {
      path: "testing",
      element: <CALM></CALM>,
    }
  ],
};

export default teacherRoutes;
