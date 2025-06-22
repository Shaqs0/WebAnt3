import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { fetchEpisodes, setSearchQuery } from '../features/episodesSlice';
import styles from '../styles/Episodes.module.css';

export const Episodes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    episodes,
    loading,
    hasMore,
    error,
    searchQuery,
    currentPage,
  } = useSelector((state: RootState) => state.episodes);

  useEffect(() => {
    dispatch(fetchEpisodes({ searchQuery, page: 1 }));
  }, [searchQuery, dispatch]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchEpisodes({ searchQuery, page: currentPage + 1 }));
    }
  };

  return (
    <main className={styles.mainContent}>
      <div className={styles.imgContainer}>
        <img src="/src/images/episodes.png" alt="Episodes banner" />
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.searchInputContainer}>
          <img 
            src="/src/images/icons/search_icon.svg" 
            alt="Search" 
            className={styles.searchIcon} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Name or episode (ex. S01E01)"
            className={styles.searchInput}
          />
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.episodesContainer}>
        {episodes.map((episode) => (
          <Link 
            to={`/episodes/${episode.id}`} 
            key={episode.id} 
            className={styles.episodeCard}
          >
            <div className={styles.episodeInfo}>
              <h3>{episode.name}</h3>
              <p>{episode.episode}</p>
              <small>{episode.air_date}</small>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className={styles.loadMoreContainer}>
          <button 
            onClick={handleLoadMore} 
            disabled={loading}
            className={styles.loadMoreButton}
          >
            {loading ? 'Loading...' : 'LOAD MORE'}
          </button>
        </div>
      )}
    </main>
  );
};