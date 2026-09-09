import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ArticleDetail from "./pages/ArticleDetail";
import ProfilePage from "./pages/ProfilePage";

import CreatorDashboard from "./pages/creator/CreatorDashboard";
import ArticleEditor from "./pages/creator/ArticleEditor";
import MyArticles from "./pages/creator/MyArticles";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ArticleModeration from "./pages/admin/ArticleModeration";
import UserManagement from "./pages/admin/UserManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";

function AppLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

       
        <Route
          path="/creator"
          element={
            <ProtectedRoute allowedRoles={["creator", "admin"]}>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/new"
          element={
            <ProtectedRoute allowedRoles={["creator", "admin"]}>
              <ArticleEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["creator", "admin"]}>
              <ArticleEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/articles"
          element={
            <ProtectedRoute allowedRoles={["creator", "admin"]}>
              <MyArticles />
            </ProtectedRoute>
          }
        />

       
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ArticleModeration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CategoryManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;