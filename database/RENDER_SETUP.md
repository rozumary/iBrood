# iBrood Database Setup Guide for Render

## 🗄️ Setting Up PostgreSQL Database on Render

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com) and sign up
2. Verify your email and log in

### Step 2: Create PostgreSQL Database
1. Click **"New +"** button → Select **"PostgreSQL"**
2. Fill in the details:
   - **Name**: `ibrood-database`
   - **Database**: `ibrood`
   - **User**: `ibrood_user`
   - **Region**: Singapore (closest to Philippines)
   - **Plan**: Free tier (for testing) or Starter ($7/month for production)

3. Click **"Create Database"**
4. Wait for it to be created (takes 1-2 minutes)

### Step 3: Get Your Database URL
1. Once created, go to your database dashboard
2. Find the **"External Database URL"** - it looks like:
   ```
   postgres://ibrood_user:password@oregon-postgres.render.com/ibrood
   ```
3. **Save this URL** - you'll need it for your API

### Step 4: Run the Schema
1. In Render dashboard, click **"Shell"** tab
2. Connect to psql:
   ```bash
   psql $DATABASE_URL
   ```
3. Copy and paste the contents of `schema.sql` to create tables
4. Or use a tool like **DBeaver** or **pgAdmin** to connect and run the SQL

---

## 🚀 Deploying the Database API on Render

### Option A: Deploy as Web Service (Recommended)

1. Push your code to GitHub (make sure `database/` folder is included)

2. In Render dashboard, click **"New +"** → **"Web Service"**

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: `ibrood-db-api`
   - **Region**: Same as your database (Singapore)
   - **Branch**: `main`
   - **Root Directory**: `database`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variable:
   - Key: `DATABASE_URL`
   - Value: Your PostgreSQL External URL from Step 3

6. Click **"Create Web Service"**

### Option B: Use Existing HuggingFace API
If you prefer, you can add database endpoints to your existing HuggingFace API.

---

## 🔗 Connecting Frontend to Database

Update your frontend to use the database API instead of localStorage:

```typescript
// lib/db-client.ts
const API_URL = 'https://ibrood-db-api.onrender.com';

export async function saveQueenAnalysis(analysis: any, userId: number) {
  const response = await fetch(`${API_URL}/api/queen-analyses?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analysis)
  });
  return response.json();
}

export async function getQueenAnalyses(userId: number) {
  const response = await fetch(`${API_URL}/api/queen-analyses/${userId}`);
  return response.json();
}

// Add similar functions for brood analyses, logs, etc.
```

---

## 📊 Database Tables Overview

| Table | Purpose |
|-------|---------|
| `users` | User accounts (email, name, password) |
| `hives` | Hive information per user |
| `queen_cell_analyses` | AI detection results for queen cells |
| `brood_analyses` | AI detection results for brood patterns |
| `queen_cell_logs` | Manual queen cell tracking entries |
| `brood_logs` | Manual brood observation entries |
| `sessions` | User authentication tokens |

---

## 💰 Render Pricing

| Plan | Database | API (Web Service) | Total/Month |
|------|----------|-------------------|-------------|
| Free | 90 days free, then expires | Free (spins down after inactivity) | $0 |
| Starter | $7/month (1GB storage) | $7/month | $14/month |
| Standard | $20/month (10GB storage) | $25/month | $45/month |

**Recommendation**: Start with Free tier for testing, upgrade to Starter for production.

---

## 🔒 Security Notes

1. **Never expose DATABASE_URL** in frontend code
2. Use **environment variables** for all secrets
3. In production, replace SHA256 with **bcrypt** for password hashing
4. Add **rate limiting** to prevent abuse
5. Implement proper **JWT authentication** for production

---

## 📝 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Queen Cell Analyses (AI)
- `POST /api/queen-analyses` - Save analysis
- `GET /api/queen-analyses/{user_id}` - Get user's analyses
- `DELETE /api/queen-analyses/{id}` - Delete analysis

### Brood Analyses (AI)
- `POST /api/brood-analyses` - Save analysis
- `GET /api/brood-analyses/{user_id}` - Get user's analyses

### Queen Cell Logs (Manual)
- `POST /api/queen-logs` - Create log entry
- `GET /api/queen-logs/{user_id}` - Get user's logs
- `DELETE /api/queen-logs/{id}` - Delete log

### Brood Logs (Manual)
- `POST /api/brood-logs` - Create log entry
- `GET /api/brood-logs/{user_id}` - Get user's logs

### Dashboard Stats
- `GET /api/stats/{user_id}` - Get overall statistics

---

## 🆘 Troubleshooting

**Database connection fails:**
- Check if DATABASE_URL is correct
- Make sure you're using External URL, not Internal URL
- Verify the database is running in Render dashboard

**API returns 500 error:**
- Check Render logs for detailed error messages
- Verify all tables are created (run schema.sql)
- Check if asyncpg is installed

**Slow responses:**
- Free tier spins down after 15 min inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid plan for always-on service
