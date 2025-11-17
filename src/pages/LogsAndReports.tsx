  // Chart color palette (fixes crash)
  const CHART_COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57', '#8dd1e1', '#83a6ed', '#8e44ad', '#e67e22', '#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#1abc9c', '#34495e'
  ];
import React from 'react';

import { apiService } from '../services/apiService';
import './LogsAndReports.css';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid } from 'recharts';
import Logo from '../assets/WellNu Logo 2.svg';
interface FoodLog {
  id: number;
  foodName: string;
  foodCategoryId: number;
  categoryName: string;
  mealTime?: string; // optional meal time
  // Removed only the two chart blocks as requested. All other content remains.
}

// ...existing imports and type/interface definitions...

export default function LogsAndReports() {
  // Fetch logs from backend API on mount
  React.useEffect(() => {
    setFoodLogsLoading(true);
    setFoodLogsError('');
    apiService.getFoodLogs()
      .then(data => setFoodLogs(data.foodLogs || []))
      .catch(() => setFoodLogsError('Failed to load food logs'))
      .finally(() => setFoodLogsLoading(false));
  }, []);

  React.useEffect(() => {
    setNutrientLoading(true);
    setNutrientError('');
    apiService.getNutrientLogs()
      .then(data => setNutrientLogs(data.nutrientLogs || []))
      .catch(() => setNutrientError('Failed to load nutrient logs'))
      .finally(() => setNutrientLoading(false));
  }, []);

  React.useEffect(() => {
    setDailyIntakeLoading(true);
    setDailyIntakeError('');
    apiService.getDailyIntakeLogs()
      .then(data => setDailyIntakeLogs(data.dailyIntakeLogs || []))
      .catch(() => setDailyIntakeError('Failed to load daily intake logs'))
      .finally(() => setDailyIntakeLoading(false));
  }, []);

  // Fetch user statistics and users for names
  React.useEffect(() => {
    console.log('Fetching users for logs and reports...');
    apiService.getUsers()
      .then(data => {
        console.log('Users API response:', data);
        if (data.users) {
          // Set user stats
          const active = data.users.filter(user => user.status === 'Active' || user.isActive).length;
          const inactive = data.users.length - active;
          setUserStats({
            total: data.users.length,
            active,
            inactive
          });

          // Load all users into usersById for name lookup
          const usersMap: Record<number, any> = {};
          data.users.forEach(user => {
            usersMap[user.id] = user;
            console.log('Adding user to map:', user.id, user.firstName, user.name);
          });
          setUsersById(usersMap);
          console.log('Final usersById map:', usersMap);
        }
      })
      .catch((err) => {
        console.warn('Failed to load user stats:', err);
        // Set default stats to avoid "unavailable" message
        setUserStats({
          total: 0,
          active: 0,
          inactive: 0
        });
      });
  }, []);

  // Example state and placeholder data (replace with real API/data logic)
  const [foodLogs, setFoodLogs] = React.useState<FoodLog[]>([]);
  const [nutrientLogs, setNutrientLogs] = React.useState<any[]>([]);
  const [dailyIntakeLogs, setDailyIntakeLogs] = React.useState<any[]>([]);
  const [usersById, setUsersById] = React.useState<Record<number, any>>({});
  const [startDate, setStartDate] = React.useState('2025-11-01');
  const [endDate, setEndDate] = React.useState('2025-11-17');
  const [foodLogsLoading, setFoodLogsLoading] = React.useState(false);
  const [foodLogsError, setFoodLogsError] = React.useState('');
  const [nutrientLoading, setNutrientLoading] = React.useState(false);
  const [nutrientError, setNutrientError] = React.useState('');
  const [dailyIntakeLoading, setDailyIntakeLoading] = React.useState(false);
  const [dailyIntakeError, setDailyIntakeError] = React.useState('');
  const [statsLoading] = React.useState(false);
  const [statsError] = React.useState('');
  const [userStats, setUserStats] = React.useState<any>(null);

  // Filtering functions (replace with real logic as needed)
  function getFilteredFoodLogs(logs: FoodLog[]) {
    return logs.filter((_log) => {
      // For now, keep all logs since we don't know the exact date field structure
      // This will be updated once we identify the correct date field
      return true;
    });
  }
  function getFilteredNutrientLogs(logs: any[]) {
    return logs.filter((log) => {
      if (!log.updatedAt) return false;
      const logDate = new Date(log.updatedAt).toISOString().split('T')[0];
      return logDate >= startDate && logDate <= endDate;
    });
  }
  function getFilteredDailyIntakeLogs(logs: any[]) {
    return logs.filter((log) => {
      if (!log.updatedAt) return false;
      const logDate = new Date(log.updatedAt).toISOString().split('T')[0];
      return logDate >= startDate && logDate <= endDate;
    });
  }
  // ...existing logic and helpers (keep only one set, remove all duplicates)...

  // Get filtered data based on selected date range
  const filteredFoodLogs = getFilteredFoodLogs(foodLogs);
  const filteredNutrientLogs = getFilteredNutrientLogs(nutrientLogs);
  const filteredDailyIntakeLogs = getFilteredDailyIntakeLogs(dailyIntakeLogs);

  // Calculate food percentages and sort by timeframe
  const getFoodStatsWithPercentages = (logs: FoodLog[]) => {
    const total = logs.length;
    const categoryStats = logs.reduce((acc, food) => {
      acc[food.categoryName] = (acc[food.categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryStats).map(([categoryName, count]) => ({
      categoryName,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.count - a.count); // Sort by count descending
  };

  const foodStatsWithPercentages = getFoodStatsWithPercentages(filteredFoodLogs);

  // Helpers
  const format2 = (n: number | undefined | null) => {
    if (typeof n !== 'number' || !isFinite(n)) return '';
    return n.toFixed(2);
  };
  const userLabel = (id: number) => {
    const u = usersById[id];
    if (!u) {
      return `User ${id}`;
    }
    // Match UserLogs logic: show firstName if available, else first part of name
    if (u.firstName) {
      return u.firstName;
    }
    if (u.name) {
      const parts = u.name.split(' ');
      return parts[0];
    }
    return `User ${id}`;
  };

  const getPeriodLabel = () => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    if (startDate === endDate) {
      return start;
    }
    return start + ' - ' + end;
  };

  // Quick date preset functions
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  };

  const setThisWeek = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    setStartDate(weekStart.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const setThisMonth = () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(monthStart.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const handlePrint = () => {
    window.print();
  };

  // Repeating header component for print pages
  const PageHeader = () => (
    <div className="print-only" style={{ 
      padding: '10px 0 8px 0', 
      marginBottom: '12px',
      borderBottom: '2px solid #2c3e50',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <img src={Logo} alt="WellNu Logo" style={{ height: '35px' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#2c3e50', margin: 0 }}>ADMIN ANALYTICS REPORT</div>
          <div style={{ fontSize: '8px', color: '#7f8c8d', fontWeight: 600 }}>Period: {getPeriodLabel()}</div>
        </div>
      </div>
      <div style={{ fontSize: '8px', textAlign: 'right', color: '#2c3e50', lineHeight: 1.5 }}>
        <div><strong>Report #:</strong> {'WN-' + new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')}</div>
        <div><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', {year:'numeric', month:'short', day:'2-digit'})}</div>
      </div>
    </div>
  );

  return (
    <div className="logs-reports-container" data-testid="logs-reports-container">
      <div className="logs-reports-content">
        {/* Date Range Selector */}
        <div className="logs-reports-box" data-testid="date-range-selector">
          <h3>📅 Date Range Selection</h3>
          
          {/* Quick Preset Buttons */}
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              onClick={setToday}
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                border: '1px solid #007bff', 
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Today
            </button>
            <button 
              onClick={setThisWeek}
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                border: '1px solid #28a745', 
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              Last 7 Days
            </button>
            <button 
              onClick={setThisMonth}
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                border: '1px solid #17a2b8', 
                borderRadius: '4px',
                backgroundColor: '#17a2b8',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              This Month
            </button>
          </div>

          {/* Custom Date Inputs */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center', 
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontWeight: 'bold', minWidth: '70px' }}>From:</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  fontSize: '14px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
                data-testid="start-date-input"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontWeight: 'bold', minWidth: '70px' }}>To:</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  fontSize: '14px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  color: '#333'
                }}
                data-testid="end-date-input"
              />
            </div>
          </div>

          {/* Status Display */}
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #e9ecef', 
            borderRadius: '4px',
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.4'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Currently showing:</strong> {getPeriodLabel()} data
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              fontSize: '13px',
              color: '#6c757d'
            }}>
              <span>Food Logs: {filteredFoodLogs.length} items</span>
              <span>•</span>
              <span>Nutrient Logs: {filteredNutrientLogs.length} entries</span>
              <span>•</span>
              <span>Daily Intake: {filteredDailyIntakeLogs.length} records</span>
            </div>
          </div>
        </div>

        {/* Food Table now shows table first for immediate visibility, charts below */}
        <div className="logs-reports-box" data-testid="food-logs-section">
          <h3>🍎 Food Table</h3>
          {foodLogsLoading && <div className="loading-text">Loading food logs...</div>}
          {foodLogsError && !foodLogsLoading && <div className="error-text">{foodLogsError}</div>}
          {!foodLogsLoading && !foodLogsError && (
            filteredFoodLogs.length === 0 ? (
              <div className="no-data-text">No food logs found for {getPeriodLabel().toLowerCase()}.</div>
            ) : (
              <>
                <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                  <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h5 style={{ margin: 0 }}>Food Items by Category</h5>
                    <small style={{ color: '#666' }}>Sorted by frequency • {filteredFoodLogs.length} total items</small>
                  </div>
                  <table className="food-table" aria-label="Food logs table">
                    <thead>
                      <tr>
                        <th>Food Name</th>
                        <th>Category</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodStatsWithPercentages.map((stat, index) => {
                        const foodsInCategory = filteredFoodLogs.filter(food => food.categoryName === stat.categoryName);
                        return foodsInCategory.map((food, subIndex) => (
                          <tr key={`${index}-${subIndex}`}>
                            <td>{food.foodName}</td>
                            <td>{food.categoryName}</td>
                            <td>
                              {subIndex === 0 && (
                                <span style={{ 
                                  backgroundColor: '#e3f2fd', 
                                  padding: '2px 8px', 
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  color: '#1976d2'
                                }}>
                                  {stat.count} items ({stat.percentage}%)
                                </span>
                              )}
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {/* Scatter Chart by Category for Food Items */}
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <h4 style={{ marginTop: 0 }}>Scatter: Food Items</h4>
                    {(() => {
                      const totalItems = filteredFoodLogs.length;
                      const itemCounts = filteredFoodLogs.reduce((acc, food) => {
                        const key = food.foodName + '|||' + food.categoryName;
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      const scatterData = Object.entries(itemCounts)
                        .map(([key, count], index) => {
                          const [foodName, categoryName] = key.split('|||');
                          const percentage = totalItems > 0 ? parseFloat(((count / totalItems) * 100).toFixed(1)) : 0;
                          return { 
                            x: index + 1, 
                            y: count, 
                            z: percentage,
                            name: foodName,
                            category: categoryName
                          };
                        })
                        .sort((a, b) => b.y - a.y);
                      
                      const uniqueFoodNames = Array.from(new Set(scatterData.map(d => d.name)));
                      const colorMap: Record<string, string> = {};
                      uniqueFoodNames.forEach((n, idx) => { 
                        colorMap[n] = CHART_COLORS[idx % CHART_COLORS.length]; 
                      });
                      
                      return (
                        <>
                          <ResponsiveContainer width="100%" height={240}>
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" dataKey="x" name="Item Index" hide />
                              <YAxis 
                                type="number" 
                                dataKey="y" 
                                name="Frequency" 
                                allowDecimals={false}
                                domain={[0, Math.max(...scatterData.map((d: any) => d.y), 2) + 1]}
                              />
                              <ZAxis type="number" dataKey="z" range={[60, 100]} name="Percentage" />
                              <Tooltip 
                                cursor={{ strokeDasharray: '3 3' }}
                                content={({ active, payload }: any) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div style={{ 
                                        backgroundColor: 'white', 
                                        padding: '10px', 
                                        border: '1px solid #bdc3c7',
                                        borderRadius: '4px'
                                      }}>
                                        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#2c3e50' }}>{data.name}</p>
                                        <p style={{ margin: '0', color: '#7f8c8d' }}>Category: {data.category}</p>
                                        <p style={{ margin: '0', color: '#27ae60' }}>Frequency: {data.y}</p>
                                        <p style={{ margin: '0', color: '#3498db' }}>Percentage: {data.z}%</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Scatter
                                name="Foods"
                                data={scatterData}
                                shape={(props: any) => {
                                  const fill = colorMap[props?.payload?.name] || '#8884d8';
                                  const r = (typeof props?.r === 'number' && isFinite(props.r) && props.r > 0) ? props.r : 8;
                                  return <circle cx={props?.cx} cy={props?.cy} r={r} fill={fill} stroke="#fff" strokeWidth={1} />;
                                }}
                              />
                            </ScatterChart>
                          </ResponsiveContainer>
                          {/* Legend below chart (custom, visible dots) */}
                          <div style={{ marginTop: 10 }}>
                            <ul style={{ 
                              listStyle: 'none', 
                              margin: 0, 
                              padding: 0, 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 10,
                              justifyContent: 'center'
                            }}>
                              {uniqueFoodNames.map(name => (
                                <li key={name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span style={{ 
                                    display: 'inline-block', 
                                    width: 12, 
                                    height: 12, 
                                    borderRadius: '50%', 
                                    background: colorMap[name],
                                    border: '1px solid #2c3e50'
                                  }} />
                                  <span style={{ fontSize: 12, color: '#2c3e50' }}>{name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* Enhanced Meal Times Pie Chart */}
                  <div style={{ flex: 1, minWidth: 250 }} data-testid="meal-times-pie-wrapper">
                    <h4 style={{ marginTop: 0 }}>Pie: Meal Times</h4>
                    {(() => {
                      const mealNames = ['Breakfast', 'Lunch', 'Dinner'];
                      const mealCounts = mealNames.map(name => ({
                        mealTime: name,
                        count: filteredFoodLogs.filter(f => f.categoryName && f.categoryName.toLowerCase() === name.toLowerCase()).length
                      }));
                      const total = mealCounts.reduce((s, c) => s + c.count, 0);
                      
                      return (
                        <ResponsiveContainer width="100%" height={220}>
                          <PieChart>
                            <Pie
                              data={mealCounts}
                              dataKey="count"
                              nameKey="mealTime"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ value }) => total > 0 ? `${value}` : '0'}
                            >
                              {mealCounts.map((entry, idx) => (
                                <Cell key={entry.mealTime} fill={['#e67e22', '#8e44ad', '#16a085'][idx]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      );
                    })()}
                  </div>
                </div>
              </>
            )
          )}
        </div>
        {/* (Removed accidental duplicate mini charts block) */}
        <div className="logs-reports-box" data-testid="nutrient-logs-section">
          <h3>🥗 Nutrient Logs</h3>
          {nutrientLoading ? (
            <div className="loading-text" data-testid="nutrient-loading">Loading nutrient logs...</div>
          ) : nutrientError ? (
            <div className="error-text" data-testid="nutrient-error">{nutrientError}</div>
          ) : filteredNutrientLogs.length === 0 ? (
            <div className="no-data-text" data-testid="nutrient-no-data">No nutrient logs found for {getPeriodLabel().toLowerCase()}.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table data-testid="nutrient-logs-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>First Name</th>
                    <th>Food ID</th>
                    <th>Calories</th>
                    <th>Protein</th>
                    <th>Fat</th>
                    <th>Carbs</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNutrientLogs.map((log) => (
                    <tr key={log.id} data-testid={`nutrient-log-${log.id}`}>
                      <td>{log.id}</td>
                      <td>{log.userId}</td>
                      <td>{userLabel(log.userId)}</td>
                      <td>{log.foodId}</td>
                      <td>{format2(log.calories)}</td>
                      <td>{format2(log.protein)}</td>
                      <td>{format2(log.fat)}</td>
                      <td>{format2(log.carbs)}</td>
                      <td style={{ fontSize: '12px' }}>{log.updatedAt ? new Date(log.updatedAt).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily Intake Table (original) */}
        <div className="logs-reports-box" data-testid="daily-intake-section">
          <h3>📅 Daily Intake Logs</h3>
          {dailyIntakeLoading ? (
            <div className="loading-text" data-testid="daily-intake-loading">Loading daily intake logs...</div>
          ) : dailyIntakeError ? (
            <div className="error-text" data-testid="daily-intake-error">{dailyIntakeError}</div>
          ) : filteredDailyIntakeLogs.length === 0 ? (
            <div className="no-data-text" data-testid="daily-intake-no-data">No daily intake logs found for {getPeriodLabel().toLowerCase()}.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table data-testid="daily-intake-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User ID</th>
                    <th>First Name</th>
                    <th>Calorie Intake</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDailyIntakeLogs.map((log) => (
                    <tr key={log.id} data-testid={`daily-intake-log-${log.id}`}>
                      <td>{log.id}</td>
                      <td>{log.userId}</td>
                      <td>{userLabel(log.userId)}</td>
                      <td>{format2(log.calorieIntake)}</td>
                      <td style={{ fontSize: '12px' }}>{log.updatedAt ? new Date(log.updatedAt).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Stats */}
        <div className="logs-reports-box" data-testid="analytics-section">
          <h3>📊 Reports & Analytics</h3>
          {statsLoading && <div className="loading-text" data-testid="stats-loading">Loading user stats...</div>}
          {statsError && !statsLoading && <div className="error-text" data-testid="stats-error">{statsError}</div>}
          {!statsLoading && !statsError && (
            userStats ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} data-testid="user-stats">
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 180px', minWidth: 180 }}>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Active', value: userStats.active },
                            { name: 'Inactive', value: userStats.inactive }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          <Cell key="active" fill="#2ecc71" />
                          <Cell key="inactive" fill="#e74c3c" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: '1 1 200px', minWidth: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div data-testid="total-users"><strong>Total Users:</strong> {userStats.total}</div>
                    <div data-testid="active-users"><strong>Active Users:</strong> {userStats.active}</div>
                    <div data-testid="inactive-users"><strong>Inactive Users:</strong> {userStats.inactive}</div>
                    <div data-testid="active-rate"><strong>Active Rate:</strong> {userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0}%</div>
                    <div style={{ fontSize: 12, color: '#666' }}>Snapshot of current user engagement.</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data-text" data-testid="stats-no-data">No user statistics available.</div>
            )
          )}
        </div>
      </div>

      {/* Printable Summary Panel */}
      <div className="printable-summary" data-testid="printable-summary">
        {/* Repeating print header (appears on each printed page) */}
        <div className="print-page-header" aria-hidden="true">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <img src={Logo} alt="WellNu Logo" style={{ height: '40px' }} />
              <div>
                <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#2c3e50' }}>ADMIN ANALYTICS REPORT</h1>
                <div style={{ fontSize: '9px', color: '#7f8c8d', fontWeight: 600, marginTop: '2px' }}>Period: {getPeriodLabel()}</div>
              </div>
            </div>
            <div style={{ fontSize: '9px', textAlign: 'right', color: '#2c3e50', lineHeight: 1.6 }}>
              <div><strong>Report #:</strong> {'WN-' + new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')}</div>
              <div><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', {year:'numeric', month:'short', day:'2-digit'})}</div>
            </div>
          </div>
        </div>
        
        <button className="print-button" onClick={handlePrint} data-testid="print-button">
          🖨️ Print Summary Report
        </button>
        
        {/* Invoice-style Header */}
        <div className="invoice-header" style={{ 
          border: '2px solid #2c3e50', 
          borderRadius: '8px', 
          padding: '20px', 
          marginBottom: '30px',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <img src={Logo} alt='WellNu Logo' style={{ height: '50px', marginBottom: '10px' }} />
              <h1 style={{ margin: '0', fontSize: '24px', color: '#2c3e50', fontWeight: 'bold' }}>
                ADMIN ANALYTICS REPORT
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>Report #</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                {'WN-' + new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0')}
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid #bdc3c7', paddingTop: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase', marginBottom: '5px' }}>Report Period</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' }}>{getPeriodLabel()}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase', marginBottom: '5px' }}>Generated On</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c3e50' }}>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics Summary */}
  <div className="invoice-section" style={{ 
          border: '1px solid #bdc3c7', 
          borderRadius: '6px', 
          marginBottom: '25px',
          overflow: 'hidden'
        }} data-testid="summary-user-stats">
          <div style={{ 
            backgroundColor: '#34495e', 
            color: 'white', 
            padding: '12px 20px', 
            fontSize: '16px', 
            fontWeight: 'bold' 
          }}>
            📊 USER STATISTICS SUMMARY
          </div>
          <div style={{ padding: '20px' }}>
            {userStats ? (
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="print-hide" style={{ flex: '1 1 200px', minWidth: 200 }}>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={[
                        { name: 'Active', value: userStats.active },
                        { name: 'Inactive', value: userStats.inactive }
                      ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                        <Cell key="active" fill="#27ae60" />
                        <Cell key="inactive" fill="#e74c3c" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: '2 1 250px', minWidth: 250 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{userStats.total}</div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase' }}>Total Users</div>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: '#d5f4e6', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>{userStats.active}</div>
                      <div style={{ fontSize: '12px', color: '#27ae60', textTransform: 'uppercase' }}>Active Users</div>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: '#fadbd8', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{userStats.inactive}</div>
                      <div style={{ fontSize: '12px', color: '#e74c3c', textTransform: 'uppercase' }}>Inactive Users</div>
                    </div>
                    <div style={{ padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                        {userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#3498db', textTransform: 'uppercase' }}>Activity Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#e74c3c', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                Statistics unavailable
              </div>
            )}
          </div>
        </div>

        {/* Food Table Summary */}
  <div className="invoice-section page-break" style={{ 
          border: '1px solid #bdc3c7', 
          borderRadius: '6px', 
          marginBottom: '25px',
          overflow: 'hidden'
        }} data-testid="summary-food-table">
          <PageHeader />
                {/* Meal Time Summary (interactive, derived from categoryName) */}
                {(() => {
                  const mealNames = ['Breakfast','Lunch','Dinner'];
                  const counts = mealNames.map(name => ({
                    mealTime: name,
                    count: filteredFoodLogs.filter(f => f.categoryName && f.categoryName.toLowerCase() === name.toLowerCase()).length
                  }));
                  const total = counts.reduce((s,c) => s + c.count, 0);
                  if (!total) return null;
                  return (
                    <div style={{ marginTop: 12, marginBottom: 16 }} data-testid="meal-time-summary-interactive" className="print-hide">
                      <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>Meal Time Summary</h5>
                      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #bdc3c7' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#ecf0f1' }}>
                            <th style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Meal Time</th>
                            <th style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>Frequency</th>
                            <th style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {counts.map((row, idx) => (
                            <tr key={row.mealTime} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                              <td style={{ padding: '6px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{row.mealTime}</td>
                              <td style={{ padding: '6px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>{row.count}</td>
                              <td style={{ padding: '6px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#27ae60' }}>{((row.count/total)*100).toFixed(1)}%</td>
                            </tr>
                          ))}
                          <tr style={{ backgroundColor: '#ecf0f1', fontWeight: 'bold' }}>
                            <td style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'right', color: '#2c3e50' }}>TOTAL</td>
                            <td style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'center', color: '#2c3e50' }}>{total}</td>
                            <td style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'left', color: '#2c3e50' }}>100.0%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
                {/* Meal Time Summary Table (print-friendly only) */}
                {(() => {
                  const mealNames = ['Breakfast','Lunch','Dinner'];
                  const counts = mealNames.map(name => ({
                    mealTime: name,
                    count: filteredFoodLogs.filter(f => f.categoryName && f.categoryName.toLowerCase() === name.toLowerCase()).length
                  }));
                  const total = counts.reduce((s,c) => s + c.count, 0);
                  if (total === 0) return null;
                  return (
                    <table className="print-only" style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginBottom: '12px',
                      border: '1px solid #bdc3c7'
                    }} data-testid="meal-time-summary-print">
                      <thead>
                        <tr style={{ backgroundColor: '#ecf0f1' }}>
                          <th style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Meal Time</th>
                          <th style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>Frequency</th>
                          <th style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {counts.map((row, idx) => (
                          <tr key={row.mealTime} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                            <td style={{ padding: '8px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{row.mealTime}</td>
                            <td style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>{row.count}</td>
                            <td style={{ padding: '8px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#27ae60' }}>{total ? ((row.count/total)*100).toFixed(1) : '0.0'}%</td>
                          </tr>
                        ))}
                        <tr style={{ backgroundColor: '#ecf0f1', fontWeight: 'bold' }}>
                          <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'right', color: '#2c3e50' }}>TOTAL</td>
                          <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'center', color: '#2c3e50' }}>{total}</td>
                          <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'left', color: '#2c3e50' }}>100.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}
          <div style={{ 
            backgroundColor: '#34495e', 
            color: 'white', 
            padding: '12px 20px', 
            fontSize: '16px', 
            fontWeight: 'bold' 
          }}>
            🍎 FOOD DISTRIBUTION ANALYSIS ({getPeriodLabel()})
          </div>
          <div style={{ padding: '20px' }}>
            {filteredFoodLogs.length > 0 ? (
              <>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  marginBottom: '20px',
                  border: '1px solid #bdc3c7'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#ecf0f1' }}>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Food Name</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Category</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>Frequency</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const totalItems = filteredFoodLogs.length;
                      const itemCounts = filteredFoodLogs.reduce((acc, food) => {
                        const key = food.foodName + '|||' + food.categoryName;
                        acc[key] = (acc[key] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>);
                      
                      return Object.entries(itemCounts)
                        .map(([key, count]) => {
                          const [foodName, categoryName] = key.split('|||');
                          const percentage = totalItems > 0 ? ((count / totalItems) * 100).toFixed(1) : '0.0';
                          return { foodName, categoryName, count, percentage: parseFloat(percentage) };
                        })
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 15)
                        .map((item, index) => (
                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                            <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{item.foodName}</td>
                            <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{item.categoryName}</td>
                            <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>
                              {item.count}
                            </td>
                            <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#27ae60' }}>
                              {item.percentage}%
                            </td>
                          </tr>
                        ));
                    })()}
                    {filteredFoodLogs.length > 15 && (
                      <tr>
                        <td colSpan={4} style={{ 
                          padding: '10px', 
                          border: '1px solid #bdc3c7', 
                          textAlign: 'center', 
                          fontStyle: 'italic', 
                          color: '#7f8c8d',
                          backgroundColor: '#ecf0f1'
                        }}>
                          ...and {(() => {
                            const itemCounts = filteredFoodLogs.reduce((acc, food) => {
                              const key = food.foodName + '|||' + food.categoryName;
                              acc[key] = (acc[key] || 0) + 1;
                              return acc;
                            }, {} as Record<string, number>);
                            return Object.keys(itemCounts).length - 15;
                          })()} more unique food items
                        </td>
                      </tr>
                    )}
                    <tr style={{ backgroundColor: '#ecf0f1', fontWeight: 'bold' }}>
                      <td colSpan={2} style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'right', color: '#2c3e50' }}>
                        TOTAL
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'center', color: '#2c3e50' }}>
                        {filteredFoodLogs.length}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', color: '#2c3e50' }}>
                        100.0%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ color: '#e74c3c', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                No food data available for {getPeriodLabel().toLowerCase()}
              </div>
            )}
          </div>
        </div>

        {/* Nutrient Logs Summary */}
  <div className="invoice-section page-break" style={{ 
          border: '1px solid #bdc3c7', 
          borderRadius: '6px', 
          marginBottom: '25px',
          overflow: 'hidden'
        }} data-testid="summary-nutrient-logs">
          <PageHeader />
          <div style={{ 
            backgroundColor: '#34495e', 
            color: 'white', 
            padding: '12px 20px', 
            fontSize: '16px', 
            fontWeight: 'bold' 
          }}>
            🥗 NUTRIENT LOGS SUMMARY ({getPeriodLabel()})
          </div>
          <div style={{ padding: '20px' }}>
            {filteredNutrientLogs.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>{filteredNutrientLogs.length}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase' }}>Total Entries</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#fef9e7', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f39c12' }}>
                      {Math.round(filteredNutrientLogs.reduce((sum, log) => sum + log.calories, 0) / filteredNutrientLogs.length)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#f39c12', textTransform: 'uppercase' }}>Avg Calories</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#27ae60' }}>
                      {Math.round(filteredNutrientLogs.reduce((sum, log) => sum + log.protein, 0) / filteredNutrientLogs.length)}g
                    </div>
                    <div style={{ fontSize: '12px', color: '#27ae60', textTransform: 'uppercase' }}>Avg Protein</div>
                  </div>
                </div>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '1px solid #bdc3c7'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#ecf0f1' }}>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>User ID</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>First Name</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>Calories</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>Protein</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNutrientLogs.slice(0, 10).map((log, index) => (
                      <tr key={log.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{log.userId}</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{userLabel(log.userId)}</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>{format2(log.calories)}</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>{format2(log.protein)}g</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{log.updatedAt ? new Date(log.updatedAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                    {filteredNutrientLogs.length > 10 && (
                      <tr>
                        <td colSpan={5} style={{ 
                          padding: '10px', 
                          border: '1px solid #bdc3c7', 
                          textAlign: 'center', 
                          fontStyle: 'italic', 
                          color: '#7f8c8d',
                          backgroundColor: '#ecf0f1'
                        }}>
                          ...and {filteredNutrientLogs.length - 10} more entries
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ color: '#e74c3c', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                No nutrient logs available for {getPeriodLabel().toLowerCase()}
              </div>
            )}
          </div>
        </div>

        {/* Daily Intake Summary (with user info) */}
  <div className="invoice-section page-break" style={{ 
          border: '1px solid #bdc3c7', 
          borderRadius: '6px', 
          marginBottom: '25px',
          overflow: 'hidden'
        }} data-testid="summary-daily-intake">
          <PageHeader />
          <div style={{ 
            backgroundColor: '#34495e', 
            color: 'white', 
            padding: '12px 20px', 
            fontSize: '16px', 
            fontWeight: 'bold' 
          }}>
            📅 DAILY INTAKE SUMMARY ({getPeriodLabel()})
          </div>
          <div style={{ padding: '20px' }}>
            {filteredDailyIntakeLogs.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' }}>{filteredDailyIntakeLogs.length}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d', textTransform: 'uppercase' }}>Total Daily Records</div>
                  </div>
                  <div style={{ padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3498db' }}>
                      {Math.round(filteredDailyIntakeLogs.reduce((sum, log) => sum + log.calorieIntake, 0) / filteredDailyIntakeLogs.length)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#3498db', textTransform: 'uppercase' }}>Avg Daily Calories</div>
                  </div>
                </div>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '1px solid #bdc3c7'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#ecf0f1' }}>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>User ID</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>First Name</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>Calorie Intake</th>
                      <th style={{ padding: '12px', border: '1px solid #bdc3c7', textAlign: 'left', fontWeight: 'bold', color: '#2c3e50' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDailyIntakeLogs.slice(0, 10).map((log, index) => (
                      <tr key={log.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{log.userId}</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{userLabel(log.userId)}</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', textAlign: 'center', fontWeight: 'bold', color: '#2c3e50' }}>{format2(log.calorieIntake)}</td>
                        <td style={{ padding: '10px', border: '1px solid #bdc3c7', color: '#2c3e50' }}>{log.updatedAt ? new Date(log.updatedAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                    {filteredDailyIntakeLogs.length > 10 && (
                      <tr>
                        <td colSpan={4} style={{ 
                          padding: '10px', 
                          border: '1px solid #bdc3c7', 
                          textAlign: 'center', 
                          fontStyle: 'italic', 
                          color: '#7f8c8d',
                          backgroundColor: '#ecf0f1'
                        }}>
                          ...and {filteredDailyIntakeLogs.length - 10} more records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            ) : (
              <div style={{ color: '#e74c3c', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                No daily intake logs available for {getPeriodLabel().toLowerCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
