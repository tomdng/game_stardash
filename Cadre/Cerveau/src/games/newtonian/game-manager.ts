// This file is where you should put logic to control the game and everything
// around it.
import { BaseClasses, NewtonianGame, NewtonianGameObjectFactory } from "./";

// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
import { removeElements } from "~/utils";
import { Job } from "./job";
import { Player } from "./player";
import { Tile } from "./tile";

// Scores a list of players for easy game win checking
const score = (players: Player[]) => players
    .map((player) => ({ player, score: Math.max(player.heat, 1) * Math.max(player.pressure, 1) }))
    .sort((a, b) => b.score - a.score);
// <<-- /Creer-Merge: imports -->>

/**
 * Manages the game logic around the Newtonian Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
export class NewtonianGameManager extends BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    public static get aliases(): string[] {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-22-Newtonian",
            // <<-- /Creer-Merge: aliases -->>
        ];
    }

    /** The game this GameManager is managing */
    public readonly game!: NewtonianGame;

    /** The factory that must be used to initialize new game objects */
    public readonly create!: NewtonianGameObjectFactory;

    // <<-- Creer-Merge: public-methods -->>

    // any additional public methods you need can be added here

    // <<-- /Creer-Merge: public-methods -->>

    /**
     * This is called BEFORE each player's runTun function is called
     * (including the first turn).
     * This is a good place to get their player ready for their turn.
     */
    protected async beforeTurn(): Promise<void> {
        await super.beforeTurn();

        // <<-- Creer-Merge: before-turn -->>
        // add logic here for before the current player's turn starts

        // <<-- /Creer-Merge: before-turn -->>
    }

    /**
     * This is called AFTER each player's turn ends. Before the turn counter
     * increases.
     * This is a good place to end-of-turn effects, and clean up arrays.
     */
    protected async afterTurn(): Promise<void> {
        await super.afterTurn();

        // <<-- Creer-Merge: after-turn -->>
        // clean up dead units
        this.updateArrays();
        // update units
        this.updateUnits();
        // add logic here after the current player's turn starts
        this.manageMaterials();
        // code spawning below this:
        // Number of units For the target player.
        const units = [0, 0, 0];
        // The player who to spawn for.
        const player = this.game.currentPlayer.opponent;

        // Iterate through all the player's units to find how many of each type there are.
        for (const u of player.units) {
            units[(
                u.job.title === this.game.jobs[0].title
                ? 0 : u.job.title === this.game.jobs[1].title ? 1 : 2
            )]++;
        }

        // If Intern Cap has not been met then try to spawn an Intern.
        if (this.game.internCap > units[0] && player.internSpawn <= 0) {
            if (this.spawnUnit(player, this.game.jobs[0])) {
                player.internSpawn = this.game.spawnTime;
            }
        }

        // If Physicist Cap has not been met then try to spawn an Physicist.
        if (this.game.physicistCap > units[1] && player.physicistSpawn <= 0) {
            if (this.spawnUnit(player, this.game.jobs[1])) {
                player.physicistSpawn = this.game.spawnTime;
            }
        }

        // If Manager Cap has not been met then try to spawn an Manager.
        if (this.game.managerCap > units[2] && player.managerSpawn <= 0) {
            if (this.spawnUnit(player, this.game.jobs[2])) {
                player.managerSpawn = this.game.spawnTime;
            }
        }

        // Manager Incrementing spawner Timers

        player.internSpawn = (units[0] >= this.game.internCap)
          ? this.game.spawnTime : player.internSpawn - 1;
        player.physicistSpawn = (units[1] >= this.game.physicistCap)
          ? this.game.spawnTime : player.physicistSpawn - 1;
        player.managerSpawn = (units[2] >= this.game.managerCap)
         ? this.game.spawnTime : player.managerSpawn - 1;

        // code the generator below this:
        // iterate through each tile on the map
        for (const tile of this.game.tiles) {
            // focus specifically on generator tiles owned by the current player
            if (tile.type === "generator" && tile.owner === this.game.currentPlayer) {
                // if the tile has redium or blueium, heat and pressure are increased accordingly
                // the redium and blueium is then removed from the map
                if (tile.redium > 0) {
                    this.game.currentPlayer.heat += (tile.redium * this.game.refinedValue);
                    tile.redium = 0;
                }
                if (tile.blueium > 0) {
                    this.game.currentPlayer.pressure += (tile.blueium * this.game.refinedValue);
                    tile.blueium = 0;
                }
                // if there's a unit on a generator tile...
                if (tile.unit !== undefined) {
                    // scores the refined materials on the unit before removing them
                    if (tile.unit.redium > 0) {
                        this.game.currentPlayer.heat += (tile.unit.redium * this.game.refinedValue);
                    }
                    tile.unit.redium = 0;
                    if (tile.unit.blueium > 0) {
                        this.game.currentPlayer.pressure += (tile.unit.blueium * this.game.refinedValue);
                    }
                    tile.unit.blueium = 0;
                    // if there's an enemy intern in your generator...
                    if (tile.unit.job.title === "intern" && tile.unit.owner !== this.game.currentPlayer) {
                        // the intern dies
                        tile.unit.health = 0;
                        // the player gains internium (+resources to both scores)
                        this.game.currentPlayer.pressure += ((tile.unit.blueium + 1) * this.game.refinedValue);
                        this.game.currentPlayer.heat += ((tile.unit.redium + 1) * this.game.refinedValue);
                    }
                    // RIP intern
                }
            }
        }
        // <<-- /Creer-Merge: after-turn -->>
    }

    /**
     * Checks if the game is over in between turns.
     * This is invoked AFTER afterTurn() is called, but BEFORE beforeTurn()
     * is called.
     *
     * @returns True if the game is indeed over, otherwise if the game
     * should continue return false.
     */
    protected primaryWinConditionsCheck(): boolean {
        super.primaryWinConditionsCheck();

        // <<-- Creer-Merge: primary-win-conditions -->>
        const winners = score(this.game.players).filter((p) => p.score >= this.game.victoryAmount);

        // Add logic here checking for the primary win condition(s)
        if (winners.length === this.game.players.length) {
            this.secondaryWinConditions("Both players achieved fusion at the same time.");

            return true;
        }
        else if (winners.length === 1) {
            this.declareWinner("You achieved fusion!", winners[0].player);
            this.declareLosers("Your opponents achieved fusion.", winners[0].player.opponent);

            return true;
        }
        // <<-- /Creer-Merge: primary-win-conditions -->>

        return false; // If we get here no one won on this turn.
    }

    /**
     * Called when the game needs to end, but primary game ending conditions
     * are not met (like max turns reached). Use this to check for secondary
     * game win conditions to crown a winner.
     * @param reason The reason why a secondary victory condition is happening
     */
    protected secondaryWinConditions(reason: string): void {
        // <<-- Creer-Merge: secondary-win-conditions -->>
        // Add logic here for the secondary win conditions
        const scored = score(this.game.players);
        if (scored[0].score !== scored[1].score) {
            this.declareWinner(`${reason}: You were closer to achieving fusion`, scored[0].player);
            this.declareLosers(`${reason}: Your opponent is closer to achieving fusion`, scored[1].player);

            return;
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>

        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }

    // <<-- Creer-Merge: protected-private-methods -->>

    // any additional protected/private methods you need can be added here

    /**
     * Attempts to spawn in a unit for a given player.
     * @param player - The player that will own the unit.
     * @param job - The job of the unit.
     * @returns True if unit is spawned, otherwise returns false.
     */
    protected spawnUnit(player: Player, job: Job): boolean {
        // Iterate through each player's spawn tiles to find a spot to spawn unit.
        for (const tile of player.spawnTiles) {
            // Check to see if there is a Unit on the tile.
            // If there is move on to the next tile.
            if (tile.unit) {
                continue;
            }
            // Else spawn in Unit and return success to spawning.
            else {
                tile.unit = this.create.unit({
                    acted: false,
                    health: job.health,
                    job,
                    owner: player,
                    tile,
                    moves: job.moves,
                });
                player.units.push(tile.unit);
                this.game.units.push(tile.unit);

                return true;
            }
        }

        // Return failure. We finished looking over all the spawn for Unit spawning.
        return false;
    }

    /**
     * conveyMaterials
     * This function moves materials and units on conveyor
     * @param conveyors - a list of conveyors.
     */
    private conveyMaterials(conveyors: Tile[]): void {
        for (let i = conveyors.length - 1; i >= 0; i--) {
            const tile = conveyors[i];
            let end: Tile | undefined = tile ? tile : undefined;
            if (tile.type === "conveyor" && tile.direction !== "blank") {
                if (tile.direction === "north") {
                    end = tile.tileNorth;
                }
                if (tile.direction === "east") {
                    end = tile.tileEast;
                }
                if (tile.direction === "south") {
                    end = tile.tileSouth;
                }
                if (tile.direction === "west") {
                    end = tile.tileWest;
                }
                if (!end) {
                    continue;
                }

                // Transfers materials
                end.rediumOre += tile.rediumOre;
                tile.rediumOre = 0;
                end.redium += tile.redium;
                tile.redium = 0;
                end.blueiumOre += tile.blueiumOre;
                tile.blueiumOre = 0;
                end.blueium += tile.blueium;
                tile.blueium = 0;

                // Moves units if they exist and the destination is unoccupied
                if (!end.unit && tile.unit) {
                    tile.unit.tile = end;
                    end.unit = tile.unit;
                    tile.unit = undefined;
                }
            }
        }

        return;
    }

    /**
     * Game-Manager Materials
     * This goes into the after turn function
     * Select the player who's turns it currently isn't, and spawn materials
     * on their side of the base.
     * Makes sure all conveyers move units and materials ontop of them.
     */
    private manageMaterials(): void {

        // Spawns the appropriate ore at the start of the conveyor
        // on the side of the the player who's turns it currently isn't
        if (this.game.players[0] === this.game.currentPlayer) {
            this.game.players[0].conveyors[0].blueiumOre += this.game.materialSpawn;
        }
        else {
            this.game.players[1].conveyors[0].rediumOre += this.game.materialSpawn;
        }
        this.conveyMaterials(this.game.players[0].conveyors);
        this.conveyMaterials(this.game.players[1].conveyors);

        return;
    }

    /** Updates all arrays in the game with new/dead game objects */
    private updateArrays(): void {
        // Properly remove all killed units
        const deadUnits = this.game.units.filter((u) => !u.tile || u.health <= 0);

        // remove dead units from all player's units list
        for (const player of this.game.players) {
            removeElements(player.units, ...deadUnits);
        }
        // and remove them from the game
        removeElements(this.game.units, ...deadUnits);
         // mark them dead
        for (const unit of deadUnits) {
            if (unit.tile) {
                unit.tile.unit = undefined;
                unit.tile = undefined;
            }
        }
    }

    /** Updates all units */
    private updateUnits(): void {
        for (const unit of this.game.units) {
            if (unit.stunTime > 0) {
                unit.stunTime--;
            }
            if (unit.stunImmune > 0) {
                unit.stunImmune--;
            }
            if (!unit.owner || unit.owner === this.game.currentPlayer) {
                unit.acted = false;
                unit.moves = unit.attacked ? unit.job.moves + 1 : unit.job.moves;
            }
            unit.attacked = false;
            if (unit.tile && unit.tile.owner === unit.owner) {
                unit.health += Math.ceil(unit.job.health * this.game.RegenerateRate);
                if (unit.health > unit.job.health) {
                    unit.health = unit.job.health;
                }
            }
        }
    }
    // <<-- /Creer-Merge: protected-private-methods -->>
}
