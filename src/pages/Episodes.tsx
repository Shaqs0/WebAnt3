import { useState, useEffect, type SetStateAction } from 'react';
import { useEpisodes } from '../hooks/useEpisodes';
import { EpisodeCard } from '../components/ui/EpisodeCard';
import styles from '../styles/Episodes.module.css';

export function Episodes() {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    episodes, 
    loading, 
    hasMore, 
    error, 
    loadEpisodes,
    currentPage
  } = useEpisodes();

  const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadEpisodes(searchQuery, currentPage + 1);
      setTimeout(() => {
        window.scrollBy({ top: 400, behavior: 'smooth' });
      }, 300);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEpisodes(searchQuery, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <main className={styles.mainContent}>
      <div className={styles.imgContainer}>
        <img src="/src/images/episodes.png" alt="Episodes banner" />
      </div>

      <div className={styles.filtersContainer}>
        <form className={styles.filtersForm} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.searchInputContainer}>
            <img 
              src="/src/images/icons/search_icon.svg" 
              alt="Search" 
              className={styles.searchIcon} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
              placeholder="Name or episode (ex. S01E01)"
            />
          </div>
        </form>
      </div>

      {error && (
        <p className={styles.episodesNoResults}>
          Failed to load episodes. Please try again.
        </p>
      )}

      {!error && episodes.length === 0 && !loading && (
        <p className={styles.episodesNoResults}>
          No episodes found matching your search.
        </p>
      )}

      <div className={styles.episodesContainer}>
        {episodes.map((episode) => (
          <EpisodeCard 
            key={`${episode.id}-${episode.episode}`}
            episode={episode} 
          />
        ))}
      </div>

      <div className={styles.loadMoreContainer}>
        {hasMore ? (
          <button 
            onClick={handleLoadMore}
            className={styles.loadMoreBtn}
            disabled={loading}
          >
            {loading ? 'LOADING...' : 'LOAD MORE'}
          </button>
        ) : (
          episodes.length > 0 && <p>No more episodes to load</p>
        )}
      </div>

      {loading && episodes.length === 0 && (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </main>
  );
}