import { Link } from 'react-router-dom';
import type { Episode } from '../../interfaces/episode';
import styles from '../../styles/Episodes.module.css';

interface EpisodeCardProps {
  episode: Episode;
}

export const EpisodeCard = ({ episode }: EpisodeCardProps) => {
  return (
    <Link to={`/episodes/${episode.id}`} className={styles.episodeCard}>
      <div className={styles.episodeInfo}>
        <h3>{episode.name}</h3>
        <p>{episode.episode}</p>
        <small>{episode.air_date}</small>
      </div>
    </Link>
  );
};