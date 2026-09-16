import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Brand from "./pages/Brand";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";
import { LanguageProvider } from "./context/LanguageContext";
import Chatbot from "./components/Chatbot";
import "./index.css";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/admin-panel" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/user-panel" element={<PrivateRoute><UserPanel /></PrivateRoute>} />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;