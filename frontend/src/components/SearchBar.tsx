import { useState } from 'react';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import type { SweetCategory, SearchQuery } from '../types';

interface SearchBarProps {
  onSearch: (query: SearchQuery) => void;
  onClear: () => void;
}

const categories: SweetCategory[] = [
  'chocolate',
  'candy',
  'cake',
  'cookie',
  'pastry',
  'ice cream',
  'traditional',
  'other',
];

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SweetCategory | ''>('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const query: SearchQuery = {};
    if (name.trim()) query.name = name.trim();
    if (category) query.category = category;
    if (minPrice) query.minPrice = parseFloat(minPrice);
    if (maxPrice) query.maxPrice = parseFloat(maxPrice);
    onSearch(query);
  };

  const handleClear = () => {
    setName('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-bar-main">
        {/* Main Search Input */}
        <div className="search-input-wrapper">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Search for sweets..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'btn btn-primary' : 'btn btn-secondary'}
          style={{ padding: '0.75rem 1rem' }}
        >
          <FiFilter />
          <span>Filters</span>
        </button>

        {/* Search & Clear Buttons */}
        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
        <button onClick={handleClear} className="btn btn-secondary">
          <FiX />
          <span>Clear</span>
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="search-filters">
          {/* Category Filter */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SweetCategory | '')}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div className="filter-group">
            <label>Min Price</label>
            <input
              type="number"
              placeholder="₹0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Max Price */}
          <div className="filter-group">
            <label>Max Price</label>
            <input
              type="number"
              placeholder="₹999"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      )}
    </div>
  );
}
