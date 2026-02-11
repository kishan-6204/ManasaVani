import styles from './ThemePicker.module.css';

const cards = [
  { id: 'lavender', label: 'Lavender', preview: 'linear-gradient(140deg, #ede8ff, #cbc2ff)' },
  { id: 'peach', label: 'Peach', preview: 'linear-gradient(140deg, #fff3e8, #ffd7bd)' },
  { id: 'mint', label: 'Mint', preview: 'linear-gradient(140deg, #e8fff5, #c0f0de)' },
  { id: 'sky', label: 'Light blue', preview: 'linear-gradient(140deg, #e6f0ff, #c8ddff)' },
  { id: 'neutral', label: 'Neutral gray', preview: 'linear-gradient(140deg, #f3f3f5, #dbdce2)' },
];

function ThemePicker({ open, selectedTheme, onSelectTheme, onClose }) {
  if (!open) return null;

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h3>Choose Color</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className={styles.cards}>
        {cards.map((card) => (
          <button
            key={card.id}
            className={`${styles.card} ${selectedTheme === card.id ? styles.active : ''}`}
            style={{ background: card.preview }}
            onClick={() => onSelectTheme(card.id)}
            aria-label={card.label}
          />
        ))}
      </div>
    </aside>
  );
}

export default ThemePicker;
