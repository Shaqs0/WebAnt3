import { Link } from 'react-router-dom';
import type { Location } from '../../interfaces/locations';
import styles from '../../styles/Locations.module.css';

interface LocationCardProps {
  location: Location;
}

export const LocationCard = ({ location }: LocationCardProps) => {
  return (
    <Link to={`/locations/${location.id}`} className={styles.locationCard}>
      <div className={styles.locationInfo}>
        <h3>{location.name}</h3>
        <p>{location.type}</p>
      </div>
    </Link>
  );
};