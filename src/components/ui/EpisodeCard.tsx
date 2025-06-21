import type { Episode } from '../../interfaces/episode'; 
import styles from '../../styles/Episodes.module.css';
import { Link } from 'react-router-dom';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Link to={`/episode/${episode.id}`} className={styles.episodesCard}>
      <strong>{episode.name}</strong>
      <p>{episode.air_date}</p>
      <em>{episode.episode}</em>
    </Link>
  );
}