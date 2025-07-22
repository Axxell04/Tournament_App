import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import React from "react";

export default function DBProvider ({ children }: { children: React.ReactNode }) {
    return (
        <SQLiteProvider databaseName="tournament.db" onInit={initDB}>
            { children }
        </SQLiteProvider>
    )
}

async function initDB (db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tournament (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            sport TEXT NOT NULL,
            creator TEXT NOT NULL,
            active BOOLEAN DEFAULT TRUE,
            createdAt TEXT DEFAULT (DATETIME('now', 'localtime')),
            finishedAt TEXT
        );
        
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
        `)
}