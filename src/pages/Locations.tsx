import { useState } from 'react';
import { useLocations } from '../hooks/useLocations'; 
import styles from '../styles/locations.module.css';
import { LocationCard } from '../components/ui/LocationCard';


export function Locations ()  {
   const {
    locations,
    hasMore,
    isLoading,
    error,
    filterOptions,
    filters,
    updateFilter,
    loadMore
  } = useLocations();

  const [showModal, setShowModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    type: '',
    dimension: ''
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('name', e.target.value);
  };

  const handleFilterChange = (name: 'type' | 'dimension', value: string) => {
    updateFilter(name, value);
  };

  const openModal = () => {
    setModalFilters({
      type: filters.type,
      dimension: filters.dimension
    });
    setShowModal(true);
  };

  const applyModalFilters = () => {
    updateFilter('type', modalFilters.type);
    updateFilter('dimension', modalFilters.dimension);
    setShowModal(false);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <img src="/src/images/locaions.png" alt="Locations banner" />
      </div>

      <div className={styles.filtersContainer}>
        <form className={styles.filtersForm}>
          <div className={styles.searchInputContainer}>
            <img src="/src/images/icons/search_icon.svg" alt="Search" className={styles.searchIcon} />
            <input
              type="text"
              value={filters.name}
              onChange={handleNameChange}
              placeholder="Filter by name..."
              className={`${styles.filterInput} ${styles.searchInput}`}
            />
          </div>
          <div className={styles.selectWrapper}>
            <select
              id="typeFilter"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Type</option>
              {filterOptions.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <img src="/src/images/icons/arrow-drop-down.svg" alt="▼" className={styles.selectArrow} />
          </div>
          <div className={styles.selectWrapper}>
            <select
              id="dimensionFilter"
              value={filters.dimension}
              onChange={(e) => handleFilterChange('dimension', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Dimension</option>
              {filterOptions.dimensions.map(dim => (
                <option key={dim} value={dim}>{dim}</option>
              ))}
            </select>
            <img src="/src/images/icons/arrow-drop-down.svg" alt="▼" className={styles.selectArrow} />
          </div>
        </form>
        <button className={styles.mobileFiltersBtn} onClick={openModal}>
          <img src="/src/images/icons/filter_list_24px.svg" alt="Filter icon" />
          ADVANCED FILTERS
        </button>
      </div>

      {showModal && (
        <div className={styles.filtersModal} onClick={() => setShowModal(false)}>
          <div className={styles.filtersModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.filtersModalHeader}>
              <p>Filters</p>
              <img 
                src="/src/images/icons/close_24px.svg" 
                alt="Close modal" 
                className={styles.closeModalBtn} 
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className={styles.modalSelectWrapper}>
              <select
                id="modal-type"
                value={modalFilters.type}
                onChange={(e) => setModalFilters(prev => ({ ...prev, type: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                {filterOptions.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <img src="/src/images/icons/arrow-drop-down.svg" alt="▼" className={styles.selectArrow} />
            </div>

            <div className={styles.modalSelectWrapper}>
              <select
                id="modal-dimension"
                value={modalFilters.dimension}
                onChange={(e) => setModalFilters(prev => ({ ...prev, dimension: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="">All Dimensions</option>
                {filterOptions.dimensions.map(dim => (
                  <option key={dim} value={dim}>{dim}</option>
                ))}
              </select>
              <img src="/src/images/icons/arrow-drop-down.svg" alt="▼" className={styles.selectArrow} />
            </div>

            <button 
              className={styles.applyFiltersBtn} 
              onClick={applyModalFilters}
            >
              APPLY
            </button>
          </div>
        </div>
      )}

      <div className={styles.locationsCards}>
        {locations.length === 0 && !isLoading ? (
          <p>No locations found matching your criteria.</p>
        ) : (
          locations.map(location => (
            <LocationCard key={location.id} location={location} />
          ))
        )}
      </div>

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            className={styles.loadMoreButton} 
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'LOAD MORE'}
          </button>
        </div>
      )}
    </div>
  );
};