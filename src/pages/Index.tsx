
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage';
import { Dashboard } from '../components/Dashboard';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {!user ? (
        <LoginPage />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default Index;
