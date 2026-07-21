import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetail from './pages/RestaurantDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ReviewManage from './pages/admin/ReviewManage';
import RestaurantManage from './pages/admin/RestaurantManage';
import UserManage from './pages/admin/UserManage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/reviews" element={<ReviewManage />} />
          <Route path="/admin/restaurants" element={<RestaurantManage />} />
          <Route path="/admin/users" element={<UserManage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
