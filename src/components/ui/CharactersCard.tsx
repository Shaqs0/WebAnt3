import type { Character } from '../../interfaces/character'; 
import styles from '../../styles/Characters.module.css'; 
import { Link } from 'react-router-dom';

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link to={`/character/${character.id}`} className={styles.characterCard}>
      <img 
        src={character.image} 
        alt={character.name} 
        className={styles.characterImage} 
      />
      <div className={styles.characterInfo}>
        <h2 className={styles.characterName}>{character.name}</h2>
        <p className={styles.characterSpecies}>{character.species}</p>
      </div>
    </Link>
  );
}