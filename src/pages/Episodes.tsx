import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { fetchEpisodes, setSearchQuery, setPage } from '../features/episodesSlice';
import styles from '../styles/Episodes.module.css';
import SvgIcon from '../components/ui/SvgIcon';
import { SearchIcon } from '../assets/icons';

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
    dispatch(fetchEpisodes({ searchQuery, page: currentPage }));
  }, [searchQuery, currentPage, dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(setPage(currentPage + 1));
    }
  }, [loading, hasMore, currentPage, dispatch]);

  return (
    <main className={styles.mainContent}>
      <div className={styles.imgContainer}>
        <img src="src/assets/images/episodes.png" alt="Episodes banner" />
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.searchInputContainer}>
          <SvgIcon
            iconUrl={SearchIcon}
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
              <small>{episode.air_date}</small>
              <p>{episode.episode}</p>
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