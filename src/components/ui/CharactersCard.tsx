import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedCharacter } from '../../features/charactersSlice';
import type { Character } from '../../interfaces/character';
import styles from '../../styles/Characters.module.css';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    dispatch(setSelectedCharacter(character));
  };

  return (
    <Link 
      to={`/character/${character.id}`} 
      className={styles.characterCard}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        {!imageLoaded && (
          <div className={styles.imagePlaceholder} />
        )}
        <img 
          src={character.image} 
          alt={character.name} 
          className={`${styles.characterImage} ${imageLoaded ? styles.visible : styles.hidden}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className={styles.characterInfo}>
        <h2 className={styles.characterName}>{character.name}</h2>
        <p className={styles.characterSpecies}>{character.species}</p>
      </div>
    </Link>
  );
}