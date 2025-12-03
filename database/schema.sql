-- iBrood Database Schema for Render PostgreSQL
-- Run this SQL to set up your database tables

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ==================== HIVES TABLE ====================
CREATE TABLE IF NOT EXISTS hives (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hives_user ON hives(user_id);

-- ==================== QUEEN CELL ANALYSES (AI) ====================
CREATE TABLE IF NOT EXISTS queen_cell_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hive_id INTEGER REFERENCES hives(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_queen_cells INTEGER DEFAULT 0,
    capped_count INTEGER DEFAULT 0,
    semi_mature_count INTEGER DEFAULT 0,
    mature_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    recommendations TEXT[],
    cells_data JSONB,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queen_analyses_user ON queen_cell_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_queen_analyses_timestamp ON queen_cell_analyses(timestamp DESC);

-- ==================== BROOD ANALYSES (AI) ====================
CREATE TABLE IF NOT EXISTS brood_analyses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hive_id INTEGER REFERENCES hives(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_detections INTEGER DEFAULT 0,
    egg_count INTEGER DEFAULT 0,
    larva_count INTEGER DEFAULT 0,
    pupa_count INTEGER DEFAULT 0,
    health_score INTEGER DEFAULT 0,
    health_status VARCHAR(50),
    brood_coverage INTEGER DEFAULT 0,
    recommendations TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_brood_analyses_user ON brood_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_brood_analyses_timestamp ON brood_analyses(timestamp DESC);

-- ==================== QUEEN CELL LOGS (Manual) ====================
CREATE TABLE IF NOT EXISTS queen_cell_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hive_id VARCHAR(255) NOT NULL,
    observation_date DATE NOT NULL,
    estimated_hatch_date DATE,
    status VARCHAR(50) DEFAULT 'capped',
    days_old INTEGER DEFAULT 0,
    queen_birthday DATE,
    queen_age INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queen_logs_user ON queen_cell_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_queen_logs_date ON queen_cell_logs(observation_date DESC);

-- ==================== BROOD LOGS (Manual) ====================
CREATE TABLE IF NOT EXISTS brood_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    hive_id VARCHAR(255) NOT NULL,
    observation_date DATE NOT NULL,
    health_score INTEGER,
    brood_coverage INTEGER,
    egg_presence BOOLEAN DEFAULT false,
    larva_presence BOOLEAN DEFAULT false,
    pupa_presence BOOLEAN DEFAULT false,
    queen_spotted BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_brood_logs_user ON brood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_brood_logs_date ON brood_logs(observation_date DESC);

-- ==================== SESSIONS TABLE (for auth) ====================
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ==================== FUNCTION: Update timestamp ====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hives_updated_at ON hives;
CREATE TRIGGER update_hives_updated_at
    BEFORE UPDATE ON hives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_queen_logs_updated_at ON queen_cell_logs;
CREATE TRIGGER update_queen_logs_updated_at
    BEFORE UPDATE ON queen_cell_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brood_logs_updated_at ON brood_logs;
CREATE TRIGGER update_brood_logs_updated_at
    BEFORE UPDATE ON brood_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==================== SAMPLE DATA (Optional) ====================
-- Uncomment below to insert sample data

-- INSERT INTO users (email, name, password_hash) VALUES 
-- ('demo@ibrood.app', 'Demo Beekeeper', 'hashed_password_here');
