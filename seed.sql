
CREATE TABLE chatbots (
    id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE chatbot_characteristics (
    id SERIAL PRIMARY KEY,
    chatbot_id INT REFERENCES chatbots(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    chatbot_id INT REFERENCES chatbots(id) ON DELETE CASCADE,
    guest_id INT REFERENCES guests(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_session_id INT REFERENCES chat_sessions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sender VARCHAR(50) NOT NULL 
);


CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_at IS NULL THEN
    NEW.created_at = CURRENT_TIMESTAMP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_chatbots_created_at
BEFORE INSERT ON chatbots
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_chatbot_characteristics_created_at
BEFORE INSERT ON chatbot_characteristics
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_guests_created_at
BEFORE INSERT ON guests
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_chat_sessions_created_at
BEFORE INSERT ON chat_sessions
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

CREATE TRIGGER set_messages_created_at
BEFORE INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION set_created_at();

INSERT INTO chatbots (clerk_user_id, name, created_at) VALUES
('clerk_user_1', 'Customer Support Bot', CURRENT_TIMESTAMP),
('clerk_user_2', 'Sales Bot', CURRENT_TIMESTAMP);

INSERT INTO chatbot_characteristics (chatbot_id, content, created_at) VALUES
(1, 'You are a helpful customer support assistant.', CURRENT_TIMESTAMP),
(1, 'Our support hours are 9am-5pm, Monday to Friday.', CURRENT_TIMESTAMP),
(1, 'You can track your order on our website.', CURRENT_TIMESTAMP),
(2, 'You are a knowledgeable sales assistant.', CURRENT_TIMESTAMP),
(2, 'We offer a 30-day money-back guarantee on all products.', CURRENT_TIMESTAMP),
(2, 'Our products are available in various sizes and colors.', CURRENT_TIMESTAMP);

INSERT INTO guests (name, email, created_at) VALUES
('Guest One', 'guest1@example.com', CURRENT_TIMESTAMP),
('Guest Two', 'guest2@example.com', CURRENT_TIMESTAMP);

INSERT INTO chat_sessions (chatbot_id, guest_id, created_at) VALUES
(1, 1, CURRENT_TIMESTAMP),
(2, 2, CURRENT_TIMESTAMP);

INSERT INTO messages (chat_session_id, content, created_at, sender) VALUES
(1, 'Hello, I need help with my order.', CURRENT_TIMESTAMP, 'user'),
(1, 'Sure, I can help with that. What seems to be the issue?', CURRENT_TIMESTAMP, 'ai'),
(2, 'Can you tell me more about your products?', CURRENT_TIMESTAMP, 'user'),
(2, 'Of course! We offer a variety of products. Which one are you interested in?', CURRENT_TIMESTAMP, 'ai');
