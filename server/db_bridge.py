import sys
import json
import sqlite3
import datetime
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "trackey.db")

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

    # Seed default user and preferences
    c.execute("SELECT * FROM users WHERE id = 'u_default'")
    if not c.fetchone():
        now = datetime.datetime.utcnow().isoformat()
        c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", ('u_default', 'Alex', 'alex@email.com', '', now))
        c.execute("""
        INSERT INTO user_preferences (
            user_id, subscription_categories, movie_interests, content_priorities,
            music_interests, music_use, gaming_interests, gaming_frequency, other_interests,
            monthly_budget, optimization_goal, recommendation_priorities,
            notification_preferences, recommendation_settings, tracker_preferences, transaction_connected
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            'u_default', 'movies,music', 'Superhero,Action,Sci-Fi', 'New releases',
            '', '', '', '', '', 1000.0, 'best_value', '',
            json.dumps({"renewals":True,"trials":True,"lowUsage":True,"ghostSubscriptions":True,"budget":True,"optimization":True}),
            json.dumps({"movies":True,"music":True,"games":True,"others":True}),
            json.dumps({"usageTracking":True,"reminders":True,"personalizedRecs":True}),
            0
        ))
        conn.commit()

    # Seed initial subscriptions
    c.execute("SELECT COUNT(*) as cnt FROM subscriptions WHERE user_id = 'u_default'")
    row = c.fetchone()
    if row['cnt'] == 0:
        initial_subs = [
            ("netflix", "Netflix", "movies", "Movies · OTT streaming", "N", "#1F1F1F", 199.0, 0, "monthly", "5 Sep", "3 days", "Enabled", 0, None, 1, "5.8/10", "Medium", 0, "low", "Low usage", "Your recent usage is low. Consider reviewing this subscription before the upcoming renewal.", 2),
            ("primevideo", "Prime Video", "movies", "Movies · OTT streaming", "P", "#2F6FED", 299.0, 0, "monthly", "20 Sep", "18 days", "Enabled", 0, None, 1, "7.4/10", "Low", 0, "active", "Active", "Usage is steady and consistent. This subscription is delivering good value — no action needed.", 12),
            ("jiohotstar", "JioHotstar", "movies", "Movies · OTT streaming", "J", "#5A3FD6", 149.0, 0, "monthly", "11 Sep", "9 days", "Enabled", 0, None, 1, "6.1/10", "High — overlaps with Netflix", 1, "moderate", "Moderate usage", "You already have another movie service with similar content. Review whether you need both.", 6),
            ("spotify", "Spotify", "music", "Music · Streaming", "S", "#2FAE6B", 119.0, 0, "monthly", "13 Sep", "11 days", "Enabled", 0, None, 1, "9.1/10", "Low", 0, "high", "High usage", "This is one of your most-used subscriptions. Excellent value for the price — keep it.", 26),
            ("applemusic", "Apple Music", "music", "Music · Streaming", "A", "#D1425A", 99.0, 0, "monthly", "9 Sep", "7 days", "Enabled", 0, None, 1, "7.0/10", "Medium — overlaps with Spotify", 1, "active", "Active", "You use this regularly, but it overlaps with Spotify. Worth checking if you need both.", 18),
            ("xboxgamepass", "Xbox Game Pass", "games", "Games · Subscription", "X", "#8A4BD6", 489.0, 0, "monthly", "26 Sep", "24 days", "Enabled", 0, None, 1, "7.8/10", "Low", 1, "active", "Active", "Consistent usage across the month. This subscription is being used well.", 18),
            ("bgmi", "BGMI", "games", "Games · App", "B", "#E08A2C", 0.0, 1, "monthly", None, None, "Not applicable", 0, None, 1, "—", "—", 0, "high", "Active", "This is a free app with no subscription cost — nothing to optimize here.", 14),
            ("googleone", "Google One", "others", "Others · Cloud storage", "G", "#2F6FED", 130.0, 0, "monthly", "16 Sep", "14 days", "Enabled", 0, None, 1, "8.6/10", "Low", 0, "high", "High usage", "Used almost daily for backups and storage. This is a well-utilized subscription.", 25),
            ("canva", "Canva", "others", "Others · Design tool", "C", "#1CA0A0", 500.0, 0, "monthly", "8 Sep", "6 days", "Enabled", 1, 2, 0, "3.2/10", "Low", 1, "low", "Low usage", "Barely used this month relative to its cost. Consider pausing until you need it again.", 3),
        ]
        now = datetime.datetime.utcnow().isoformat()
        for s in initial_subs:
            c.execute("""
            INSERT INTO subscriptions (
                id, user_id, name, category, category_label, icon, color, price, free, billing_cycle,
                next_renewal, renews_in, autopay, free_trial, trial_days_left, app_installed, value_score,
                redundancy, pause_supported, status, status_label, recommendation, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (s[0], 'u_default', s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], s[10], s[11], s[12], s[13], s[14], s[15], s[16], s[17], s[18], s[19], s[20], now))
            
            used_days = s[21]
            for d in range(used_days):
                c.execute("INSERT INTO usage_records (subscription_id, user_id, date, used, duration_minutes) VALUES (?, ?, ?, ?, ?)",
                          (s[0], 'u_default', f'2026-08-{d+1:02d}', 1, 45))
        conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print(json.dumps({"status": "initialized", "db": DB_PATH}))
