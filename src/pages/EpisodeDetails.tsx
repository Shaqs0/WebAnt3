import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  fetchEpisodeById, 
  fetchCharactersInEpisode 
} from '../features/episodesSlice';
import styles from '../styles/EpisodeDetails.module.css';

export const EpisodeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    selectedEpisode, 
    charactersInEpisode, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.episodes);

  useEffect(() => {
    if (id) {
      dispatch(fetchEpisodeById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedEpisode?.characters) {
      dispatch(fetchCharactersInEpisode(selectedEpisode.characters));
    }
  }, [selectedEpisode, dispatch]);

  if (loading) return <div>Loading episode...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!selectedEpisode) return <div>Episode not found</div>;

  return (
    <>
      <section className={styles.episodeDetailsInfo}>
        <div className={styles.episodeHeader}>
          <Link to="/episodes" className={styles.episodeDetailsGoBack}>
            <span className={styles.goBackContent}>
              <img 
                src="/src/images/icons/arrow_back_24px.svg" 
                alt="Back" 
                className={styles.backArrow}
              />
              GO BACK
            </span>
          </Link>
          <h1 className={styles.episodeName}>{selectedEpisode.name}</h1>
        </div>
        
        <div className={styles.episodeInfo}>
          <div>
            <p className={styles.episodeCode}>
              <strong>Episode</strong> {selectedEpisode.episode}
            </p>
          </div>
          <div>
            <p className={styles.episodeDate}>
              <strong>Date</strong> {selectedEpisode.air_date}
            </p>
          </div>
        </div>
      </section>

      <div className={styles.title}>
        <h2 className={styles.episodeDetailsCharactersTitle}>Cast</h2>
      </div>
      
      <div className={styles.episodeDetailsCharacters}>
        {charactersInEpisode.length > 0 ? (
          charactersInEpisode.map(character => (
            <Link 
              to={`/character/${character.id}`} 
              key={character.id} 
              className={styles.characterCard}
            >
              <img src={character.image} alt={character.name} />
              <div className={styles.characterInfo}>
                <h3>{character.name}</h3>
                <p>{character.species}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No characters found in this episode.</p>
        )}
      </div>
    </>
  );
};