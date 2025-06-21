import type { Location } from "../../interfaces/locations";
import styles from '../../styles/locations.module.css';
import { useNavigate } from 'react-router-dom';

interface LocationCardProps {
  location: Location;
}

export function LocationCard ({ location }: LocationCardProps)  {
  const navigate = useNavigate();

  return (
    <div 
      className={styles.locationCard}
      onClick={() => navigate(`/location/${location.id}`)}
    >
      <strong>{location.name}</strong>
      <small>{location.type}</small>
    </div>
  );
};