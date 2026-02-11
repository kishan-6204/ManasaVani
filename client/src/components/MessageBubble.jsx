import styles from './MessageBubble.module.css';

function MessageBubble({ message, emotionBadge }) {
  const isUser = message.role === 'user';

  return (
    <article className={`${styles.bubble} ${isUser ? styles.user : styles.bot}`}>
      <p>{message.text}</p>
      {!isUser && (
        <span className={styles.badge}>
          {emotionBadge || '😌'} {message.emotion || 'neutral'}
        </span>
      )}
    </article>
  );
}

export default MessageBubble;
