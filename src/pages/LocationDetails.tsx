import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { 
  fetchLocationById, 
  fetchResidents 
} from '../features/locationsSlice';
import styles from '../styles/LocationDetails.module.css';
import SvgIcon from '../components/ui/SvgIcon';
import { ArrowBack } from '../assets/icons';

export const LocationDetails= () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { 
    selectedLocation, 
    residents, 
    loading, 
    error 
  } = useSelector((state: RootState) => state.locations);

  useEffect(() => {
    if (id) {
      dispatch(fetchLocationById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedLocation?.residents) {
      dispatch(fetchResidents(selectedLocation.residents));
    }
  }, [selectedLocation, dispatch]);

  if (loading) return <div className={styles.loading}>Loading location...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!selectedLocation) return <div>Location not found</div>;

  return (
    <>
      <section className={styles.locationInfo}>
        <div className={styles.locationHeader}>
          <Link to="/locations" className={styles.goBack}>
            <span className={styles.goBackContent}>
              <SvgIcon
                iconUrl={ArrowBack}
                alt="Back" 
                className={styles.backArrow}
              />
              GO BACK
            </span>
          </Link>
          <h1 className={styles.locationName}>{selectedLocation.name}</h1>
        </div>
        
        <div className={styles.locationDetails}>
          <div>
            <p className={styles.locationType}>
              <strong>Type</strong> {selectedLocation.type || 'Unknown'}
            </p>
          </div>
          <div>
            <p className={styles.locationDimension}>
              <strong>Dimension</strong> {selectedLocation.dimension || 'Unknown'}
            </p>
          </div>
        </div>
      </section>

      <div className={styles.title}>
        <h2 className={styles.residentsTitle}>Residents</h2>
      </div>
      
      <div className={styles.residentsContainer}>
        {residents.length > 0 ? (
          residents.map(resident => (
            <Link 
              to={`/character/${resident.id}`} 
              key={resident.id} 
              className={styles.residentCard}
            >
              <img src={resident.image} alt={resident.name} />
              <div className={styles.residentInfo}>
                <h3>{resident.name}</h3>
                <p>{resident.species}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No residents found in this location.</p>
        )}
      </div>
    </>
  );
};