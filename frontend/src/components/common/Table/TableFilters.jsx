import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const TableFilters = ({
  onFilterChange,
  filters = {},
  filterConfig = [],
  onSearch,
  searchPlaceholder = "Search...",
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
  };

  const handleSearch = () => {
    onFilterChange?.(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {};
    filterConfig.forEach(filter => {
      resetFilters[filter.name] = filter.defaultValue || '';
    });
    setLocalFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="table-filters">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={localFilters.search || ''}
          onChange={(e) => handleInputChange('search', e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
        />
        {localFilters.search && (
          <button
            onClick={() => handleInputChange('search', '')}
            className="clear-search"
          >
            <X size={16} />
          </button>
        )}
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <div className="filter-actions">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="filter-toggle"
        >
          <Filter size={16} />
          Advanced Filters
        </button>
        <button onClick={handleReset} className="reset-filters">
          Reset Filters
        </button>
      </div>

      {showAdvanced && filterConfig.length > 0 && (
        <div className="advanced-filters">
          <div className="filter-grid">
            {filterConfig.map((filter) => (
              <div key={filter.name} className="filter-field">
                <label className="filter-label">{filter.label}</label>
                {filter.type === 'select' ? (
                  <select
                    value={localFilters[filter.name] || ''}
                    onChange={(e) => handleInputChange(filter.name, e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : filter.type === 'date' ? (
                  <input
                    type="date"
                    value={localFilters[filter.name] || ''}
                    onChange={(e) => handleInputChange(filter.name, e.target.value)}
                    className="filter-input"
                  />
                ) : filter.type === 'daterange' ? (
                  <div className="date-range">
                    <input
                      type="date"
                      value={localFilters[`${filter.name}From`] || ''}
                      onChange={(e) => handleInputChange(`${filter.name}From`, e.target.value)}
                      className="filter-input"
                      placeholder="From"
                    />
                    <span className="date-separator">to</span>
                    <input
                      type="date"
                      value={localFilters[`${filter.name}To`] || ''}
                      onChange={(e) => handleInputChange(`${filter.name}To`, e.target.value)}
                      className="filter-input"
                      placeholder="To"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={localFilters[filter.name] || ''}
                    onChange={(e) => handleInputChange(filter.name, e.target.value)}
                    className="filter-input"
                    placeholder={filter.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="filter-apply">
            <button onClick={handleSearch} className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableFilters;