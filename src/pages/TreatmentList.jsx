import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTreatments, deleteTreatment, addTreatment, selectAllTreatments } from '../redux/slices/treatmentSlice'
import { selectCurrentUser, logout } from '../redux/slices/authSlice';
import { FaPlus, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

const TreatmentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const treatments = useSelector(selectAllTreatments);
  const user = useSelector(selectCurrentUser);
  const [open, setOpen] = useState(false);
  const [treatment, setTreatment] = useState({ 
    name: '', 
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchTreatments());
    } else {
      navigate('/login');
    }
  }, [dispatch, user, navigate]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTreatment({ 
      name: '', 
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleChange = (e) => {
    setTreatment({
      ...treatment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (!treatment.name.trim()) {
      toast.error('Please enter a treatment name');
      return;
    }
    dispatch(addTreatment(treatment));
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      try {
        const resultAction = await dispatch(deleteTreatment(id));
        if (deleteTreatment.fulfilled.match(resultAction)) {
          toast.success('Treatment deleted successfully');
        } else if (deleteTreatment.rejected.match(resultAction)) {
          toast.error(resultAction.payload || 'Failed to delete treatment');
        }
      } catch (error) {
        toast.error(error.message || 'An error occurred while deleting the treatment');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-semibold">Treatment Management - {user?.name}</h1>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Treatments</h2>
            <button
              onClick={handleOpen}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" />
              Add Treatment
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {treatments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No treatments found. Add one to get started!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {treatments.map((t) => (
                  <li key={t._id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{t.description}</p>
                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                          <div>Dosage: {t.dosage || 'N/A'}</div>
                          <div>Frequency: {t.frequency || 'N/A'}</div>
                          <div>Start Date: {new Date(t.startDate).toLocaleDateString()}</div>
                          <div>End Date: {new Date(t.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="ml-4 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Delete treatment"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Add Treatment Modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              aria-hidden="true"
              onClick={handleClose}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9998
              }}
            ></div>
            
            {/* Modal panel */}
            <div 
              className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
              style={{
                position: 'relative',
                zIndex: 9999,
                margin: '2rem auto',
                maxWidth: '32rem',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Treatment</h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Treatment Name *</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={treatment.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={treatment.startDate}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={treatment.endDate}
                      onChange={handleChange}
                      min={treatment.startDate || ''}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
                      <input
                        type="text"
                        name="dosage"
                        id="dosage"
                        value={treatment.dosage}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                      <input
                        type="text"
                        name="frequency"
                        id="frequency"
                        value={treatment.frequency}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!treatment.name || !treatment.dosage || !treatment.frequency || !treatment.startDate || !treatment.endDate}
                >
                  Add Treatment
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-right" />
    </div>
  );
};

export default TreatmentList;