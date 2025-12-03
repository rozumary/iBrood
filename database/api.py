# iBrood Database API
# FastAPI endpoints for PostgreSQL on Render

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, date
import os
import asyncpg
import hashlib
import secrets

app = FastAPI(title="iBrood Database API", version="1.0.0")

# CORS - allow your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.environ.get("DATABASE_URL", "")

async def get_db():
    """Get database connection pool"""
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()


# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime

class QueenCellAnalysisCreate(BaseModel):
    hive_id: Optional[int] = None
    total_queen_cells: int = 0
    capped_count: int = 0
    semi_mature_count: int = 0
    mature_count: int = 0
    open_count: int = 0
    recommendations: List[str] = []
    cells_data: Optional[dict] = None

class BroodAnalysisCreate(BaseModel):
    hive_id: Optional[int] = None
    total_detections: int = 0
    egg_count: int = 0
    larva_count: int = 0
    pupa_count: int = 0
    health_score: int = 0
    health_status: str = ""
    brood_coverage: int = 0
    recommendations: List[str] = []

class QueenCellLogCreate(BaseModel):
    hive_id: str
    observation_date: date
    status: str = "capped"
    days_old: int = 0
    queen_birthday: Optional[date] = None
    notes: str = ""

class BroodLogCreate(BaseModel):
    hive_id: str
    observation_date: date
    health_score: Optional[int] = None
    brood_coverage: Optional[int] = None
    egg_presence: bool = False
    larva_presence: bool = False
    pupa_presence: bool = False
    queen_spotted: bool = False
    notes: str = ""


# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    """Simple password hashing - use bcrypt in production!"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def generate_token() -> str:
    return secrets.token_urlsafe(32)


# ==================== AUTH ENDPOINTS ====================

