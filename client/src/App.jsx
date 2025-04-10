import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from './context/ThemeContext';

const API_BASE = 'http://localhost:5000/api/jobs';

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Applied',
    date: '',
    link: ''
  });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { darkMode, toggleTheme } = useTheme();

  const fetchJobs = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []); // ✅ Ensure jobs is always an array
    } catch (error) {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.position || !formData.date || !formData.link)
      return toast.error('Fill all fields');

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_BASE}/${editId}` : API_BASE;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    
      const data = await res.json();
      console.log('Response status:', res.status);
      console.log('Response data:', data);
    
      if (!res.ok) throw new Error('Server error');
    
      toast.success(editId ? 'Job updated!' : 'Job added!');
      setJobs(prev => editId
        ? prev.map(job => job._id === editId ? data : job)
        : [...prev, data]);
    
      setEditId(null);
      setFormData({ company: '', position: '', status: 'Applied', date: '', link: '' });
    
    } catch (err) {
      console.error('Error submitting job:', err);
      toast.error('Failed to submit job');
    }
    
  };

  const handleEdit = (job) => {
    setFormData({
      company: job.company,
      position: job.position,
      status: job.status,
      date: job.date,
      link: job.link
    });
    setEditId(job._id);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.info('Job deleted');
      setJobs(prev => prev.filter(job => job._id !== id)); // ✅ Remove from state
    }
  };

  const searchedJobs = jobs.filter((job) =>
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = filter === 'All'
    ? searchedJobs
    : searchedJobs.filter((job) => job.status === filter);

  const chartData = ['Applied', 'Interview', 'Rejected', 'Selected'].map(status => ({
    status,
    count: jobs.filter(job => job.status === status).length,
  }));

  return (
    <motion.div
      className={`app-container ${darkMode ? 'dark' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📋 Student Job Tracker</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleTheme}
          style={buttonStyle}
        >
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
        <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleChange} />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Selected</option>
        </select>
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
        <input type="text" name="link" placeholder="Job Application Link" value={formData.link} onChange={handleChange} />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          type="submit"
        >
          {editId ? 'Update' : 'Add Job'}
        </motion.button>
      </form>

      <input
        type="text"
        placeholder="Search by company or position..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', marginBottom: '1rem', width: '100%' }}
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <strong>Filter:</strong>
        {['All', 'Applied', 'Interview', 'Rejected', 'Selected'].map((s) => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setFilter(s)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.4rem 0.9rem',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              backgroundColor: filter === s ? '#007bff' : '#e0e0e0',
              color: filter === s ? 'white' : '#333',
            }}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {filteredJobs.length > 0 ? (
        <motion.table
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Date</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job._id}>
                <td>{job.company}</td>
                <td>{job.position}</td>
                <td>{job.status}</td>
                <td>{job.date}</td>
                <td>
                  <a href={job.link} target="_blank" rel="noopener noreferrer">🔗</a>
                </td>
                <td>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleEdit(job)}>Edit</motion.button>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDelete(job._id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete</motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <p>No job entries yet. Add one above! 🚀</p>
      )}

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ textAlign: 'center' }}>📊 Application Status Overview</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#007bff" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </motion.div>
  );
}

const buttonStyle = {
  padding: '8px 14px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#007bff',
  color: 'white',
  cursor: 'pointer',
};

export default App;
