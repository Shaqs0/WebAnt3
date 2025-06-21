import type { ChangeEvent } from 'react';
import styles from '../../styles/Characters.module.css'; 

interface FiltersProps {
  filters: {
    name: string;
    species: string;
    gender: string;
    status: string;
  };
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isModalOpen: boolean;
  toggleModal: () => void;
}

export function Filters({ filters, onChange, isModalOpen, toggleModal }: FiltersProps) {
  return (
    <>
      <div className={styles.filtersContainer}>
        <form className={styles.filtersForm} onSubmit={(e) => e.preventDefault()}>
          <div className={`${styles.searchInputContainer} ${styles.selectWrapper}`}>
            <img 
              src="/src/images/icons/search_icon.svg" 
              alt="Search" 
              className={styles.searchIcon} 
            />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Filter by name..."
              value={filters.name}
              onChange={onChange}
              className={`${styles.filterInput} ${styles.searchInput}`}
            />
          </div>
          
          <div className={styles.selectWrapper}>
            <select 
              id="species" 
              name="species" 
              value={filters.species}
              onChange={onChange}
              className={styles.filterSelect}
            >
              <option value="">Species</option>
              <option value="Human">Human</option>
              <option value="Alien">Alien</option>
              <option value="Animal">Animal</option>
            </select>
            <img 
              src="/src/images/icons/arrow-drop-down.svg" 
              alt="▼" 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.selectWrapper}>
            <select 
              id="gender" 
              name="gender" 
              value={filters.gender}
              onChange={onChange}
              className={styles.filterSelect}
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
            <img 
              src="/src/images/icons/arrow-drop-down.svg" 
              alt="▼" 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.selectWrapper}>
            <select 
              id="status" 
              name="status" 
              value={filters.status}
              onChange={onChange}
              className={styles.filterSelect}
            >
              <option value="">Status</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
            <img 
              src="/src/images/icons/arrow-drop-down.svg" 
              alt="▼" 
              className={styles.selectArrow} 
            />
          </div>
        </form>
        <button 
          className={styles.mobileFiltersBtn} 
          onClick={toggleModal}
          type="button"
        >
          <img 
            src="/src/images/icons/filter_list_24px.svg" 
            alt="Filter icon" 
          />
          ADVANCED FILTERS
        </button>
      </div>
      
      <div className={`${styles.filtersModal} ${isModalOpen ? styles.active : ''}`}>
        <div className={styles.filtersModalContent}>
          <div className={styles.filtersModalHeader}>
            <p>Filters</p>
            <button 
              onClick={toggleModal}
              className={styles.closeModalBtn}
              aria-label="Close filters modal"
              type="button"
            >
              <img 
                src="/src/images/icons/close_24px.svg" 
                alt="Close" 
              />
            </button>
          </div>

          <div className={styles.modalSelectWrapper}>
            <select 
              id="modal-species" 
              name="species" 
              value={filters.species}
              onChange={onChange}
              className={styles.filterSelect}
            >
              <option value="">Species</option>
              <option value="Human">Human</option>
              <option value="Alien">Alien</option>
              <option value="Animal">Animal</option>
            </select>
            <img 
              src="/src/images/icons/arrow-drop-down.svg" 
              alt="▼" 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.modalSelectWrapper}>
            <select 
              id="modal-gender" 
              name="gender" 
              value={filters.gender}
              onChange={onChange}
              className={styles.filterSelect}
            >
              <option value="">Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
            <img 
              src="/src/images/icons/arrow-drop-down.svg" 
              alt="▼" 
              className={styles.selectArrow} 
            />
          </div>
          
          <div className={styles.modalSelectWrapper}>
            <select 
              id="modal-status" 
              name="status" 
              value={filters.status}
              onChange={onChange}
              className={styles.filterSelect}
            >
              <option value="">Statuses</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
            <img 
              src="/src/images/icons/arrow-drop-down.svg" 
              alt="▼" 
              className={styles.selectArrow} 
            />
          </div>
          
          <button 
            className={styles.applyFiltersBtn}
            onClick={toggleModal}
            type="button"
          >
            APPLY
          </button>
        </div>
      </div>
    </>
  );
}