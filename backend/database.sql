-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW()
);

-- Token Balance
CREATE TABLE tokenbalance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(255),
  balance DECIMAL DEFAULT 0,
  total_deposited DECIMAL DEFAULT 0,
  total_won DECIMAL DEFAULT 0,
  total_lost DECIMAL DEFAULT 0,
  total_bets INTEGER DEFAULT 0,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Betting Market
CREATE TABLE bettingmarket (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  opens_at TIMESTAMP,
  closes_at TIMESTAMP,
  total_back_a DECIMAL DEFAULT 0,
  total_lay_a DECIMAL DEFAULT 0,
  total_back_b DECIMAL DEFAULT 0,
  total_lay_b DECIMAL DEFAULT 0,
  winning_option VARCHAR(10),
  resolved_at TIMESTAMP,
  linked_highlight_id UUID,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- User Bet
CREATE TABLE userbet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID REFERENCES bettingmarket(id),
  user_email VARCHAR(255) NOT NULL,
  option VARCHAR(10) NOT NULL,
  bet_type VARCHAR(10) NOT NULL,
  amount DECIMAL NOT NULL,
  odds DECIMAL DEFAULT 1.99,
  potential_return DECIMAL,
  status VARCHAR(50) DEFAULT 'pending',
  payout DECIMAL DEFAULT 0,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Deposit Request
CREATE TABLE depositrequest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL,
  wallet_address VARCHAR(255),
  amount DECIMAL NOT NULL,
  token_type VARCHAR(50) DEFAULT 'BOT',
  bot_amount DECIMAL,
  usdc_amount DECIMAL,
  exchange_rate DECIMAL,
  status VARCHAR(50) DEFAULT 'pending',
  request_type VARCHAR(50) DEFAULT 'deposit',
  admin_notes TEXT,
  processed BOOLEAN DEFAULT false,
  tx_hash VARCHAR(255),
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Conversation
CREATE TABLE conversation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  language VARCHAR(10),
  relevance_score DECIMAL,
  category VARCHAR(100),
  difficulty_level VARCHAR(50),
  key_insights TEXT[],
  is_highlighted BOOLEAN DEFAULT false,
  practical_value DECIMAL,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Daily Highlight
CREATE TABLE dailyhighlight (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  conversation_id UUID REFERENCES conversation(id),
  category VARCHAR(100) NOT NULL,
  difficulty_level VARCHAR(50),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  impact_score DECIMAL NOT NULL,
  user_message TEXT,
  ai_response TEXT,
  language VARCHAR(10),
  acceleration_days DECIMAL DEFAULT 0,
  practical_value DECIMAL,
  actionable_steps TEXT[],
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Platform Stats
CREATE TABLE platformstats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_commission_earned DECIMAL DEFAULT 0,
  total_bets_placed INTEGER DEFAULT 0,
  total_volume DECIMAL DEFAULT 0,
  last_updated TIMESTAMP,
  created_date TIMESTAMP DEFAULT NOW(),
  updated_date TIMESTAMP DEFAULT NOW()
);
