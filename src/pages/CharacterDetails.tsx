import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import type { Character } from '../interfaces/character';
import type { Episode } from '../interfaces/episode';
import styles from '../styles/CharacterDetails.module.css';

export const CharacterDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);

        const characterRes = await axios.get<Character>(
          `https://rickandmortyapi.com/api/character/${id}`
        );
        setCharacter(characterRes.data);

        const episodeUrls = characterRes.data.episode;
        const episodeRequests = episodeUrls.map(url => axios.get<Episode>(url));
        const episodeResponses = await Promise.all(episodeRequests);
        setEpisodes(episodeResponses.map(res => res.data));
      } catch (err) {
        console.error("Error loading character:", err);
        setError('Failed to load character information');
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacter();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className={styles.notFound}>
        <h2>{error || 'Character not found'}</h2>
        <Link to="/" className={styles.goBack}>
          ← Back to Characters
        </Link>
      </div>
    );
  }

  const hasManyEpisodes = episodes.length > 6;

  return (
    <div className={styles.characterDetail}>
      <Link to="/" className={styles.goBack}>
        ← GO BACK
      </Link>

      <div className={styles.characterHeader}>
        <img
          src={character.image}
          alt={character.name}
          className={styles.characterAvatar}
        />
        <h1 className={styles.characterName}>{character.name}</h1>
      </div>

      <div className={styles.characterInfoSections}>
        <section className={styles.characterInfoDetails}>
          <h2>Informations</h2>
          <ul className={styles.listCharacterDetails}>
            <li className={styles.characterDetailsInfo}>
              <strong>Gender</strong> {character.gender}
            </li>
            <li className={styles.characterDetailsInfo}>
              <strong>Status</strong> {character.status}
            </li>
            <li className={styles.characterDetailsInfo}>
              <strong>Species</strong> {character.species}
            </li>
            <li className={styles.characterDetailsInfo}>
              <strong>Origin</strong> {character.origin.name}
            </li>
            <li className={styles.characterDetailsInfo}>
              <strong>Type</strong> {character.type || "Unknown"}
            </li>
            <li className={styles.characterDetailsInfo}>
              <div className={styles.locationContent}>
                <strong>Location</strong>
                {character.location.url ? (
                  <Link 
                    to={`/locations/${character.location.url.split('/').pop()}`}
                    className={styles.characterDetailsLocation}
                  >
                    <span>{character.location.name}</span>
                    <img 
                      src="/src/images/icons/chevron_right_24px.svg" 
                      alt="" 
                      className={styles.locationArrow} 
                    />
                  </Link>
                ) : (
                  character.location.name
                )}
              </div>
            </li>
          </ul>
        </section>

        <section className={`${styles.characterEpisodes} ${hasManyEpisodes ? styles.manyEpisodes : ''}`}>
          <h2>Episodes</h2>
          <div className={styles.episodesContainer}>
            <ul className={styles.listCharacterEpisodesDetails}>
              {episodes.map(ep => (
                <li className={styles.episodeItem} key={ep.id}>
                  <Link 
                    to={`/episodes/${ep.id}`}
                    className={styles.episodeLink}
                  >
                    <div className={styles.episodeContent}>
                      <strong>{ep.episode}</strong>
                      <div>{ep.name}</div>
                      <small>
                        {new Date(ep.air_date).toLocaleDateString("en-US", { 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      </small>
                    </div>
                    <img 
                      src="/src/images/icons/chevron_right_24px.svg" 
                      alt="" 
                      className={styles.episodeArrow} 
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};