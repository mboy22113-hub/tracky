import sqlite3
import os
import json

DB_PATH = os.getenv("DATABASE_URL", "trackey.db").replace("sqlite:///", "")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        age_range TEXT,
        created_at TEXT
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL UNIQUE,
        subscription_categories TEXT,
        movie_interests TEXT,
        content_priorities TEXT,
        music_interests TEXT,
        music_use TEXT,
        gaming_interests TEXT,
        gaming_frequency TEXT,
        other_interests TEXT,
        monthly_budget REAL,
        optimization_goal TEXT,
        recommendation_priorities TEXT,
        notification_preferences TEXT,
        recommendation_settings TEXT,
        tracker_preferences TEXT,
        transaction_connected INTEGER
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        category_label TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT,
        price REAL,
        free INTEGER,
        billing_cycle TEXT,
        next_renewal TEXT,
        renews_in TEXT,
        autopay TEXT,
        free_trial INTEGER,
        trial_days_left INTEGER,
        app_installed INTEGER,
        value_score TEXT,
        redundancy TEXT,
        pause_supported INTEGER,
        status TEXT,
        status_label TEXT,
        recommendation TEXT,
        created_at TEXT
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS usage_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        date TEXT NOT NULL,
        used INTEGER,
        duration_minutes INTEGER
    )
    """)
    c.execute("""
    CREATE TABLE IF NOT EXISTS wishlist (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        content_id TEXT NOT NULL,
        title TEXT NOT NULL,
        poster_url TEXT,
        platform TEXT,
        created_at TEXT
    )
    """)
    conn.commit()
    conn.close()

# Session-like database helper for pure Python & routers
class DatabaseSession:
    def __init__(self):
        self.conn = get_connection()

    def close(self):
        if self.conn:
            self.conn.close()

    def commit(self):
        if self.conn:
            self.conn.commit()

def get_db():
    db = DatabaseSession()
    try:
        yield db
    finally:
        db.close()
