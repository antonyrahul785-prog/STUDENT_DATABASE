// src/components/students/StudentFilters.jsx
import React from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import './StudentFilters.css';

const StudentFilters = ({ filters = {}, onFilterChange }) => {
  // Handle individual field changes
  const handleFieldChange = (field, value) => {
    if (onFilterChange) {
      onFilterChange({ [field]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Trigger any additional logic if needed
    if (onFilterChange) {
      onFilterChange({ ...filters }); // Pass current filters
    }
  };

  // Handle reset
  const handleReset = () => {
    if (onFilterChange) {
      onFilterChange({
        search: '',
        status: '',
        branch: '',
        startDate: '',
        endDate: ''
      });
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(
    value => value && value.toString().trim() !== ''
  );

  return (
    <div className="student-filters">
      <div className="filters-header">
        <div className="filters-title">
          <FunnelIcon className="h-5 w-5 inline mr-2" />
          Filter Students
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Active
            </span>
          )}
        </div>
        
        <div className="filters-actions">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="h-3 w-3 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="filters-form">
        {/* Search Input */}
        <div className="filter-group">
          <label htmlFor="search" className="filter-label">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search || ''}
              onChange={(e) => handleFieldChange('search', e.target.value)}
              className="filter-input pl-10"
              placeholder="Search by name, email, phone..."
              aria-label="Search students"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => handleFieldChange('search', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="status" className="filter-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="transferred">Transferred</option>
          </select>
        </div>

        {/* Branch Filter */}
        <div className="filter-group">
          <label htmlFor="branch" className="filter-label">
            Branch
          </label>
          <select
            id="branch"
            name="branch"
            value={filters.branch || ''}
            onChange={(e) => handleFieldChange('branch', e.target.value)}
            className="filter-select"
          >
            <option value="">All Branches</option>
            <option value="chennai">Chennai Main</option>
            <option value="chennai-north">Chennai North</option>
            <option value="chennai-south">Chennai South</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
          </select>
        </div>

        {/* Admission Type */}
        <div className="filter-group">
          <label htmlFor="admissionType" className="filter-label">
            Admission Type
          </label>
          <select
            id="admissionType"
            name="admissionType"
            value={filters.admissionType || ''}
            onChange={(e) => handleFieldChange('admissionType', e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="direct">Direct</option>
            <option value="online">Online</option>
            <option value="referral">Referral</option>
            <option value="walkin">Walk-in</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        {/* Date Range - Start Date */}
        <div className="filter-group">
          <label htmlFor="startDate" className="filter-label">
            From Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate || ''}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
            className="filter-input"
            max={filters.endDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Date Range - End Date */}
        <div className="filter-group">
          <label htmlFor="endDate" className="filter-label">
            To Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate || ''}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
            className="filter-input"
            min={filters.startDate || ''}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Course/Class Filter */}
        <div className="filter-group">
          <label htmlFor="course" className="filter-label">
            Course
          </label>
          <select
            id="course"
            name="course"
            value={filters.course || ''}
            onChange={(e) => handleFieldChange('course', e.target.value)}
            className="filter-select"
          >
            <option value="">All Courses</option>
            <option value="class-1">Class 1</option>
            <option value="class-2">Class 2</option>
            <option value="class-3">Class 3</option>
            <option value="class-4">Class 4</option>
            <option value="class-5">Class 5</option>
            <option value="class-6">Class 6</option>
            <option value="class-7">Class 7</option>
            <option value="class-8">Class 8</option>
            <option value="class-9">Class 9</option>
            <option value="class-10">Class 10</option>
            <option value="jee">JEE Preparation</option>
            <option value="neet">NEET Preparation</option>
            <option value="foundation">Foundation Course</option>
          </select>
        </div>

        {/* Fee Status */}
        <div className="filter-group">
          <label htmlFor="feeStatus" className="filter-label">
            Fee Status
          </label>
          <select
            id="feeStatus"
            name="feeStatus"
            value={filters.feeStatus || ''}
            onChange={(e) => handleFieldChange('feeStatus', e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button
            type="button"
            onClick={handleReset}
            className="filter-btn filter-btn-secondary"
          >
            Reset
          </button>
          <button
            type="submit"
            className="filter-btn filter-btn-primary"
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          <div className="active-filters-header">
            <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          </div>
          <div className="active-filters-tags">
            {filters.search && (
              <span className="active-filter-tag">
                Search: "{filters.search}"
                <button
                  type="button"
                  onClick={() => handleFieldChange('search', '')}
                  className="ml-1.5"
                  aria-label="Remove search filter"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="active-filter-tag">
                Status: {filters.status}
                <button
                  type="button"
                  onClick={() => handleFieldChange('status', '')}
                  className="ml-1.5"
                  aria-label="Remove status filter"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.branch && (
              <span className="active-filter-tag">
                Branch: {filters.branch}
                <button
                  type="button"
                  onClick={() => handleFieldChange('branch', '')}
                  className="ml-1.5"
                  aria-label="Remove branch filter"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.startDate && (
              <span className="active-filter-tag">
                From: {new Date(filters.startDate).toLocaleDateString()}
                <button
                  type="button"
                  onClick={() => handleFieldChange('startDate', '')}
                  className="ml-1.5"
                  aria-label="Remove start date filter"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.endDate && (
              <span className="active-filter-tag">
                To: {new Date(filters.endDate).toLocaleDateString()}
                <button
                  type="button"
                  onClick={() => handleFieldChange('endDate', '')}
                  className="ml-1.5"
                  aria-label="Remove end date filter"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            )}
            {/* Add other filter tags as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFilters;