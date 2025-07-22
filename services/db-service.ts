import { Match, NewMatch } from "@/interfaces/match";
import { NewTeam, Team } from "@/interfaces/team";
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
            await this.db.runAsync("INSERT INTO tournament (name, creator, sport) VALUES (?,?,?)", [newTournament.name, newTournament.creator, newTournament.sport]);
            return true;
        } catch (error) {
            console.log("Error al realizar la insersión: "+error)
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
            await this.db.runAsync(`
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
            await this.db.runAsync(`
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

    /**
     * @param id_tournament - ID del torneo al que pertenecen los equipos
     * @returns Una promesa que resuelve una lista con los equipos del torneo, o un arreglo vacío si ocurre un error
     */
    async getTeams (id_tournament: number) {
        try {
            return await this.db.getAllAsync<Team>("SELECT * FROM team WHERE id_tournament = ?", [id_tournament]);
        } catch (error) {
            console.log("Error al realizar la consulta: "+error)
            return [];
        }
    }

    /**
     * 
     * @param id - ID del equipo que desea buscar
     * @returns Una promesa que resuelve el equipo si lo encuentra, y null si no lo encuentra u ocurre un error
     */
    async getTeamById (id: number) {
        try {
            return await this.db.getFirstAsync<Team>("SELECT * FROM team WHERE id = ?", [id]);
        } catch (error) {
            console.log("Error al realizar la consulta: "+error);
            return null;
        }
    }

    /**
     * 
     * @param id_tournament - ID del torneo del que formará parte el equipo
     * @param newTeam - Nuevo equipo a registrar
     * @returns true si la insersión es correcta, false si el equipo ya existe y null si ocurre un error
     */
    async addTeam (id_tournament: number, newTeam: NewTeam) {
        try {
            if (await this.checkIfExistsTeam(newTeam)) { return false };
            await this.db.runAsync("INSERT INTO team (id_tournament, name, dt) VALUES (?,?,?)", [id_tournament, newTeam.name, newTeam.dt]);
            return true
        } catch (error) {
            console.log("Error al realizar la insersión: "+error);
        }
    }

    /**
     * 
     * @param id - ID del equipo a editar
     * @param name - Nuevo nombre del equipo
     * @param dt - Nuevo director técnico del equipo
     * @returns Una promesa que resuelve el equipo editado, o null si ocurre un error
     */
    async editTeam (id: number, name: string, dt: string) {
        try {
            await this.db.runAsync(`
                UPDATE team
                SET name = ?, dt = ?
                WHERE id = ?
            `, [name, dt, id])
            return await this.getTeamById(id);
        } catch (error) {
            console.log("Error al realizar la actualización: "+error);
            return null;
        }
    }

    /**
     * 
     * @param id - ID del equipo a eliminar
     * @returns true si la eliminación se realizó, o null si ocurrio un error
     */
    async deleteTeam (id: number) {
        try {
            await this.db.runAsync(`
                DELETE FROM team
                WHERE id = ?    
            `, [id]);
            return true;
        } catch (error) {
            console.log("Error al realizar la eliminación: "+error);
            return null;
        }
    }

    /**
     * 
     * @param team - Equipo a verificar
     * @returns true si el equipo existe, caso contrario false
     */
    private async checkIfExistsTeam (team: Team | NewTeam) {
        const res = await this.db.getFirstAsync<Team>("SELECT * FROM team WHERE name = ?", [team.name]);
        if (!res) {
            return false;
        }
        return true;
    }

    /**
     * @returns Una promesa que resuelve una lista con los encuentros del torneo, o un arreglo vacío si ocurre un error
     */
    async getMatches () {
        try {
            return await this.db.getAllAsync<Match>("SELECT * FROM match");
        } catch (error) {
            console.log("Error al realizar la consulta: "+error)
            return [];
        }
    }

    /**
     * 
     * @param id - ID del encuentro que desea buscar
     * @returns Una promesa que resuelve el encuentro si existe, y null si no lo encuentra u ocurre un error
     */
    async getMatchById (id: number) {
        try {
            return await this.db.getFirstAsync<Match>("SELECT * FROM match WHERE id = ?", [id]);
        } catch (error) {
            console.log("Error al realizar la consulta: "+error);
            return null;
        }
    }

    /**
     * @param newMatch - Nuevo encuentro a registrar
     * @returns true si la insersión es correcta, false si el equipo ya existe y null si ocurre un error
     */
    async addMatch (newMatch: NewMatch) {
        try {
            await this.db.runAsync("INSERT INTO match (id_tournament, id_first_team, id_second_team, plannedAt) VALUES (?,?,?,?)", [newMatch.id_tournament, newMatch.id_first_team, newMatch.id_second_team, newMatch.plannedAt]);
            return true
        } catch (error) {
            console.log("Error al realizar la insersión: "+error);
        }
    }

    /**
     * 
     * @param id - ID del encuentro a editar
     * @param newMatch - Nueva información sobre el encuentro
     * @returns Una promesa que resuelve el encuentro editado, o null si ocurre un error
     */
    async editMatch (id: number, newMatch: NewMatch) {
        try {
            await this.db.runAsync(`
                UPDATE match
                SET id_tournament = ?, id_first_team = ?, id_second_team = ?, plannedAt = ?
                WHERE id = ?
            `, [newMatch.id_tournament, newMatch.id_first_team, newMatch.id_second_team, newMatch.plannedAt, id])
            return await this.getMatchById(id);
        } catch (error) {
            console.log("Error al realizar la actualización: "+error);
            return null;
        }
    }

    /**
     * 
     * @param id - ID del encuentro a eliminar
     * @returns true si la eliminación se realizó, o null si ocurrio un error
     */
    async deleteMatch (id: number) {
        try {
            await this.db.runAsync(`
                DELETE FROM match
                WHERE id = ?    
            `, [id]);
            return true;
        } catch (error) {
            console.log("Error al realizar la eliminación: "+error);
            return null;
        }
    }

}