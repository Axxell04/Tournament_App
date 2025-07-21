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