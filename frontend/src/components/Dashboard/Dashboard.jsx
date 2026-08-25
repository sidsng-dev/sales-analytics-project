import React, { useState } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [trendFilter, setTrendFilter] = useState('30 Days');
  const [aiQuery, setAiQuery] = useState('');

  return (
    <div className="dashboard-container">
      
      {/* Top KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Total Revenue</span>
            <span className="badge positive">↑ 12.4%</span>
          </div>
          <h2>₹12.45 L</h2>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Total Orders</span>
            <span className="badge positive">↑ 8.2%</span>
          </div>
          <h2>4,820</h2>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Customers</span>
            <span className="badge positive">↑ 5.8%</span>
          </div>
          <h2>2,180</h2>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Products Sold</span>
            <span className="badge positive">↑ 15.1%</span>
          </div>
          <h2>13,540</h2>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Avg Order Value</span>
            <span className="badge positive">↑ 3.4%</span>
          </div>
          <h2>₹2,580</h2>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Net Profit</span>
            <span className="badge positive">↑ 14.2%</span>
          </div>
          <h2>₹3.82 L</h2>
        </div>
      </div>

      {/* Middle Row: Sales Overview Trend & Sales by Category */}
      <div className="dashboard-row">
        <div className="dashboard-card sales-trend-card">
          <div className="card-header-flex">
            <h3>Sales Overview</h3>
            <div className="filter-group">
              {['7 Days', '30 Days', '3 Months', '1 Year'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${trendFilter === filter ? 'active' : ''}`}
                  onClick={() => setTrendFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-placeholder">
            <svg viewBox="0 0 500 150" className="line-chart">
              <path
                d="M 0 120 Q 125 20, 250 80 T 500 40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />
            </svg>
            <div className="chart-xaxis">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card category-card">
          <h3>Sales by Category</h3>
          <div className="bar-list">
            <div className="bar-item">
              <span>Electronics</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '85%' }}></div></div>
              <span className="bar-value">₹8.2L</span>
            </div>
            <div className="bar-item">
              <span>Grocery</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '60%' }}></div></div>
              <span className="bar-value">₹5.7L</span>
            </div>
            <div className="bar-item">
              <span>Dairy</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '35%' }}></div></div>
              <span className="bar-value">₹3.1L</span>
            </div>
            <div className="bar-item">
              <span>Snacks</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '20%' }}></div></div>
              <span className="bar-value">₹1.8L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Grid Row 1: Customer Analytics, Top Products, Discount Performance */}
      <div className="dashboard-grid-lower">
        <div className="dashboard-card">
          <h3>Customer Analytics</h3>
          <div className="customer-stats">
            <div className="stat-group">
              <span className="sub-title">Customer Split</span>
              <div className="split-bar">
                <div className="split-regular" style={{ width: '68%' }}>Regular 68%</div>
                <div className="split-new" style={{ width: '32%' }}>New 32%</div>
              </div>
            </div>
            <div className="stat-group">
              <span className="sub-title">Revenue Contribution</span>
              <div className="bar-item">
                <span>Regular</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '75%' }}></div></div>
                <span className="bar-value">₹8.4L</span>
              </div>
              <div className="bar-item">
                <span>New</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '40%' }}></div></div>
                <span className="bar-value">₹4.1L</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Top Products</h3>
          <table className="products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Laptop Pro X</td><td>₹4.2L</td></tr>
              <tr><td>2</td><td>Smart TV 55"</td><td>₹3.1L</td></tr>
              <tr><td>3</td><td>Galaxy Mobile</td><td>₹2.7L</td></tr>
              <tr><td>4</td><td>Basmati Rice</td><td>₹1.9L</td></tr>
              <tr><td>5</td><td>Organic Milk</td><td>₹1.2L</td></tr>
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <h3>Discount Performance</h3>
          <div className="discount-metrics">
            <div className="metric-box">
              <span className="label">Avg Discount</span>
              <h4>11.8%</h4>
            </div>
            <div className="metric-box">
              <span className="label">Discount Rev</span>
              <h4>₹7.2L</h4>
            </div>
          </div>
          <div className="insight-pill">
            💡 Optimal range: <strong>10–20% discount</strong>
          </div>
        </div>
      </div>

      {/* Lower Grid Row 2: Inventory Status, Sales Forecast, Recent Transactions */}
      <div className="dashboard-grid-lower">
        <div className="dashboard-card">
          <h3>Inventory Status</h3>
          <table className="products-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Laptop Pro X</td><td>42 units</td><td><span className="status-badge completed">Optimal</span></td></tr>
              <tr><td>Smart TV 55"</td><td>12 units</td><td><span className="status-badge pending">Low Stock</span></td></tr>
              <tr><td>Galaxy Mobile</td><td>8 units</td><td><span className="status-badge low">Critical</span></td></tr>
              <tr><td>Organic Milk</td><td>110 units</td><td><span className="status-badge completed">Optimal</span></td></tr>
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <h3>Sales Forecast (Q3 Prediction)</h3>
          <div className="bar-list" style={{ marginTop: '20px' }}>
            <div className="bar-item">
              <span>July (Est)</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '88%', background: '#34d399' }}></div></div>
              <span className="bar-value">₹14.2L</span>
            </div>
            <div className="bar-item">
              <span>Aug (Est)</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '94%', background: '#34d399' }}></div></div>
              <span className="bar-value">₹15.1L</span>
            </div>
            <div className="bar-item">
              <span>Sep (Est)</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '100%', background: '#34d399' }}></div></div>
              <span className="bar-value">₹16.8L</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Recent Transactions</h3>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>#TX-9481</td><td>₹24,500</td><td><span className="status-badge completed">Success</span></td></tr>
              <tr><td>#TX-9482</td><td>₹12,200</td><td><span className="status-badge completed">Success</span></td></tr>
              <tr><td>#TX-9483</td><td>₹4,500</td><td><span className="status-badge pending">Pending</span></td></tr>
              <tr><td>#TX-9484</td><td>₹58,900</td><td><span className="status-badge completed">Success</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Grid Row 3: AI Insights, AI Analyst, Quick Actions */}
      <div className="dashboard-grid-lower">
        <div className="dashboard-card insights-card">
          <h3>💡 AI Business Insights</h3>
          <ul>
            <li>🏆 <strong>Revenue:</strong> Electronics accounts for 65% of overall profit margins.</li>
            <li>📦 <strong>Inventory:</strong> Galaxy Mobile is at critical stock levels.</li>
            <li>👥 <strong>Customer:</strong> Regular retention rate improved by 4.2%.</li>
            <li>🏷️ <strong>Discount:</strong> Promotions between 10-20% yield peak conversion.</li>
          </ul>
        </div>

        <div className="dashboard-card ai-preview-card">
          <h3>🤖 Ask AI Business Analyst</h3>
          <p>Query insights using Azure OpenAI semantic search</p>
          <div className="ai-input-group">
            <input 
              type="text" 
              placeholder="Ask about forecast or anomalies..." 
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
            />
            <button className="ai-ask-btn">Ask AI</button>
          </div>
          <div className="ai-suggestions">
            <span>Suggested:</span>
            <button>Why sales spiked?</button>
            <button>Restock forecast</button>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions-grid">
            <button className="action-card-btn" onClick={() => alert("Launching pipeline sync job...")}>
              <span>⚡</span> Sync Pipelines
            </button>
            <button className="action-card-btn" onClick={() => alert("Opening stock purchase order form...")}>
              <span>📦</span> Restock Items
            </button>
            <button className="action-card-btn" onClick={() => alert("Configuring email alert rules...")}>
              <span>🔔</span> Set Alerts
            </button>
            <button className="action-card-btn" onClick={() => alert("Opening Azure Synapse query editor...")}>
              <span>🔍</span> SQL Query
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}