import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// ========================================
// AUTH ROUTES
// ========================================

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, role, created_date FROM users WHERE id = $1',
      [req.session.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    // TODO: Add password verification with bcrypt
    
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// ========================================
// ENTITIES ROUTES
// ========================================

// Generic GET for any entity
app.get('/api/entities/:entityName', authMiddleware, async (req, res) => {
  const { entityName } = req.params;
  
  try {
    const result = await pool.query(`SELECT * FROM ${entityName.toLowerCase()} ORDER BY created_date DESC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generic POST for any entity
app.post('/api/entities/:entityName', authMiddleware, async (req, res) => {
  const { entityName } = req.params;
  const data = req.body;
  
  try {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await pool.query(
      `INSERT INTO ${entityName.toLowerCase()} (${columns}, created_by, created_date) 
       VALUES (${placeholders}, $${values.length + 1}, NOW()) 
       RETURNING *`,
      [...values, req.session.user.email]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generic UPDATE for any entity
app.patch('/api/entities/:entityName/:id', authMiddleware, async (req, res) => {
  const { entityName, id } = req.params;
  const data = req.body;
  
  try {
    const updates = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(data);
    
    const result = await pool.query(
      `UPDATE ${entityName.toLowerCase()} 
       SET ${updates}, updated_date = NOW() 
       WHERE id = $${values.length + 1} 
       RETURNING *`,
      [...values, id]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generic DELETE for any entity
app.delete('/api/entities/:entityName/:id', authMiddleware, async (req, res) => {
  const { entityName, id } = req.params;
  
  try {
    await pool.query(`DELETE FROM ${entityName.toLowerCase()} WHERE id = $1`, [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// INTEGRATIONS - AI
// ========================================

app.post('/api/integrations/Core/InvokeLLM', authMiddleware, async (req, res) => {
  const { prompt, response_json_schema, add_context_from_internet } = req.body;
  
  try {
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        response_format: response_json_schema ? { type: 'json_object' } : undefined
      })
    });
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    res.json(response_json_schema ? JSON.parse(content) : content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// HEALTH CHECK
// ========================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
});
