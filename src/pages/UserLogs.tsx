  // Helper: sort users by dateCreated (newest first, 'N/A' as oldest)
// Helper: sort users by dateCreated (newest first, 'N/A' as oldest)
function sortAndFilterUsers(userList: User[], term: string) {
  // Filter by email (case-insensitive)
  const filtered = term.trim()
    ? userList.filter(u => (u.email || '').toLowerCase().includes(term.trim().toLowerCase()))
    : userList;
  // Sort by dateCreated (newest first, 'N/A' as oldest)
  return filtered.sort((a, b) => {
    if (a.dateCreated === 'N/A' && b.dateCreated === 'N/A') return 0;
    if (a.dateCreated === 'N/A') return 1;
    if (b.dateCreated === 'N/A') return -1;
    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
  });
}
import { useState, useEffect } from 'react'
import { apiService, type User } from '../services/apiService'

export default function UserLogs() {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch users from backend
  const fetchUsers = async (search?: string) => {
    try {
      setLoading(true)
      setError('')
      const response = await apiService.getUsers(search)
      
      if (response.users) {
        // Normalize user data
        const normalizedUsers = response.users.map(user => ({
          ...user,
          name: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          dateCreated: user.createdAt || user.dateCreated || 'N/A'
        }));
        setAllUsers(normalizedUsers);
        // Initial sort and filter
        setUsers(sortAndFilterUsers(normalizedUsers, searchTerm));
      } else {
        throw new Error('No users data received from backend')
      }
    } catch (err) {
      console.error('Failed to fetch users from backend:', err)
      setError(`Backend connection failed: ${err instanceof Error ? err.message : 'Unknown error'}. Make sure your backend server is running.`)
      // Only use mock data as absolute last resort
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle search with debouncing
  // Only fetch once, then filter/sort locally
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setUsers(sortAndFilterUsers(allUsers, searchTerm));
  }, [searchTerm, allUsers]);

  const toggleUserStatus = async (userId: number) => {
    try {
      await apiService.toggleUserStatus(userId)
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active', isActive: !user.isActive }
            : user
        )
      )
    } catch (err) {
      console.error('Failed to toggle user status:', err)
      alert('Failed to update user status. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }} data-testid="users-loading">
        Loading users...
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh' }} data-testid="user-logs-container">
      <div style={{ 
        background: '#fff',
        borderRadius: '8px',
        border: '1px solid #e1e5e9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: '#2c3e50',
            fontSize: '18px',
            fontWeight: '600',
            borderBottom: '2px solid #3498db',
            paddingBottom: '8px'
          }} data-testid="users-header">
            👤 User Management ({users.length})
          </h3>
          
          {error && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              border: '1px solid #ffeaa7'
            }} data-testid="users-error">
              {error}
            </div>
          )}
          
          <div style={{ position: 'relative', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              data-testid="user-search-input"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 40px 12px 16px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                color: '#2c3e50',
                backgroundColor: '#fff'
              }}
            />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999'
            }}>
              🔍
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {/* Main users table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }} data-testid="users-table">
            <thead>
              <tr>
                <th style={{ 
                  backgroundColor: '#34495e', 
                  color: '#fff', 
                  padding: '12px 8px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  border: '1px solid #2c3e50',
                  fontSize: '14px'
                }}>First Name</th>
                <th style={{ 
                  backgroundColor: '#34495e', 
                  color: '#fff', 
                  padding: '12px 8px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  border: '1px solid #2c3e50',
                  fontSize: '14px'
                }}>Email</th>
                <th style={{ 
                  backgroundColor: '#34495e', 
                  color: '#fff', 
                  padding: '12px 8px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  border: '1px solid #2c3e50',
                  fontSize: '14px'
                }}>Role</th>
                <th style={{ 
                  backgroundColor: '#34495e', 
                  color: '#fff', 
                  padding: '12px 8px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  border: '1px solid #2c3e50',
                  fontSize: '14px'
                }}>Status</th>
                <th style={{ 
                  backgroundColor: '#34495e', 
                  color: '#fff', 
                  padding: '12px 8px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  border: '1px solid #2c3e50',
                  fontSize: '14px'
                }}>Date created</th>
                <th style={{ 
                  backgroundColor: '#34495e', 
                  color: '#fff', 
                  padding: '12px 8px', 
                  textAlign: 'left', 
                  fontWeight: '600', 
                  border: '1px solid #2c3e50',
                  fontSize: '14px'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }} data-testid={`user-row-${user.id}`}>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #ddd', 
                    color: '#2c3e50', 
                    backgroundColor: '#fff' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {(user.firstName || user.name || '').charAt(0)}
                      </div>
                      {(user.firstName || (user.name ? user.name.split(' ')[0] : ''))}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #ddd', 
                    color: '#2c3e50', 
                    backgroundColor: '#fff' 
                  }}>{user.email}</td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #ddd', 
                    color: '#2c3e50', 
                    backgroundColor: '#fff' 
                  }}>{user.role}</td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #ddd', 
                    color: '#2c3e50', 
                    backgroundColor: '#fff' 
                  }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: user.status === 'Active' ? '#d4edda' : '#f8d7da',
                      color: user.status === 'Active' ? '#155724' : '#721c24'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #ddd', 
                    color: '#2c3e50', 
                    backgroundColor: '#fff' 
                  }}>
                    {user.dateCreated !== 'N/A' 
                      ? new Date(user.dateCreated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '10px 8px', 
                    border: '1px solid #ddd', 
                    color: '#2c3e50', 
                    backgroundColor: '#fff' 
                  }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          backgroundColor: user.status === 'Active' ? '#dc3545' : '#28a745',
                          color: 'white'
                        }}
                        data-testid={`toggle-status-${user.id}`}
                      >
                        {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button style={{
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        backgroundColor: '#ffc107',
                        color: 'white'
                      }}>
                        ▶
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && searchTerm && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No users found matching "{searchTerm}"
        </div>
      )}
    </div>
  )
}
