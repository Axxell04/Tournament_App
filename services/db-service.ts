import { NewTournament, Tournament } from "@/interfaces/tournament";
import { SQLiteDatabase } from "expo-sqlite";

export class DBService {
    constructor (private db: SQLiteDatabase) {}

    /**
     * 
     * @returns Una promesa que resulve una lista de torneos, o una lista vacía de haber un error
     */
    async getTournaments (): Promise<Tournament[]> {
        try {
            return await this.db.getAllAsync<Tournament>("SELECT * FROM tournament");
        } catch (error) {
            console.log("Error al realizar la consulta: "+error);
            return []
        }
    }

    /**
     * 
     * @param id - ID del torneo 
     * @returns Una promesa que resuelve un torneo si lo encuentra, o null si no lo encuentra
     */
    async getTournamentById (id: number) {
        try {
            return await this.db.getFirstAsync<Tournament>("SELECT * FROM tournament WHERE id = ?", [id]);
        } catch (error) {
            console.log("Error al realizar la consulta: "+error);
            return null;
        }
    }

    /**
     * 
     * @param {Tournament} newTournament - Nuevo torneo
     * @returns true si el torneo es agregado con éxito
     * @returns false si el torneo ya existe
     * @returns null si ocurrio un error
     */
    async addTournament (newTournament: NewTournament) {
        try {
            if (await this.checkIfExistsTournament(newTournament)) { return false };
            this.db.runAsync("INSERT INTO tournament (name, creator, sport) VALUES (?,?,?)", [newTournament.name, newTournament.creator, newTournament.sport]);
            return true;
        } catch (error) {
            console.log("Error al realizar la inserción: "+error)
            return null;
        }
    }

    /**
     * 
     * @param id - ID del torneo
     * @param name - Nombre del torneo
     * @param creator - Nombre del creador del torneo
     * @param sport - Deporte "Fútbol" | "Baloncesto"
     * @returns Una promesa que resuelve el torneo editado si la actualización es exitosa, o null si ocurre un error
     */
    async editTournamet (id: number, name: string, creator: string, sport: "Fútbol" | "Baloncesto", active: boolean) {
        try {
            this.db.runAsync(`
                UPDATE tournament
                SET name = ?, creator = ?, sport = ?, active = ?
                WHERE id = ?    
            `, [name, creator, sport, active, id]);
            const res = await this.getTournamentById(id);
            return res;
        } catch (error) {
            console.log("Error al realizar la actualización: "+error);
            return null;
        }
    }

    /**
     * 
     * @param id - ID del torneo
     * @returns true si se elimina el toreno, o null si ocurre un error
     */
    async deleteTournamet (id: number) {
        try {
            this.db.runAsync(`
                DELETE FROM tournament 
                WHERE id = ?    
            `, [id]);
            return true
        } catch (error) {
            console.log("Error al realizar la eliminación: "+error)
            return null;
        }
    }

    /**
     * 
     * @param tournament Torneo a comprobar 
     * @returns true si el torneo ya existe, caso contrario false
     */
    async checkIfExistsTournament (tournament: Tournament | NewTournament) {
        const res = await this.db.getFirstAsync("SELECT * FROM tournament WHERE name = ?", [tournament.name]);
        if (!res) {
            return false;
        }
        return true;
    }
}