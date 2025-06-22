import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  fetchLocations, 
  loadAllLocations,
  setFilter 
} from '../features/locationsSlice';
import { LocationCard } from '../components/ui/LocationCard';
import styles from '../styles/Locations.module.css';
import SvgIcon from '../components/ui/SvgIcon';
import { ArrowDropDown, CloseIcon, FilterList, SearchIcon } from '../assets/icons';

export const Locations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    locations,
    loading,
    hasMore,
    error,
    filters,
    filterOptions
  } = useSelector((state: RootState) => state.locations);
  
  const [showModal, setShowModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    type: '',
    dimension: ''
  });
  const [inputValue, setInputValue] = useState(filters.name);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(loadAllLocations());
    dispatch(fetchLocations(1));
  }, [dispatch]);

  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      dispatch(fetchLocations(1));
    }, 500);
    
    setDebounceTimer(timer);
    
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [filters]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    dispatch(setFilter({ name: 'name', value }));
  };

  const handleFilterChange = (name: 'type' | 'dimension', value: string) => {
    dispatch(setFilter({ name, value }));
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchLocations());
    }
  };

  const openModal = () => {
    setModalFilters({
      type: filters.type,
      dimension: filters.dimension
    });
    setShowModal(true);
  };

  const applyModalFilters = () => {
    dispatch(setFilter({ name: 'type', value: modalFilters.type }));
    dispatch(setFilter({ name: 'dimension', value: modalFilters.dimension }));
    setShowModal(false);
  };

  if (error) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.imgContainer}>
        <img src="src/assets/images/locaions.png" alt="Locations banner" />
      </div>

      <div className={styles.filtersContainer}>
        <form 
          className={styles.filtersForm}
          onSubmit={(e) => e.preventDefault()} 
        >
          <div className={styles.searchInputContainer}>
            <SvgIcon iconUrl={SearchIcon} alt="Search" className={styles.searchIcon} />
            <input
              type="text"
              value={inputValue}
              onChange={handleNameChange}
              placeholder="Filter by name..."
              className={styles.searchInput}
            />
          </div>
          <div className={styles.selectWrapper}>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Type</option>
              {filterOptions.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <SvgIcon iconUrl={ArrowDropDown} alt="▼" className={styles.selectArrow} />
          </div>
          <div className={styles.selectWrapper}>
            <select
              value={filters.dimension}
              onChange={(e) => handleFilterChange('dimension', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Dimension</option>
              {filterOptions.dimensions.map(dim => (
                <option key={dim} value={dim}>{dim}</option>
              ))}
            </select>
             <SvgIcon iconUrl={ArrowDropDown} alt="▼" className={styles.selectArrow} />
          </div>
        </form>
        <button className={styles.mobileFiltersBtn} onClick={openModal}>
         <SvgIcon iconUrl={FilterList} className={styles.searchIcon} />
          ADVANCED FILTERS
        </button>
      </div>

      {showModal && (
        <div className={styles.filtersModal} onClick={() => setShowModal(false)}>
          <div className={styles.filtersModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.filtersModalHeader}>
              <p>Filters</p>
              <SvgIcon 
                iconUrl={CloseIcon}
                className={styles.closeModalBtn} 
                onClick={() => setShowModal(false)}
              />
            </div>

            <div className={styles.modalSelectWrapper}>
              <select
                value={modalFilters.type}
                onChange={(e) => setModalFilters(prev => ({ ...prev, type: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="">All Types</option>
                {filterOptions.types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <SvgIcon iconUrl={ArrowDropDown} alt="▼" className={styles.selectArrow} />
            </div>

            <div className={styles.modalSelectWrapper}>
              <select
                value={modalFilters.dimension}
                onChange={(e) => setModalFilters(prev => ({ ...prev, dimension: e.target.value }))}
                className={styles.filterSelect}
              >
                <option value="">All Dimensions</option>
                {filterOptions.dimensions.map(dim => (
                  <option key={dim} value={dim}>{dim}</option>
                ))}
              </select>
              <SvgIcon iconUrl={ArrowDropDown} alt="▼" className={styles.selectArrow} />
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

      {loading && locations.length === 0 ? (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      ) : (
        <>
          <div className={styles.locationsContainer}>
            {locations.length === 0 ? (
              <p className={styles.noResults}>No locations found matching your criteria.</p>
            ) : (
              locations.map(location => (
                <LocationCard key={`location-${location.id}`} location={location} />
              ))
            )}
          </div>

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button 
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'LOAD MORE'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};