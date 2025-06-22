import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import styles from '../styles/Characters.module.css';
import { CharacterCard } from '../components/ui/CharactersCard';
import { Filters } from '../components/ui/Filters';
import { fetchCharactersThunk, setFilters, setPage, resetFilters } from '../features/charactersSlice';

export function Characters() {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { characters, loading, hasMore, error, filters, page } = useSelector(
    (state: RootState) => state.characters
  );

  useEffect(() => {
    dispatch(fetchCharactersThunk({ filters, page }));
  }, [filters, page, dispatch]);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(setPage(page + 1));
    }
  }, [loading, hasMore, page, dispatch]);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  return (
    <main className={styles.mainContent}>
      <div className={styles.imgContainer}>
        <img src="src/assets/images/characters.png" alt="Characters banner" />
      </div>

      <Filters 
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
      />

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {loading && page === 1 ? (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <>
          <div className={styles.charactersContainer}>
            {characters.length > 0 ? (
              characters.map(character => (
                <CharacterCard 
                  key={character.id}
                  character={character} 
                />
              ))
            ) : (
              !loading && (
                <div className={styles.noResults}>
                 
                </div>
              )
            )}
          </div>

          {hasMore && characters.length > 0 && (
            <div className={styles.loadMoreContainer}>
              <button 
                onClick={handleLoadMore} 
                className={styles.loadMoreBtn}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}