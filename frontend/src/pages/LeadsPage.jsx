import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { leadcService } from '../services/studentService';
import './LeadsPage.css';
import leadService from '../services/leadService';

const LeadsPage = () => {
  const { user } = useAuth();
  const [leads, setleads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchleads = async () => {
      try {
        setLoading(true);
        const res = await leadService.getleads();
        // axios responses place the payload on res.data
        const payload = res?.data ?? res;
        const list = payload?.data ?? payload ?? [];
        if (mounted) setleads(list);
      } catch (err) {
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchleads();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading leads...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="leads-page">
      <h1>leads</h1>
      {user && <p>Welcome, {user.name || user.email || 'User'}</p>}

      {leads.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {leads.map((s) => (
            <li key={s.id || s._id}>{s.name || s.fullName || `${s.firstName || ''} ${s.lastName || ''}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeadsPage;