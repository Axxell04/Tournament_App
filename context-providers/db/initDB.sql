CREATE TABLE IF NOT EXISTS tournament (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    sport TEXT NOT NULL,
    creator TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
    finishedAt TEXT
);

INSERT OR IGNORE INTO tournament (name, sport, creator) VALUES 
    ("UTM Champions", "Fútbol", "Director UTM"),
    ("PUCE Cup", "Fútbol", "Director PUCE"),
    ("Inter University", "Fútbol", "Organización deportiva de Portoviejo")
;

CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tournament INTEGER NOT NULL,
    name TEXT NOT NULL,
    dt TEXT NOT NULL,
    FOREIGN KEY (id_tournament) REFERENCES tournament(id)
);

CREATE TABLE IF NOT EXISTS match (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_tournament INTEGER NOT NULL,
    id_first_team INTEGER NOT NULL,
    id_second_team INTEGER NOT NULL,
    goals_first_team INTEGER,
    goals_second_team INTEGER,
    plannedAt TEXT,
    executedAt TEXT,
    executed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_tournament) REFERENCES tournament(id),
    FOREIGN KEY (id_first_team) REFERENCES team(id),
    FOREIGN KEY (id_second_team) REFERENCES team(id)
);