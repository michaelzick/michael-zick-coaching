
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import CoursesPage from "./pages/CoursesPage";
import CourseDetails from "./pages/CourseDetails";
import Cart from "./pages/Cart";
import HowItWorks from "./pages/HowItWorks";
import CoachesPage from "./pages/CoachesPage";
import CoachProfile from "./pages/CoachProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CoursePlayer from "./pages/CoursePlayer";
import MyPrograms from "./pages/MyPrograms";
import ResetPassword from "./pages/ResetPassword";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetail from "./pages/ResourceDetail";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCoursesList from "./pages/admin/CoursesList";
import AdminCoachesList from "./pages/admin/CoachesList";
import AdminCourseForm from "./pages/admin/CourseForm";
import AdminCoachForm from "./pages/admin/CoachForm";
import AdminOrdersList from "./pages/admin/OrdersList";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/programs" element={<Navigate to="/courses" replace />} />
                <Route path="/course/:slug" element={<CourseDetails />} />
                <Route path="/coaches" element={<CoachesPage />} />
                <Route path="/coaches/:slug" element={<CoachProfile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/about" element={<Navigate to="/how-it-works" replace />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resources/:slug" element={<ResourceDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                <Route path="/checkout/cancel" element={<CheckoutCancel />} />
                <Route path="/learn/:courseSlug/:lessonId?" element={
                  <AuthGuard><CoursePlayer /></AuthGuard>
                } />
                <Route path="/my-programs" element={
                  <AuthGuard><MyPrograms /></AuthGuard>
                } />
                <Route path="/admin" element={
                  <AdminGuard><AdminLayout /></AdminGuard>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="courses" element={<AdminCoursesList />} />
                  <Route path="courses/new" element={<AdminCourseForm />} />
                  <Route path="courses/:id/edit" element={<AdminCourseForm />} />
                  <Route path="coaches" element={<AdminCoachesList />} />
                  <Route path="coaches/new" element={<AdminCoachForm />} />
                  <Route path="coaches/:id/edit" element={<AdminCoachForm />} />
                  <Route path="orders" element={<AdminOrdersList />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
