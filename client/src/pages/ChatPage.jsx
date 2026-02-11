import ChatBox from '../components/ChatBox';

function ChatPage({ user, onRequireAuth }) {
  return <ChatBox user={user} onRequireAuth={onRequireAuth} />;
}

export default ChatPage;
