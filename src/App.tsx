import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PreviewPublishPage } from './pages/PreviewPublishPage';
import { QuestionBuilderPage } from './pages/QuestionBuilderPage';
import { TestFormPage } from './pages/TestFormPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/tests" replace />} />
          <Route path="/tests" element={<DashboardPage />} />
          <Route path="/tests/new" element={<TestFormPage />} />
          <Route path="/tests/:testId/edit" element={<TestFormPage />} />
          <Route path="/tests/:testId/questions" element={<QuestionBuilderPage />} />
          <Route path="/tests/:testId/preview" element={<PreviewPublishPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