@app.post("/api/auth/signup", response_model=dict)
async def signup(user: UserCreate, db=Depends(get_db)):
    """Register a new user"""
    # Check if user exists
    existing = await db.fetchrow("SELECT id FROM users WHERE email = $1", user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    password_hash = hash_password(user.password)
    result = await db.fetchrow(
        """INSERT INTO users (email, name, password_hash) 
           VALUES ($1, $2, $3) RETURNING id, email, name, created_at""",
        user.email, user.name, password_hash
    )
    
    # Create session token
    token = generate_token()
    await db.execute(
        """INSERT INTO sessions (user_id, token, expires_at) 
           VALUES ($1, $2, NOW() + INTERVAL '7 days')""",
        result['id'], token
    )
    
    return {
        "user": dict(result),
        "token": token,
        "message": "Account created successfully!"
    }

@app.post("/api/auth/login", response_model=dict)
async def login(credentials: UserLogin, db=Depends(get_db)):
    """Login user"""
    user = await db.fetchrow(
        "SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1",
        credentials.email
    )
    
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create new session
    token = generate_token()
    await db.execute(
        """INSERT INTO sessions (user_id, token, expires_at) 
           VALUES ($1, $2, NOW() + INTERVAL '7 days')""",
        user['id'], token
    )
    
    return {
        "user": {
            "id": user['id'],
            "email": user['email'],
            "name": user['name'],
            "created_at": user['created_at'].isoformat()
        },
        "token": token,
        "message": "Login successful!"
    }

@app.post("/api/auth/logout")
async def logout(token: str, db=Depends(get_db)):
    """Logout user - invalidate token"""
    await db.execute("DELETE FROM sessions WHERE token = $1", token)
    return {"message": "Logged out successfully"}


# ==================== QUEEN CELL ANALYSES ====================

@app.post("/api/queen-analyses")
async def create_queen_analysis(analysis: QueenCellAnalysisCreate, user_id: int, db=Depends(get_db)):
    """Save a queen cell analysis result"""
    result = await db.fetchrow(
        """INSERT INTO queen_cell_analyses 
           (user_id, hive_id, total_queen_cells, capped_count, semi_mature_count, mature_count, open_count, recommendations, cells_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, timestamp""",
        user_id, analysis.hive_id, analysis.total_queen_cells,
        analysis.capped_count, analysis.semi_mature_count, analysis.mature_count, analysis.open_count,
        analysis.recommendations, analysis.cells_data
    )
    return {"id": result['id'], "timestamp": result['timestamp'].isoformat()}

@app.get("/api/queen-analyses/{user_id}")
async def get_queen_analyses(user_id: int, limit: int = 20, db=Depends(get_db)):
    """Get user's queen cell analyses"""
    rows = await db.fetch(
        """SELECT * FROM queen_cell_analyses 
           WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2""",
        user_id, limit
    )
    return [dict(row) for row in rows]

@app.delete("/api/queen-analyses/{analysis_id}")
async def delete_queen_analysis(analysis_id: int, user_id: int, db=Depends(get_db)):
    """Delete a queen cell analysis"""
    await db.execute(
        "DELETE FROM queen_cell_analyses WHERE id = $1 AND user_id = $2",
        analysis_id, user_id
    )
    return {"message": "Deleted successfully"}


# ==================== BROOD ANALYSES ====================

@app.post("/api/brood-analyses")
async def create_brood_analysis(analysis: BroodAnalysisCreate, user_id: int, db=Depends(get_db)):
    """Save a brood analysis result"""
    result = await db.fetchrow(
        """INSERT INTO brood_analyses 
           (user_id, hive_id, total_detections, egg_count, larva_count, pupa_count, health_score, health_status, brood_coverage, recommendations)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id, timestamp""",
        user_id, analysis.hive_id, analysis.total_detections,
        analysis.egg_count, analysis.larva_count, analysis.pupa_count,
        analysis.health_score, analysis.health_status, analysis.brood_coverage,
        analysis.recommendations
    )
    return {"id": result['id'], "timestamp": result['timestamp'].isoformat()}

@app.get("/api/brood-analyses/{user_id}")
async def get_brood_analyses(user_id: int, limit: int = 20, db=Depends(get_db)):
    """Get user's brood analyses"""
    rows = await db.fetch(
        """SELECT * FROM brood_analyses 
           WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2""",
        user_id, limit
    )
    return [dict(row) for row in rows]


# ==================== QUEEN CELL LOGS (Manual) ====================

@app.post("/api/queen-logs")
async def create_queen_log(log: QueenCellLogCreate, user_id: int, db=Depends(get_db)):
    """Create a manual queen cell log entry"""
    result = await db.fetchrow(
        """INSERT INTO queen_cell_logs 
           (user_id, hive_id, observation_date, status, days_old, queen_birthday, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, created_at""",
        user_id, log.hive_id, log.observation_date, log.status,
        log.days_old, log.queen_birthday, log.notes
    )
    return {"id": result['id'], "created_at": result['created_at'].isoformat()}

@app.get("/api/queen-logs/{user_id}")
async def get_queen_logs(user_id: int, limit: int = 50, db=Depends(get_db)):
    """Get user's queen cell logs"""
    rows = await db.fetch(
        """SELECT * FROM queen_cell_logs 
           WHERE user_id = $1 ORDER BY observation_date DESC, created_at DESC LIMIT $2""",
        user_id, limit
    )
    return [dict(row) for row in rows]

@app.delete("/api/queen-logs/{log_id}")
async def delete_queen_log(log_id: int, user_id: int, db=Depends(get_db)):
    """Delete a queen cell log"""
    await db.execute(
        "DELETE FROM queen_cell_logs WHERE id = $1 AND user_id = $2",
        log_id, user_id
    )
    return {"message": "Deleted successfully"}


# ==================== BROOD LOGS (Manual) ====================

@app.post("/api/brood-logs")
async def create_brood_log(log: BroodLogCreate, user_id: int, db=Depends(get_db)):
    """Create a manual brood log entry"""
    result = await db.fetchrow(
        """INSERT INTO brood_logs 
           (user_id, hive_id, observation_date, health_score, brood_coverage, 
            egg_presence, larva_presence, pupa_presence, queen_spotted, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id, created_at""",
        user_id, log.hive_id, log.observation_date, log.health_score,
        log.brood_coverage, log.egg_presence, log.larva_presence,
        log.pupa_presence, log.queen_spotted, log.notes
    )
    return {"id": result['id'], "created_at": result['created_at'].isoformat()}

@app.get("/api/brood-logs/{user_id}")
async def get_brood_logs(user_id: int, limit: int = 50, db=Depends(get_db)):
    """Get user's brood logs"""
    rows = await db.fetch(
        """SELECT * FROM brood_logs 
           WHERE user_id = $1 ORDER BY observation_date DESC, created_at DESC LIMIT $2""",
        user_id, limit
    )
    return [dict(row) for row in rows]


# ==================== STATS & DASHBOARD ====================

@app.get("/api/stats/{user_id}")
async def get_user_stats(user_id: int, db=Depends(get_db)):
    """Get user's overall statistics for dashboard"""
    
    # Total analyses
    queen_count = await db.fetchval(
        "SELECT COUNT(*) FROM queen_cell_analyses WHERE user_id = $1", user_id
    )
    brood_count = await db.fetchval(
        "SELECT COUNT(*) FROM brood_analyses WHERE user_id = $1", user_id
    )
    
    # Total queen cells detected
    total_queen_cells = await db.fetchval(
        "SELECT COALESCE(SUM(total_queen_cells), 0) FROM queen_cell_analyses WHERE user_id = $1", user_id
    )
    
    # Total brood cells detected
    total_brood_cells = await db.fetchval(
        "SELECT COALESCE(SUM(total_detections), 0) FROM brood_analyses WHERE user_id = $1", user_id
    )
    
    # Average health score
    avg_health = await db.fetchval(
        "SELECT COALESCE(AVG(health_score), 0) FROM brood_analyses WHERE user_id = $1", user_id
    )
    
    # Latest activity
    latest_queen = await db.fetchrow(
        "SELECT * FROM queen_cell_analyses WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1", user_id
    )
    latest_brood = await db.fetchrow(
        "SELECT * FROM brood_analyses WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 1", user_id
    )
    
    return {
        "total_inspections": queen_count + brood_count,
        "total_queen_cells": total_queen_cells,
        "total_brood_cells": total_brood_cells,
        "avg_health_score": round(avg_health),
        "latest_queen_analysis": dict(latest_queen) if latest_queen else None,
        "latest_brood_analysis": dict(latest_brood) if latest_brood else None
    }


# ==================== HEALTH CHECK ====================

@app.get("/")
async def root():
    return {"status": "ok", "service": "iBrood Database API", "version": "1.0.0"}

@app.get("/health")
async def health_check(db=Depends(get_db)):
    try:
        await db.fetchval("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}
