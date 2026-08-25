import React, { useMemo, useState } from "react";
import {
  BadgePercent,
  TrendingUp,
  Tag,
  DollarSign,
  ArrowUpRight,
  Search,
  Filter,
  CalendarDays,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./DiscountAnalysis.css";

const discountPerformanceData = [
  { range: "0 - 10%", revenue: 145000, orders: 1200 },
  { range: "11 - 20%", revenue: 210000, orders: 1850 },
  { range: "21 - 30%", revenue: 98000, orders: 920 },
  { range: "31 - 40%", revenue: 45000, orders: 410 },
  { range: "50%+", revenue: 18000, orders: 230 },
];

const initialCampaigns = [
  {
    id: "#CAMP-501",
    name: "Summer Mega Sale",
    discountType: "Flat 25% Off",
    code: "SUMMER25",
    usageCount: 840,
    revenueGenerated: 42500,
    status: "Active",
  },
  {
    id: "#CAMP-502",
    name: "First-Time Buyer Deal",
    discountType: "$20 Off",
    code: "WELCOME20",
    usageCount: 620,
    revenueGenerated: 31000,
    status: "Active",
  },
  {
    id: "#CAMP-503",
    name: "Tech Clearance",
    discountType: "Flat 40% Off",
    code: "TECH40",
    usageCount: 310,
    revenueGenerated: 28400,
    status: "Paused",
  },
  {
    id: "#CAMP-504",
    name: "Weekend Flash Promo",
    discountType: "15% Off",
    code: "WEEKEND15",
    usageCount: 950,
    revenueGenerated: 19200,
    status: "Expired",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label} Discount</p>
      <p className="tooltip-value">
        Revenue: ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

function DiscountAnalysis() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "",
    usageCount: "",
    revenueGenerated: "",
    status: "Active",
  });

  const filteredCampaigns = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return campaigns.filter((campaign) => {
      const matchesSearch =
        !search ||
        campaign.name.toLowerCase().includes(search) ||
        campaign.code.toLowerCase().includes(search) ||
        campaign.discountType.toLowerCase().includes(search) ||
        campaign.id.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const openAddModal = () => {
    setEditingCampaign(null);

    setFormData({
      name: "",
      code: "",
      discountType: "",
      usageCount: "",
      revenueGenerated: "",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);

    setFormData({
      name: campaign.name,
      code: campaign.code,
      discountType: campaign.discountType,
      usageCount: campaign.usageCount,
      revenueGenerated: campaign.revenueGenerated,
      status: campaign.status,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCampaign(null);

    setFormData({
      name: "",
      code: "",
      discountType: "",
      usageCount: "",
      revenueGenerated: "",
      status: "Active",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const code = formData.code.trim().toUpperCase();
    const discountType = formData.discountType.trim();

    if (!name || !code || !discountType) {
      alert("Please fill all required fields.");
      return;
    }

    const duplicateCode = campaigns.some(
      (campaign) =>
        campaign.code.toLowerCase() === code.toLowerCase() &&
        campaign.id !== editingCampaign?.id
    );

    if (duplicateCode) {
      alert("A campaign with this promo code already exists.");
      return;
    }

    const campaignData = {
      name,
      code,
      discountType,
      usageCount:
        formData.usageCount === ""
          ? 0
          : Number(formData.usageCount),
      revenueGenerated:
        formData.revenueGenerated === ""
          ? 0
          : Number(formData.revenueGenerated),
      status: formData.status,
    };

    if (editingCampaign) {
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === editingCampaign.id
            ? {
                ...campaign,
                ...campaignData,
              }
            : campaign
        )
      );
    } else {
      const newCampaign = {
        id: `#CAMP-${500 + campaigns.length + 1}`,
        ...campaignData,
      };

      setCampaigns((prev) => [newCampaign, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (campaign) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${campaign.name}"?`
    );

    if (!confirmed) return;

    setCampaigns((prev) =>
      prev.filter((item) => item.id !== campaign.id)
    );
  };

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="dashboard discount-page">
      {/* Header */}
      <div className="dashboard-header discount-header">
        <div>
          <h1>Discount Analysis</h1>
          <p>
            Evaluate promotional campaign effectiveness and
            revenue impact
          </p>
        </div>

        <div className="header-actions">
          <button className="date-filter">
            <CalendarDays size={17} />
            <span>Last 30 Days</span>
          </button>

          <button
            className="primary-btn"
            onClick={openAddModal}
          >
            <Plus size={17} />
            <span>Add Campaign</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon purple">
              <BadgePercent size={21} />
            </div>

            <span className="stat-period">This Month</span>
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Total Discounts Given
            </span>

            <h2>₹32,450</h2>

            <div className="stat-growth positive">
              <ArrowUpRight size={15} />
              <span>4.2%</span>
              <small>vs last month</small>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue">
              <Tag size={21} />
            </div>

            <span className="stat-period">Active Promos</span>
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Coupon Redemptions
            </span>

            <h2>2,720</h2>

            <div className="stat-growth positive">
              <ArrowUpRight size={15} />
              <span>14.5%</span>
              <small>redemption rate</small>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon cyan">
              <DollarSign size={21} />
            </div>

            <span className="stat-period">Attributed</span>
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Discount Revenue
            </span>

            <h2>₹121,100</h2>

            <div className="stat-growth positive">
              <ArrowUpRight size={15} />
              <span>18.2%</span>
              <small>of total sales</small>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon orange">
              <TrendingUp size={21} />
            </div>

            <span className="stat-period">Average</span>
          </div>

          <div className="stat-content">
            <span className="stat-label">
              Avg. Order Discount
            </span>

            <h2>18.4%</h2>

            <div className="stat-growth positive">
              <ArrowUpRight size={15} />
              <span>Optimum</span>
              <small>margin protected</small>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="dashboard-card discount-chart-card">
        <div className="card-header">
          <div>
            <h3>Revenue by Discount Bracket</h3>
            <p>
              Analyze which discount ranges drive the most sales
              volume
            </p>
          </div>
        </div>

        <div className="discount-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={discountPerformanceData}>
              <CartesianGrid
                stroke="#252b3b"
                vertical={false}
              />

              <XAxis
                dataKey="range"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#7f879b",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#7f879b",
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  `₹${value / 1000}k`
                }
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="revenue"
                fill="#6366f1"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns */}
      <div className="dashboard-card discount-table-card">
        <div className="discount-table-header">
          <div>
            <h3>Promotional Campaigns</h3>
            <p>
              Performance overview of individual coupon codes
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="discount-controls">
          <div className="discount-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search campaigns or promo codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="discount-filter">
            <Filter size={16} />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="product-table discount-product-table">
          <div className="table-head discount-grid-layout">
            <span>Campaign Name</span>
            <span>Promo Code</span>
            <span>Discount Type</span>
            <span>Redemptions</span>
            <span>Revenue Generated</span>
            <span>Actions</span>
          </div>

          {filteredCampaigns.map((campaign) => (
            <div
              className="product-row discount-grid-layout"
              key={campaign.id}
            >
              <div className="product-info">
                <div>
                  <strong>{campaign.name}</strong>
                  <span className="product-id-tag">
                    {campaign.id}
                  </span>
                </div>
              </div>

              <div>
                <span className="code-pill">
                  {campaign.code}
                </span>
              </div>

              <span className="units">
                {campaign.discountType}
              </span>

              <span className="units">
                {campaign.usageCount.toLocaleString("en-IN")}{" "}
                orders
              </span>

              <strong className="revenue">
                {formatCurrency(campaign.revenueGenerated)}
              </strong>

              <div className="campaign-actions">
                <button
                  className="action-icon-btn"
                  title="Edit Campaign"
                  onClick={() =>
                    openEditModal(campaign)
                  }
                >
                  <Edit3 size={15} />
                </button>

                <button
                  className="action-icon-btn delete"
                  title="Delete Campaign"
                  onClick={() =>
                    handleDelete(campaign)
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="no-results">
              <Tag size={30} />
              <h4>No campaigns found</h4>
              <p>
                Try changing your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="campaign-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>
                  {editingCampaign
                    ? "Edit Campaign"
                    : "Add New Campaign"}
                </h2>

                <p>
                  {editingCampaign
                    ? "Update promotional campaign details"
                    : "Create a new promotional campaign"}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            <form
              className="campaign-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group full-width">
                <label>
                  Campaign Name <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Summer Mega Sale"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Promo Code <span>*</span>
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="e.g. SUMMER25"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Discount Type <span>*</span>
                </label>

                <input
                  type="text"
                  name="discountType"
                  placeholder="e.g. Flat 25% Off"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Redemptions</label>

                <input
                  type="number"
                  name="usageCount"
                  min="0"
                  placeholder="0"
                  value={formData.usageCount}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Revenue Generated</label>

                <input
                  type="number"
                  name="revenueGenerated"
                  min="0"
                  placeholder="0"
                  value={formData.revenueGenerated}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group full-width">
                <label>Campaign Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  <Save size={16} />

                  {editingCampaign
                    ? "Update Campaign"
                    : "Save Campaign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiscountAnalysis;