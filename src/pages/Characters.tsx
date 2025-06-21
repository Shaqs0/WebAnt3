import { useState } from 'react';
import { useCharacters } from '../hooks/useCharacters';
import styles from '../styles/Characters.module.css';
import { CharacterCard } from '../components/ui/CharactersCard';
import { Filters } from '../components/ui/Filters';

export function Characters() {
  const [filters, setFilters] = useState({
    name: '',
    species: '',
    gender: '',
    status: ''
  });
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { characters, loading, hasMore, error } = useCharacters(filters, page);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <main className={styles.mainContent}>
      <div className={styles.imgContainer}>
        <img src="./src/images/characters.png" alt="Characters banner" />
      </div>

      <Filters 
        filters={filters}
        onChange={handleFilterChange}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
      />

      {error && <div className={styles.error}>{error}</div>}

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
              !loading && <div className={styles.noResults}>No characters found</div>
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