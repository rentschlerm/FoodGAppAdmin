import { useState } from 'react'
import Logo from '../assets/WellNu Logo 2.svg'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from 'recharts'

const CHART_COLORS = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];

export default function Reports() {
  const [reportType, setReportType] = useState('user-activity')

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert('Export functionality coming soon!')
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
          Reports & Analytics
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🖨️ Print Report
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📊 Export to Excel
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Select Report Type:
        </label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          <option value="user-activity">User Activity Report</option>
          <option value="food-consumption">Food Consumption Report</option>
          <option value="nutrition-analysis">Nutrition Analysis Report</option>
          <option value="user-engagement">User Engagement Report</option>
        </select>
      </div>

      {/* Report Content */}
      <div className="invoice-report" style={{ 
        border: '2px solid #2c3e50', 
        borderRadius: '8px',
        backgroundColor: '#fff'
      }}>
        {/* Invoice Header for each report type */}
        <div style={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          padding: '20px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <img src={Logo} alt='WellNu Logo' style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
              WELLNU ADMIN PANEL REPORT
            </h2>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {reportType.replace('-', ' ').toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>Report ID</div>
            <div style={{ fontWeight: 'bold' }}>
              {reportType.toUpperCase() + '-' + new Date().getFullYear() + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div style={{ padding: '30px' }}>
        {reportType === 'user-activity' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={Logo} alt='WellNu Logo' style={{ height: '50px', marginBottom: '10px' }} />
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
              WellNu Admin Panel - User Activity Report
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Report Period:</strong> September 2025</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Total Users</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>8</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Active Users</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>6</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Inactive Users</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>2</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>New Registrations</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>3</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>User Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Count</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Admin</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>2</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>25%</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Moderator</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>3</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>37.5%</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>User</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>3</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>37.5%</td>
                </tr>
              </tbody>
            </table>
            
            {/* Charts for User Activity */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              {/* User Status Pie Chart */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>User Status Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active', value: 6, color: '#4CAF50' },
                        { name: 'Inactive', value: 2, color: '#f44336' }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry: any) => `${entry.value} (${((entry.value/8)*100).toFixed(0)}%)`}
                    >
                      <Cell fill="#4CAF50" />
                      <Cell fill="#f44336" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* User Role Distribution Scatter Chart */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>Role Distribution Analysis</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart data={[
                    { x: 1, y: 25, role: 'Admin', count: 2 },
                    { x: 2, y: 37.5, role: 'Moderator', count: 3 },
                    { x: 3, y: 37.5, role: 'User', count: 3 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" name="Role Index" hide />
                    <YAxis dataKey="y" name="Percentage" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} 
                             labelFormatter={(_, payload) => payload?.[0]?.payload?.role || 'Role'} />
                    <Legend />
                    <Scatter dataKey="y" fill="#2196F3" name="Role Percentage" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === 'food-consumption' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={Logo} alt='WellNu Logo' style={{ height: '50px', marginBottom: '10px' }} />
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
              WellNu Admin Panel - Food Consumption Report
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Report Period:</strong> September 2025</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Food Item</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Times Logged</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Avg Calories</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Fried Chicken</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Fast Food</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>15</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>506 cal</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Banana</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Fruits</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>8</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>40 cal</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Chicken Adobo</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>Poultry</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>12</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>350 cal</td>
                </tr>
              </tbody>
            </table>
            
            {/* Charts for Food Consumption */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              {/* Food Category Pie Chart */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>Food Category Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Fast Food', value: 15, color: CHART_COLORS[0] },
                        { name: 'Fruits', value: 8, color: CHART_COLORS[1] },
                        { name: 'Poultry', value: 12, color: CHART_COLORS[2] }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry: any) => `${entry.value}`}
                    >
                      <Cell fill={CHART_COLORS[0]} />
                      <Cell fill={CHART_COLORS[1]} />
                      <Cell fill={CHART_COLORS[2]} />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Meal Time Distribution Pie Chart */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>Meal Time Consumption</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Breakfast', value: 8, color: '#FF8C00' },
                        { name: 'Lunch', value: 15, color: '#32CD32' },
                        { name: 'Dinner', value: 12, color: '#4169E1' }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry: any) => `${entry.value}`}
                    >
                      <Cell fill="#FF8C00" />
                      <Cell fill="#32CD32" />
                      <Cell fill="#4169E1" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === 'nutrition-analysis' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={Logo} alt='WellNu Logo' style={{ height: '50px', marginBottom: '10px' }} />
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
              WellNu Admin Panel - Nutrition Analysis Report
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Analysis Period:</strong> September 2025</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg Daily Calories</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF5722' }}>1,847</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg Protein (g)</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>68.2</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg Carbs (g)</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>142.5</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg Fat (g)</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>45.8</div>
              </div>
            </div>
            
            {/* Nutrition Distribution Charts */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              {/* Macronutrient Distribution */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>Macronutrient Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Protein', value: 68.2, color: '#2196F3' },
                        { name: 'Carbs', value: 142.5, color: '#4CAF50' },
                        { name: 'Fat', value: 45.8, color: '#FF9800' }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry: any) => `${entry.value}g`}
                    >
                      <Cell fill="#2196F3" />
                      <Cell fill="#4CAF50" />
                      <Cell fill="#FF9800" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Nutrition Trend Scatter Chart */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>Nutritional Analysis Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart data={[
                    { x: 1, y: 1847, nutrient: 'Calories', value: 1847 },
                    { x: 2, y: 68.2, nutrient: 'Protein', value: 68.2 },
                    { x: 3, y: 142.5, nutrient: 'Carbs', value: 142.5 },
                    { x: 4, y: 45.8, nutrient: 'Fat', value: 45.8 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" name="Nutrient Index" hide />
                    <YAxis name="Amount" />
                    <Tooltip formatter={(value) => [value, 'Amount']} 
                             labelFormatter={(_, payload) => payload?.[0]?.payload?.nutrient || 'Nutrient'} />
                    <Legend />
                    <Scatter dataKey="y" fill="#FF5722" name="Nutritional Values" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {reportType === 'user-engagement' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={Logo} alt='WellNu Logo' style={{ height: '50px', marginBottom: '10px' }} />
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
              WellNu Admin Panel - User Engagement Report
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Generated on:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Report Period:</strong> September 2025</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Daily Active Users</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>4.2</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Food Logs/Day</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>6.8</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Avg Session Time</h4>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>8.5m</div>
              </div>
            </div>
            
            {/* Engagement Charts */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
              {/* Engagement Metrics Pie Chart */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>User Engagement Breakdown</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active Daily', value: 4.2, color: '#2196F3' },
                        { name: 'Food Logs', value: 6.8, color: '#4CAF50' },
                        { name: 'Session Time', value: 8.5, color: '#FF9800' }
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={(entry: any) => `${entry.value}`}
                    >
                      <Cell fill="#2196F3" />
                      <Cell fill="#4CAF50" />
                      <Cell fill="#FF9800" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Engagement Scatter Analysis */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4>Engagement Pattern Analysis</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart data={[
                    { x: 1, y: 4.2, metric: 'Daily Active Users', value: 4.2 },
                    { x: 2, y: 6.8, metric: 'Food Logs/Day', value: 6.8 },
                    { x: 3, y: 8.5, metric: 'Session Time (min)', value: 8.5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" name="Metric Index" hide />
                    <YAxis name="Value" />
                    <Tooltip formatter={(value) => [value, 'Value']} 
                             labelFormatter={(_, payload) => payload?.[0]?.payload?.metric || 'Metric'} />
                    <Legend />
                    <Scatter dataKey="y" fill="#9C27B0" name="Engagement Metrics" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <style>
        {`
          @media print {
            .invoice-report {
              border: none !important;
              box-shadow: none !important;
            }
            button {
              display: none !important;
            }
            select {
              display: none !important;
            }
            label {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  )
}
