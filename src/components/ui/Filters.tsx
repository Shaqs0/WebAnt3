import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import styles from '../../styles/Characters.module.css';
import { useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '../../features/charactersSlice';
import SvgIcon from './SvgIcon';
import { ArrowDropDown, CloseIcon, FilterList, SearchIcon } from '../../assets/icons';

interface FiltersProps {
  filters: {
    name: string;
    species: string;
    gender: string;
    status: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onReset: () => void;
  isModalOpen: boolean;
  toggleModal: () => void;
}

export function Filters({ 
  filters, 
  onChange, 
  isModalOpen, 
  toggleModal 
}: FiltersProps) {
  const dispatch = useDispatch();
  const [localName, setLocalName] = useState(filters.name);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localName === '') {
        dispatch(resetFilters());
      } else if (localName !== filters.name) {
        dispatch(setFilters({ name: localName }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localName, dispatch]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
  };

  const handleOtherFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e);
  };

  const speciesOptions = [
    { value: '', label: 'Species' },
    { value: 'Human', label: 'Human' },
    { value: 'Alien', label: 'Alien' },
    { value: 'Humanoid', label: 'Humanoid' },
    { value: 'Poopybutthole', label: 'Poopybutthole' },
    { value: 'Mythological', label: 'Mythological' },
    { value: 'Unknown', label: 'Unknown' },
    { value: 'Animal', label: 'Animal' },
    { value: 'Disease', label: 'Disease' },
    { value: 'Robot', label: 'Robot' },
    { value: 'Cronenberg', label: 'Cronenberg' },
    { value: 'Planet', label: 'Planet' }
  ];

  const genderOptions = [
    { value: '', label: 'Gender' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Genderless', label: 'Genderless' },
    { value: 'Unknown', label: 'Unknown' }
  ];

  const statusOptions = [
    { value: '', label: 'Status' },
    { value: 'Alive', label: 'Alive' },
    { value: 'Dead', label: 'Dead' },
    { value: 'Unknown', label: 'Unknown' }
  ];

  return (
    <>
      <div className={styles.filtersContainer}>
        <form className={styles.filtersForm} onSubmit={(e) => e.preventDefault()}>
          <div className={`${styles.searchInputContainer} ${styles.selectWrapper}`}>
            <SvgIcon 
              iconUrl={SearchIcon} 
              className={styles.searchIcon} 
            />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Filter by name..."
              value={localName}
              onChange={handleNameChange}
              className={`${styles.filterInput} ${styles.searchInput}`}
            />
          </div>
          
          <div className={styles.selectWrapper}>
            <select 
              id="species" 
              name="species" 
              value={filters.species}
              onChange={handleOtherFilterChange}
              className={styles.filterSelect}
            >
              {speciesOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SvgIcon 
              iconUrl={ArrowDropDown} 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.selectWrapper}>
            <select 
              id="gender" 
              name="gender" 
              value={filters.gender}
              onChange={handleOtherFilterChange}
              className={styles.filterSelect}
            >
              {genderOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SvgIcon 
              iconUrl={ArrowDropDown} 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.selectWrapper}>
            <select 
              id="status" 
              name="status" 
              value={filters.status}
              onChange={handleOtherFilterChange}
              className={styles.filterSelect}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SvgIcon 
              iconUrl={ArrowDropDown} 
              className={styles.selectArrow} 
            />
          </div>
        </form>
        <button 
          className={styles.mobileFiltersBtn} 
          onClick={toggleModal}
          type="button"
        >
          <SvgIcon 
            iconUrl={FilterList}
            className={styles.searchIcon} 
          />
          ADVANCED FILTERS
        </button>
      </div>
      
      <div className={`${styles.filtersModal} ${isModalOpen ? styles.active : ''}`}>
        <div className={styles.filtersModalContent}>
          <div className={styles.filtersModalHeader}>
            <p>Filters</p>
              <SvgIcon 
                iconUrl={CloseIcon} 
                className={styles.closeIcon} 
                onClick={toggleModal}
              />
          </div>

          <div className={styles.modalSelectWrapper}>
            <select 
              id="modal-species" 
              name="species" 
              value={filters.species}
              onChange={handleOtherFilterChange}
              className={styles.filterSelect}
            >
              {speciesOptions.map(option => (
                <option key={`modal-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SvgIcon 
              iconUrl={ArrowDropDown} 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.modalSelectWrapper}>
            <select 
              id="modal-gender" 
              name="gender" 
              value={filters.gender}
              onChange={handleOtherFilterChange}
              className={styles.filterSelect}
            >
              {genderOptions.map(option => (
                <option key={`modal-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SvgIcon 
              iconUrl={ArrowDropDown} 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.modalSelectWrapper}>
            <select 
              id="modal-status" 
              name="status" 
              value={filters.status}
              onChange={handleOtherFilterChange}
              className={styles.filterSelect}
            >
              {statusOptions.map(option => (
                <option key={`modal-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <SvgIcon 
              iconUrl={ArrowDropDown} 
              className={styles.selectArrow} 
            />
          </div>
        </div>
      </div>
    </>
  );
}