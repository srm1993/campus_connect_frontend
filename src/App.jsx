
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Register from "./Register";
import Login from "./Login";
import AdminLanding from "./admin/AdminLanding";
import FacultyLanding from "./faculty/FacultyLanding";
import StudentLanding from "./student/StudentLanding";
import Header from "./Header";

import AllUser from "./admin/AllUser";
import AllFaculty from "./admin/AllFaculty";
import CreateEvent from "./admin/CreateEvent";
import AllEvent from "./admin/AllEvent";
import CreateClub from "./student/CreateClub";
import AllClubs from "./student/AllClubs";
import ViewClub from "./student/ViewClub";
import AdminAllClubs from "./admin/AdminAllClubs";
import FacultyAllClubs from "./faculty/FacultyAllClubs";
import CreateFacultyEvent from "./faculty/CreateFacultyEvent";
import AllFacultyEvent from "./faculty/AllFacultyEvent";
import AllStudentEvent from "./student/AllStudentEvent";
import StudentClubChat from "./student/StudentClubChat";
import StudentProfile from "./student/StudentProfile";
import TeacherProfile from "./faculty/TeacherProfile";
import AdminProfile from "./admin/AdminProfile";
import LandingPage from "./LandingPage";
import AllPosts from "./AllPosts";

// Initialize authentication from localStorage
const getInitialAuth = () => {
    const userid = localStorage.getItem("userid");
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");

    return {
        IsLoggedIn: Boolean(userid && role),
        userid,
        name,
        role
    };
};

function AppContent() {
    const [auth, setAuth] = useState(getInitialAuth);
    // Handle successful login
    const handleLogin = (userData) => {
        localStorage.setItem("userid", userData.userid);
        localStorage.setItem("name", userData.name);
        localStorage.setItem("role", userData.role);

        setAuth({
            IsLoggedIn: true,
            userid: userData.userid,
            name: userData.name,
            role: userData.role
        });
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("userid");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
        localStorage.removeItem('user');
        localStorage.removeItem("token");

        setAuth({
            IsLoggedIn: false,
            userid: null,
            name: null,
            role: null
        });
    };

    return (
        <>
            <Header
                auth={auth}
                handleLogout={handleLogout}
            />

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={<Login handleLogin={handleLogin} />}
                />

                <Route path="/register" element={<Register />} />

                <Route path="/admin" element={<AdminLanding />} />

                <Route path="/faculty" element={<FacultyLanding />} />

                <Route path="/student" element={<StudentLanding />} />

                <Route path="/allStudent" element={<AllUser />} />

                <Route path="/allFaculty" element={<AllFaculty />} />

                <Route path="/CreateEvent" element={<CreateEvent />} />

                <Route path="/allEvent" element={<AllEvent />} />

                <Route path="/createClub" element={<CreateClub />} />

                <Route path="/allClub" element={<AllClubs />} />

                <Route path="/club/:id" element={<ViewClub />} />

                <Route path="/allClubs" element={<AdminAllClubs />} />

                <Route path="/allClubss" element={<FacultyAllClubs />} />

                <Route path="/CreateEvents" element={<CreateFacultyEvent />} />

                <Route path="/allEvents" element={<AllFacultyEvent />} />

                <Route path="/allEventss" element={<AllStudentEvent />} />

                <Route path="/allClubss" element={<AdminAllClubs />} />

                <Route path="/student/club-chat" element={<StudentClubChat />} />

                <Route path="/studentProfile" element={<StudentProfile />} />
                <Route path="/facultyProfile" element={<TeacherProfile />} />
                <Route path="/adminProfile" element={<AdminProfile />} />
                
                <Route path="/allPost" element={<AllPosts />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
