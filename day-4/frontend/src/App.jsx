import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    fname: '',
    Last: '',
    email: '',
    DOB: '',
    phone: '',
    gender: 'M',
    preference: 'General'
  });

  const API_URL = 'http://localhost:3000';

  const fetchPatients = async () => {
    try {
      const res = await axios.post(`${API_URL}/patient?page=${page}&limit=5`);
      setPatients(res.data.data);
      setTotalPages(Math.ceil(res.data.totalUsers / 5) || 1);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      if (editId) {
  
        await axios.put(`${API_URL}/user/${editId}`, formData);
        alert('Patient Updated Successfully!');
      } else {
        await axios.post(`${API_URL}/patient`, formData);
        alert('Patient Created Successfully!');
      }

      setFormData({
        fname: '', Last: '', email: '', DOB: '', phone: '', gender: 'M', preference: 'General'
      });
      setEditId(null);
      fetchPatients();
    } catch (err) {
      const serverError = err.response?.data?.message || err.response?.data?.error || 'Operation Failed';
      alert("Error: " + serverError);
    }
  };

  const handleEdit = (patient) => {
    setEditId(patient.id);
    setFormData({
      fname: patient.fname,
      Last: patient.Last,
      email: patient.email,
      DOB: patient.DOB,
      phone: patient.phone,
      gender: patient.gender,
      preference: patient.preference
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }; 

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await axios.delete(`${API_URL}/user/${id}`);
        fetchPatients();
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.message || "Server Error"));
      }
    }
  };

  return (
    <div className="app-container">
      <h2 className="title">
        {editId ? '📝 Edit Patient Details' : '🏥 Patient Registration'}
      </h2>

      {/* FORM SECTION */}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input name="fname" placeholder="First Name" value={formData.fname} onChange={handleChange} required />
          <input name="Last" placeholder="Last Name" value={formData.Last} onChange={handleChange} required />
        </div>
        
        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        
        <div className="form-group">
          <input name="DOB" type="date" value={formData.DOB} onChange={handleChange} required />
          <input name="phone" placeholder="Phone (e.g. 9876543210)" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>

          <select name="preference" value={formData.preference} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          {editId ? 'Save Changes' : 'Register Patient'}
        </button>
        
        {editId && (
          <button type="button" className="btn-cancel" onClick={() => {
            setEditId(null);
            setFormData({ fname: '', Last: '', email: '', DOB: '', phone: '', gender: 'M', preference: 'General' });
          }}>
            Cancel Edit
          </button>
        )}
      </form>

      <hr className="divider" />

      {/* TABLE SECTION */}
      <h2 className="title">📋 Registered Patients</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No patients found.</td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.fname} {p.Last}</strong></td>
                  <td>{p.email}</td>
                  <td>{p.phone}</td>
                  <td><span className="badge">{p.preference}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span className="page-info">Page <strong>{page}</strong> of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default App;
