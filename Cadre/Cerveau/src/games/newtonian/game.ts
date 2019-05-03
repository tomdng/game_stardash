import { IBaseGameRequiredData } from "~/core/game";
import { BaseClasses } from "./";
import { NewtonianGameManager } from "./game-manager";
import { GameObject } from "./game-object";
import { NewtonianGameSettingsManager } from "./game-settings";
import { Job } from "./job";
import { Machine } from "./machine";
import { Player } from "./player";
import { Tile } from "./tile";
import { Unit } from "./unit";

// <<-- Creer-Merge: imports -->>
import { IPoint, Mutable } from "~/utils";

/** interface used to create rooms.s */
interface IRoom {
    // room locations to be stored.
    x1: number; y1: number;
    x2: number; y2: number;
    x3: number; y3: number;
    // tracks doors and walls.
    WNorth: boolean; WEast: boolean; WSouth: boolean; WWest: boolean;
    DNorth: boolean; DEast: boolean; DSouth: boolean; DWest: boolean;
}

/*interface IConveyor {
    x: number; y: number;
    direction: Tile["direction"];
}*/

// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>

/**
 * Combine elements and be the first scientists to create fusion.
 */
export class NewtonianGame extends BaseClasses.Game {
    /** The manager of this game, that controls everything around it */
    public readonly manager!: NewtonianGameManager;

    /** The settings used to initialize the game, as set by players */
    public readonly settings = Object.freeze(this.settingsManager.values);

    /**
     * The percent of max HP regained when a unit end their turn on a tile
     * owned by their player.
     */
    public readonly RegenerateRate!: number;

    /**
     * The player whose turn it is currently. That player can send commands.
     * Other players cannot.
     */
    public currentPlayer!: Player;

    /**
     * The current turn number, starting at 0 for the first player's turn.
     */
    public currentTurn!: number;

    /**
     * A mapping of every game object's ID to the actual game object. Primarily
     * used by the server and client to easily refer to the game objects via
     * ID.
     */
    public gameObjects!: {[id: string]: GameObject};

    /**
     * The maximum number of interns a player can have.
     */
    public readonly internCap!: number;

    /**
     * A list of all jobs. first item is intern, second is physicists, and
     * third is manager.
     */
    public jobs!: Job[];

    /**
     * Every Machine in the game.
     */
    public machines!: Machine[];

    /**
     * The maximum number of managers a player can have.
     */
    public readonly managerCap!: number;

    /**
     * The number of Tiles in the map along the y (vertical) axis.
     */
    public readonly mapHeight!: number;

    /**
     * The number of Tiles in the map along the x (horizontal) axis.
     */
    public readonly mapWidth!: number;

    /**
     * The number of materials that spawn per spawn cycle.
     */
    public readonly materialSpawn!: number;

    /**
     * The maximum number of turns before the game will automatically end.
     */
    public readonly maxTurns!: number;

    /**
     * The maximum number of physicists a player can have.
     */
    public readonly physicistCap!: number;

    /**
     * List of all the players in the game.
     */
    public players!: Player[];

    /**
     * The amount of victory points added when a refined ore is consumed by the
     * generator.
     */
    public readonly refinedValue!: number;

    /**
     * A unique identifier for the game instance that is being played.
     */
    public readonly session!: string;

    /**
     * The amount of turns it takes a unit to spawn.
     */
    public readonly spawnTime!: number;

    /**
     * The amount of turns a unit cannot do anything when stunned.
     */
    public readonly stunTime!: number;

    /**
     * All the tiles in the map, stored in Row-major order. Use `x + y *
     * mapWidth` to access the correct index.
     */
    public tiles!: Tile[];

    /**
     * The amount of time (in nano-seconds) added after each player performs a
     * turn.
     */
    public readonly timeAddedPerTurn!: number;

    /**
     * The number turns a unit is immune to being stunned.
     */
    public readonly timeImmune!: number;

    /**
     * Every Unit in the game.
     */
    public units!: Unit[];

    /**
     * The amount of combined heat and pressure that you need to win.
     */
    public readonly victoryAmount!: number;

    // <<-- Creer-Merge: attributes -->>
    /**
     * This is a const used to modify the amount of walls that receive the decoration value of 1/2.
     */
    private readonly cubeConst: number = 20;
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: attributes -->>

    /**
     * Called when a Game is created.
     *
     * @param settingsManager - The manager that holds initial settings.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
        protected settingsManager: NewtonianGameSettingsManager,
        required: Readonly<IBaseGameRequiredData>,
    ) {
        super(settingsManager, required);

        // <<-- Creer-Merge: constructor -->>
        this.createJobs();

        this.createMap();

        // <<-- /Creer-Merge: constructor -->>
    }

    // <<-- Creer-Merge: public-functions -->>

    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: public-functions -->>

    /**
     * Gets the tile at (x, y), or undefined if the co-ordinates are off-map.
     *
     * @param x - The x position of the desired tile.
     * @param y - The y position of the desired tile.
     * @returns The Tile at (x, y) if valid, undefined otherwise.
     */
    public getTile(x: number, y: number): Tile | undefined {
        // tslint:disable-next-line:no-unsafe-any
        return super.getTile(x, y) as Tile | undefined;
    }

    // <<-- Creer-Merge: protected-private-functions -->>
    /** Creates all the Jobs in the game */
    private createJobs(): void {
        // push all three jobs.
        this.jobs.push(
            this.manager.create.job({
                title: "intern",
                carryLimit: 4,
                damage: 4,
                health: 12,
                moves: 5,
            }),

            this.manager.create.job({
                title: "physicist",
                carryLimit: 1,
                damage: 4,
                health: 12,
                moves: 5,
            }),

            this.manager.create.job({
                title: "manager",
                carryLimit: 3,
                damage: 4,
                health: 16,
                moves: 5,
            }),
        );
    }

    /**
     * Generates the map by modifying Tiles in the game.
     */
    private createMap(): void {
        /**
         * Utility function to get a mutable tile at a given (x, y).
         *
         * NOTE: This is a closure function. It is a function we create while
         * running createMap(), and it wraps the current scope, so that `this`
         * refers to the Game running `createMap()`, even though the game was
         * not passed.
         * @param x - The x coordinate. If off map throws an Error.
         * @param y - The y coordinate. If off map throws an Error.
         * @returns A Tile that is mutable JUST for this function scope.
         */
        const getMutableTile = (x: number, y: number): Mutable<Tile> => {
            const tile = this.getTile(x, y);
            if (!tile) {
                throw new Error(`Cannot get a tile for map generation at (${x}, ${y})`);
            }

            return tile;
        };

        // marks where the spawn area ends and the rooms begin.
        const RMstart = Math.floor(this.mapWidth * 0.105);
        // marks where the middle area of the map begins.
        const MMstart = Math.floor(this.mapWidth * 0.363);
        // marks where the spawn room in the spawn area ends.
        const spawnEnd = Math.floor(this.mapHeight * 0.304);
        // marks where the generator room in the spawn area ends.
        const genEnd = Math.floor(this.mapHeight * 0.653);
        // marks how many tiles wide the spawn and generator are, as well as conveyors.
        const startEnd = Math.ceil(this.mapWidth * 0.073);
        // used to track the maps mid-point.
        const mid = Math.floor(this.mapHeight / 2);
        // iterates over the map and adds basic structure.
        for (let x = 0; x < (this.mapWidth / 2 + 1); x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (y === 0 // bottom edge of map
                 || y === (this.mapHeight - 1) // top edge of map
                 || x === 0 // left edge of map
                 || x === RMstart
                 || x === MMstart
                // || x === Math.floor(this.mapWidth / 2) - 1
                 || (x < startEnd && (y === spawnEnd || y === genEnd))
                ) {
                    getMutableTile(x, y).isWall = true;
                }
            }
        }

        // --- Set spawn area --- \\
        for (let y = 1; y < spawnEnd; y++) {
            for (let x = 1; x <= startEnd - 1; x++) {
                const tile = getMutableTile(x, y);

                tile.owner = this.players[0];
                tile.type = "spawn";
                this.players[0].spawnTiles.push(tile as Tile);
            }
        }

        // --- Set generator area --- \\
        for (let y = spawnEnd + 1; y < genEnd; y++) {
            for (let x = 1; x <= startEnd - 1; x++) {
                const tile = getMutableTile(x, y);

                tile.owner = this.players[0];
                tile.type = "generator";
                this.players[0].generatorTiles.push(tile as Tile);
            }
        }

        // --- Set resource spawn --- \\
        const conveyors: Array<{
            x: number;
            y: number;
            direction: Tile["direction"];
        }> = [];
        for (let x = 1; x < startEnd - 1; x++) {
            conveyors.push({x, y: this.mapHeight - 3, direction: "east"});
        }
        for (let y = this.mapHeight - 3; y > genEnd + 2; y--) {
            conveyors.push({x: startEnd - 1, y, direction: "north"});
        }
        for (let x = startEnd - 1; x > 1; x--) {
            conveyors.push({x, y: genEnd + 2, direction: "west"});
        }
        conveyors.push({x: 1, y: genEnd + 2, direction: "blank"});
        for (const { x, y, direction } of conveyors) {
            let tile = getMutableTile(x, y);
            tile.type = "conveyor";
            tile.direction = direction;
            this.players[0].conveyors.push(tile as Tile);
            tile = getMutableTile((this.mapWidth - 1 - x), y);
            tile.type = "conveyor";
            let dir = direction;
            if (dir === "east") {
                dir = "west";
            }
            else if (dir === "west") {
                dir = "east";
            }
            tile.direction = dir;
            this.players[1].conveyors.push(tile as Tile);
        }
        // spawns one of each unit for the first player.
        for (let i = 0; i < 3; i++) {
            this.spawnUnit(this.players[0], this.jobs[i % 3]);
        }
        // sets up spawn times.
        for (let i = 0; i < 2; i++) {
            this.players[i].internSpawn = this.spawnTime;
            this.players[i].physicistSpawn = this.spawnTime;
            this.players[i].managerSpawn = this.spawnTime;
        }
        // --- Generate center --- \\
        // Determine the size of the center room
        const midSize = this.manager.random.int(6, 3);
        // Determine the rooms offset
        let shift = this.manager.random.int(Math.floor(this.mapHeight / 2) - midSize);
        // let shift = Math.floor(this.mapHeight / 2) - midSize - 3; // for testing
        // Edge case handling to make sure walls don't touch.
        if (shift === Math.floor(this.mapHeight / 2) - midSize - 1) {
            shift++;
        }
        // Decides if the rooms shifts upwards or downwards
        /** used to determine random shifts and doorways */
        let shiftDir = this.manager.random.int(2, 0); // 0 = small south, 1 = small north
        // shiftDir = 0; // used for testing.
        /** Determines the ship of the middle room */
        if (shiftDir === 1) {
            shift = -shift;
        }
        /** Determines machines shift */
        shiftDir = this.manager.random.int(2, 0);
        let mShift = this.manager.random.int(midSize);
        if (shiftDir === 1) {
            mShift = -mShift;
        }

        // Generate the run time for the machines
        const time = this.manager.random.int(2, 9);
        // determines the tile that machine will be on.
        const loc = getMutableTile(MMstart + 1, mid + shift + mShift);
        // makes the machine
        const machine = this.manager.create.machine({
            oreType: "redium",
            refineTime: time,
            refineInput: (Math.floor(time / 2) + 1),
            refineOutput: Math.floor(time / 2),
            tile: loc as Tile,
        });
        // Assigned the tile it's machine.
        loc.machine = machine;
        // Adds the machine to the list
        this.machines.push(machine);

        // generates structures that fill in the rest of the center area
        // top area
        // makes sure there is a top area.
        if (shift !== -(Math.floor(this.mapHeight / 2) - midSize)) {
            // if it has the smallest possible space and still exist, hallway time.
            if (shift === -(Math.floor(this.mapHeight / 2) - midSize - 2)) {
                this.drawDoor(MMstart, 1, 2, getMutableTile);
            }
            // if there are 2 spaces.
            else if (shift === -(Math.floor(this.mapHeight / 2) - midSize - 5)) {
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2), 1,
                              mid - midSize + shift - 3, getMutableTile,
                              false, true, true, false);
            }
            // if the room is bigger.
            else {
                // generates the rooms.
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2), 1,
                              mid - midSize + shift - 1, getMutableTile,
                              false, true, true, false);
            }
        }
        // bottom area
        if (shift !== Math.floor(this.mapHeight / 2) + midSize) {
            // generate for smallest leftover area - make a hallway
            if (shift === Math.floor(this.mapHeight / 2) + midSize - 2) {
                this.drawDoor(MMstart, 21, 2, getMutableTile);
            }
            // generate 2 tall area.
            else if (shift === Math.floor(this.mapHeight / 2) - midSize - 5) {
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2),
                              mid + midSize + shift + 3,
                              this.mapHeight - 2, getMutableTile,
                              true, true, false, false);
            }
            else {
                // generates the rooms.
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2),
                              mid + midSize + shift + 1,
                              this.mapHeight - 2, getMutableTile,
                              true, true, false, false);
            }
        }
        // generate Side area
        this.roomCalc(RMstart + 1, MMstart - 1, 1,
                        this.mapHeight - 2, getMutableTile,
                        false, true, false, true,
                        Math.min((this.mapHeight * this.mapWidth) / 700));
        // mirror map
        // iterate over every tile from the created half.
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth / 2; x++) {
                // copies walls.
                getMutableTile((this.mapWidth - 1 - x), y).isWall = getMutableTile(x, y).isWall;
                // copies decoration values.
                getMutableTile((this.mapWidth - 1 - x), y).decoration = getMutableTile(x, y).decoration;
                // check for a machine.
                if (getMutableTile(x, y).machine) {
                    // grab the machine.
                    const mach = getMutableTile(x, y).machine;
                    // doubly make sure it exists, because typescript.
                    if (mach === undefined) {
                        throw new Error(`The machine you are copying: ${mach}, doesn't exist!`);
                    }
                    // make a new machine.
                    const machine2 = this.manager.create.machine({
                        oreType: "blueium",
                        refineTime: mach.refineTime,
                        refineInput: mach.refineInput,
                        refineOutput: mach.refineOutput,
                        tile: getMutableTile((this.mapWidth - 1 - x), y) as Tile,
                    });
                    // add te machine to the data.
                    getMutableTile((this.mapWidth - 1 - x), y).machine = machine2;
                    this.machines.push(machine2);
                }
                // if the tile is a spawn tile, copy it.
                else if (getMutableTile(x, y).type === "spawn") {
                    // grab the mirror tile.
                    const tile = getMutableTile((this.mapWidth - 1 - x), y);
                    // add the information.
                    tile.type = "spawn";
                    tile.owner = this.players[1];
                    // push it to the list.
                    this.players[1].spawnTiles.push(tile as Tile);
                }
                // if the tile is a generator tile, copy it.
                else if (getMutableTile(x, y).type === "generator") {
                    // grab the mirror tile.
                    const tile = getMutableTile((this.mapWidth - 1 - x), y);
                    // add the information.
                    tile.type = "generator";
                    tile.owner = this.players[1];
                    // push it to the list.
                    this.players[1].generatorTiles.push(tile as Tile);
                }
            }
        }
        // spawns one of each unit for the first player.
        for (let i = 0; i < 3; i++) {
            this.spawnUnit(this.players[1], this.jobs[i % 3]);
        }
    }

    /**
     * This creates a room struct and returns it. Saves a lot of space.
     *
     * All of these parameters are for the INSIDE of the room, walls not included!
     * @param x1 - lowest x value of the room.
     * @param x2 - highest x value of a 2 by 2 room.
     * @param y1 - lowest y value of the room.
     * @param y2 - highest y value of a 2 by 2 room.
     * @param y3 - If the room is 3 tall, this is actually the highest value.
     * @param x3 - If the room is 3 wide, this is actually the highest value.
     * @returns - the room object.
     */
    private makeRoom(x1: number, x2: number, y1: number, y2: number, y3: number = -1, x3: number = -1): IRoom {
        return {
            x1, y1,
            x2, y2,
            x3, y3,
            WNorth: true, WEast: true, WSouth: true, WWest: true,
            DNorth: false, DEast: false, DSouth: false, DWest: false,
        };
    }

    /**
     * takes a area and starts the process of filling it with rooms.
     *
     * All of these parameters are for the INSIDE of the room, walls not included!
     * @param x1 - lowest x value of the area.
     * @param x2 - highest x value of the area.
     * @param y1 - lowest y value of the area.
     * @param y2 - highest y value of the area.
     * @param getMutableTile - A function that gets a mutable tile given an (x, y)
     * @param DNorth - If there should be doors to the north.
     * @param DEast - If there should be doors to the East.
     * @param DSouth - If there should be doors to the south.
     * @param DWest - If there should be doors to the west.
     * @param machines - The number of machines you want added to the map.
     * @returns - nothing, calls the next stage
     */
    private roomCalc(x1: number, x2: number, y1: number, y2: number,
                     getMutableTile: (x: number, y: number) => Mutable<Tile>,
                     DNorth: boolean = false, DEast: boolean = false,
                     DSouth: boolean = false, DWest: boolean = false,
                     machines: number = 0): void {
        // determines the number of rooms on the x axis
        const mapW = Math.floor((x2 - x1 + 2) / 3); // MUST be a whole number
        // determines the number of rooms on the y axis
        const mapH = Math.floor((y2 - y1 + 2) / 3);
        if (mapH === 0) {
            return;
        }
        // map used for mapgen.
        const map: IRoom[][] = [];
        // sets sets up the rest of the map.
        for (let i = 0; i < mapW; i++) {
            map[i] = new Array(mapH);
        }
        // counts the extra y tiles.
        const extraY = (y2 - y1 + 2) % 3;
        // counts extra x tiles.
        const extraX = (x2 - x1 + 2) % 3;
        // make a list of the Y values that will have the 3 tall rooms.
        const yLarge: number[] = [];
        for (let y = 0; y < mapH && extraY !== 0; y++) {
            yLarge.push(y);
        }
        // make a list of the X values that will have the 3 wide rooms.
        const xLarge: number[] = [];
        for (let x = 0; x < mapW && extraX !== 0; x++) {
            xLarge.push(x);
        }
        // Reduce yLarge until it is has the number of needed 3 tall rooms selected.
        while (yLarge.length > extraY) {
            yLarge.splice(this.manager.random.int(yLarge.length, 0), 1);
        }
        // Reduce xLarge until it is has the number of needed 3 tall rooms selected.
        while (xLarge.length > extraX) {
            xLarge.splice(this.manager.random.int(xLarge.length, 0), 1);
        }
        // variables that account for size 3 rooms.
        let shiftX = 0;
        let shiftY = 0;
        // create the rest of the rooms by iterating over the rest of the map.
        for (let x = 0; x < mapW; x++) {
            for (let y = 0; y < mapH; y++) {
                // create and add the room.
                // if the room is 3 wide.
                if (x === xLarge[shiftX]) {
                    // if the room is a 3 tall.
                    if (y === yLarge[shiftY]) {
                        // create the room.
                        const room = this.makeRoom(
                            x1 + (x * 3) + shiftX,
                            x1 + 1 + (x * 3) + shiftX,
                            y1 + (y * 3) + shiftY,
                            y1 + 1 + (y * 3) + shiftY,
                            y1 + 2 + (y * 3) + shiftY,
                            x1 + 2 + (x * 3) + shiftX,
                        );
                        // add the room.
                        map[x][y] = room;
                        // mark the shift so future rooms are place correctly.
                        shiftY++;
                    }
                    // if the room is a 2 tall.
                    else {
                        // create the room.
                        const room = this.makeRoom(
                            x1 + (x * 3) + shiftX,
                            x1 + 1 + (x * 3) + shiftX,
                            y1 + (y * 3) + shiftY,
                            y1 + 1 + (y * 3) + shiftY,
                            -1,
                            x1 + 2 + (x * 3) + shiftX,
                        );
                        // add the room.
                        map[x][y] = room;
                    }
                }
                // if the room is 2 wide.
                else {
                    // if the room is a 3 tall.
                    if (y === yLarge[shiftY]) {
                        // create the room.
                        const room = this.makeRoom(
                            x1 + (x * 3) + shiftX,
                            x1 + 1 + (x * 3) + shiftX,
                            y1 + (y * 3) + shiftY,
                            y1 + 1 + (y * 3) + shiftY,
                            y1 + 2 + (y * 3) + shiftY,
                        );
                        // add the room.
                        map[x][y] = room;
                        // mark the shift so future rooms are place correctly.
                        shiftY++;
                    }
                    // if the room is a 2 tall.
                    else {
                        // create the room.
                        const room = this.makeRoom(
                            x1 + (x * 3) + shiftX,
                            x1 + 1 + (x * 3) + shiftX,
                            y1 + (y * 3) + shiftY,
                            y1 + 1 + (y * 3) + shiftY,
                        );
                        // add the room.
                        map[x][y] = room;
                    }
                }
            }
            shiftY = 0;
            if (x === xLarge[shiftX]) {
                shiftX++;
            }
        }
        // variables to decide random things.
        let shift = 0;
        // if it should add doors to the north.
        if (DNorth) {
            // add doors into the North
            shift = this.manager.random.int(mapW, 0);
            for (let x = 0; x < mapW; x++) {
                if (shift !== x || mapW === 1) {
                    map[x][0].DNorth = true;
                }
            }
        }
        // if it should add doors to the south.
        if (DSouth) {
            // add doors to the south
            shift = this.manager.random.int(mapW, 0);
            for (let x = 0; x < mapW; x++) {
                if (shift !== x || mapW === 1) {
                    map[x][mapH - 1].DSouth = true;
                }
            }
        }
        // if there should be doors to the east.
        if (DEast) {
            // add doors to the east.
            shift = this.manager.random.int(mapH, 0);
            for (let y = 0; y < mapH; y++) {
                if (shift !== y || mapH === 1) {
                    map[mapW - 1][y].DEast = true;
                }
            }
        }
        // if there should be doors to the west
        if (DWest) {
            // add doors ito the west.
            shift = this.manager.random.int(mapH, 0);
            for (let y = 0; y < mapH; y++) {
                if (shift !== y || mapH === 1) {
                    map[0][y].DWest = true;
                }
            }
        }
        // go about filling out the details of the map.
        this.roomFill(map, machines, getMutableTile);
    }

    /**
     * Generates the room connections and doorway connections.
     *
     * @param map - a 2D array that contains room structs that contain map information.
     * @param machines - the number of machines to be added to the map.
     * @param getMutableTile - A function that gets a mutable tile given an (x, y)
     */
    private roomFill(map: IRoom[][], machines: number,
                     getMutableTile: (x: number, y: number) => Mutable<Tile>): void {
        // tracks every room in the map list that is unconnected.
        const unconnected: IPoint[] = [];
        // master list of random rooms in a easy to grab fashion.
        const roomList: IPoint[] = [];
        // tracks all rooms that are eligible to get machines.
        const machRooms: IPoint[] = [];
        // tracks the number of connections that need to be made.
        let connect = Math.floor((map.length * map[0].length) / 2);
        // used to track if a direction has been chosen.
        let done = false;
        // adds all the points to the two lists
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                unconnected.push({x, y});
                roomList.push({x, y});
                machRooms.push({x, y});
            }
        }
        // add machines to the map
        if (machines > 0) {
            // place the machines
            for (let i = 0; i < machines - 1; i++) {
                // grabs a random room's location.
                const index = this.manager.random.int(machRooms.length, 0);
                // grabs the room.
                const find = machRooms[index];
                // marks it being chosen
                machRooms.splice(index, 1);
                // removes it's neighbors
                let check = this.has(machRooms, find.x, find.y - 1);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                check = this.has(machRooms, find.x + 1, find.y);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                check = this.has(machRooms, find.x, find.y + 1);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                check = this.has(machRooms, find.x - 1, find.y);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                // adds the machine.
                const room = map[find.x][find.y];
                // sets up a location to be set.
                let loc = getMutableTile(0, 0);
                // if the rooms is 2 tall.
                if (room.y3 === -1) {
                    // if the room is 2 wide.
                    if (room.x3 === -1) {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(2, 0) :
                                       this.manager.random.int(4, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 2), room.y1 + (place % 2));
                    }
                    // if the room is 3 wide.
                    else {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(4, 0) :
                                       this.manager.random.int(6, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 2), room.y1 + (place % 2));
                    }
                }
                // if the room is 3 tall.
                else {
                    // if the room is 2 wide.
                    if (room.x3 === -1) {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(3, 0) :
                                       this.manager.random.int(6, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 3), room.y1 + (place % 3));
                    }
                    // if the room is 3 wide.
                    else {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(6, 0) :
                                       this.manager.random.int(9, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 3), room.y1 + (place % 3));
                    }
                }
                // Generate the run time for the machines
                const time = this.manager.random.int(2, 9);
                // makes the machine
                const machine = this.manager.create.machine({
                    oreType: "redium",
                    refineTime: time,
                    refineInput: (Math.floor(time / 2) + 1),
                    refineOutput: Math.floor(time / 2),
                    tile: loc as Tile,
                });
                // Assigned the tile it's machine.
                loc.machine = machine;
                // Adds the machine to the list
                this.machines.push(machine);
            }
        }
        // adds extra connects for more rooms connections.
        connect += Math.floor(connect * this.manager.random.float(0.5, 0.25));
        if (roomList.length <= 4) {
            connect = this.manager.random.int(1, -1);
        }
        for (let i = 0; i <= connect; i++) {
            // used to make the map-gen favor connecting unconnected rooms.
            if (unconnected.length > 0) {
                // grabs a random room. Also used to remove it from the list.
                const index = this.manager.random.int(unconnected.length, 0);
                // grabs the room.
                const find = unconnected[index];
                // resets done.
                done = false;
                // picks a random direction.
                let rot = this.manager.random.int(4, 0);
                // makes sure it picks something if no options are optimal.
                let num = 0;
                // a while loop that forces it to pick something.
                while (!done) {
                    // if the direction is north.
                    if (rot === 0) {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x][find.y - 1] && (this.has(unconnected, find.x, find.y - 1) >= 0 || num >= 4)) {
                            // makes the connection.
                            map[find.x][find.y].WNorth = false;
                            map[find.x][find.y - 1].WSouth = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x, find.y - 1) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x, find.y - 1), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot++;
                        }
                    }
                    // if the direction is east
                    else if (rot === 1) {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x + 1] && (this.has(unconnected, find.x + 1, find.y) >= 0 || num >= 5)) {
                            // makes the connection.
                            map[find.x][find.y].WEast = false;
                            map[find.x + 1][find.y].WWest = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x + 1, find.y) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x + 1, find.y), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot++;
                        }
                    }
                    // if the direction is south.
                    else if (rot === 2) {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x][find.y + 1] && (this.has(unconnected, find.x, find.y + 1) >= 0 || num >= 5)) {
                            // makes the connection.
                            map[find.x][find.y].WSouth = false;
                            map[find.x][find.y + 1].WNorth = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x, find.y + 1) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x + 1, find.y), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot++;
                        }
                    }
                    // if the direction is west.
                    else {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x - 1] && (this.has(unconnected, find.x - 1, find.y) >= 0 || num >= 5)) {
                            // makes the connection.
                            map[find.x][find.y].WWest = false;
                            map[find.x - 1][find.y].WEast = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x - 1, find.y) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x - 1, find.y), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot = 0;
                        }
                    }
                }
            }
            // every room as been connected, do a simpler random connection.
            else {
                // grabs a random room.
                const find = roomList[this.manager.random.int(roomList.length, 0)];
                // makes sure it picks a valid direction
                done = false;
                // picks a random direction/
                let rot = this.manager.random.int(4, 0);
                while (!done) {
                    // if it picked north.
                    if (rot === 0) {
                        // make sure the direction is valid.
                        if (map[find.x][find.y - 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WNorth = false;
                            map[find.x][find.y - 1].WSouth = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot++;
                        }
                    }
                    else if (rot === 1) {
                        // make sure the direction is valid.
                        if (map[find.x + 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WEast = false;
                            map[find.x + 1][find.y].WWest = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot++;
                        }
                    }
                    else if (rot === 2) {
                        // make sure the direction is valid.
                        if (map[find.x][find.y + 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WSouth = false;
                            map[find.x][find.y + 1].WNorth = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot++;
                        }
                    }
                    else {
                        // make sure the direction is valid.
                        if (map[find.x - 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WWest = false;
                            map[find.x - 1][find.y].WEast = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot = 0;
                        }
                    }
                }
            }
        }
        // cleanup List to reduce memory usage
        unconnected.length = 0;
        // Que of rooms to be connected
        const toConnectQue: IPoint[] = [];
        // used to track rooms that are connected.
        const connected: IPoint[] = [];
        // find a starting room.
        const start = roomList[this.manager.random.int(roomList.length, 0)];
        // add starting room.
        connected.push(start);
        // add existing neighbors to the que
        if (map[start.x - 1]) {
            toConnectQue.push({x: start.x - 1, y: start.y});
        }
        if (map[start.x + 1]) {
            toConnectQue.push({x: start.x + 1, y: start.y});
        }
        if (map[start.x][start.y - 1]) {
            toConnectQue.push({x: start.x, y: start.y - 1});
        }
        if (map[start.x][start.y + 1]) {
            toConnectQue.push({x: start.x, y: start.y + 1});
        }
        // making each room make a unique connection.
        while (toConnectQue.length !== 0) {
            // grab the index of the room to be worked with.
            const index = this.manager.random.int(toConnectQue.length, 0);
            // grab the room info.
            const find = toConnectQue[index];
            // mark that the room hasn't been found.
            let found = false;
            // pick a random direction.
            let rot = this.manager.random.int(4, 0);
            // until a room is found.
            while (!found) {
                // check if the north exists and is connected.
                if (rot === 0 && map[find.x][find.y - 1] && this.has(connected, find.x, find.y - 1) >= 0) {
                    // connect it.
                    map[find.x][find.y].DNorth = true;
                    map[find.x][find.y - 1].DSouth = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot++;
                }
                if (rot === 1 && map[find.x + 1] && this.has(connected, find.x + 1, find.y) >= 0) {
                    // connect it.
                    map[find.x][find.y].DEast = true;
                    map[find.x + 1][find.y].DWest = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot++;
                }
                if (rot === 2 && map[find.x][find.y + 1] && this.has(connected, find.x, find.y + 1) >= 0) {
                    // connect it.
                    map[find.x][find.y].DSouth = true;
                    map[find.x][find.y + 1].DNorth = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot++;
                }
                if (map[find.x - 1] && this.has(connected, find.x - 1, find.y) >= 0) {
                    // connect it.
                    map[find.x][find.y].DWest = true;
                    map[find.x - 1][find.y].DEast = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot = 0;
                }
                // if a connection was found.
                if (found) {
                    // if the room to the left isn't in either list and exists, add it to the queue
                    if (map[find.x - 1] && this.has(connected, find.x - 1, find.y) === -1 &&
                        this.has(toConnectQue, find.x - 1, find.y) === -1) {
                        toConnectQue.push({x: find.x - 1, y: find.y});
                    }
                    // if the room to the right isn't in either list and exists, add it to the queue
                    if (map[find.x + 1] && this.has(connected, find.x + 1, find.y) === -1 &&
                    this.has(toConnectQue, find.x + 1, find.y) === -1) {
                        toConnectQue.push({x: find.x + 1, y: find.y});
                    }
                    // if the room above isn't in either list and exists, add it to the queue
                    if (map[find.x][find.y - 1] && this.has(connected, find.x, find.y - 1) === -1 &&
                    this.has(toConnectQue, find.x, find.y - 1) === -1) {
                        toConnectQue.push({x: find.x, y: find.y - 1});
                    }
                    // if the room below isn't in either list and exists, add it to the queue
                    if (map[find.x][find.y + 1] && this.has(connected, find.x, find.y + 1) === -1 &&
                    this.has(toConnectQue, find.x, find.y + 1) === -1) {
                        toConnectQue.push({x: find.x, y: find.y + 1});
                    }
                }
            }
        }
        // actually draws all the walls and doors.
        this.draw(map, getMutableTile);
    }

    /**
     * This draws the rooms. only handles simple room clusters, 3 tall, not 3 wide.
     *
     * @param map - a 2D array of rooms for it to draw using.
     * @param getMutableTile - the function for it to grab tiles.
     */
    private draw(map: IRoom[][], getMutableTile: (x: number, y: number) => Mutable<Tile>): void {
        // Test code to help visualize where it actually places rooms.
        /*for (const x of map) {
            for (const y of x) {
                getMutableTile(y.x1, y.y1).owner = this.players[0];
                getMutableTile(y.x1, y.y1).type = "generator";
                getMutableTile(y.x1, y.y2).owner = this.players[0];
                getMutableTile(y.x1, y.y2).type = "generator";
                getMutableTile(y.x2, y.y1).owner = this.players[0];
                getMutableTile(y.x2, y.y1).type = "generator";
                getMutableTile(y.x2, y.y2).owner = this.players[0];
                getMutableTile(y.x2, y.y2).type = "generator";
                if (y.y3 !== -1) {
                    if (y.x3 !== -1) {
                        getMutableTile(y.x3, y.y1).owner = this.players[0];
                        getMutableTile(y.x3, y.y1).type = "generator";
                        getMutableTile(y.x3, y.y2).owner = this.players[0];
                        getMutableTile(y.x3, y.y2).type = "generator";
                        getMutableTile(y.x1, y.y3).owner = this.players[0];
                        getMutableTile(y.x1, y.y3).type = "generator";
                        getMutableTile(y.x2, y.y3).owner = this.players[0];
                        getMutableTile(y.x2, y.y3).type = "generator";
                        getMutableTile(y.x3, y.y3).owner = this.players[0];
                        getMutableTile(y.x3, y.y3).type = "generator";
                    }
                    else {
                        getMutableTile(y.x1, y.y3).owner = this.players[0];
                        getMutableTile(y.x1, y.y3).type = "generator";
                        getMutableTile(y.x2, y.y3).owner = this.players[0];
                        getMutableTile(y.x2, y.y3).type = "generator";
                    }
                }
                else if (y.x3 !== -1) {
                    getMutableTile(y.x3, y.y1).owner = this.players[0];
                    getMutableTile(y.x3, y.y1).type = "generator";
                    getMutableTile(y.x3, y.y2).owner = this.players[0];
                    getMutableTile(y.x3, y.y2).type = "generator";
                }
            }
        }*/
        // iterate through the rooms of the map.
        let v: number = 0;
        let w: number = 0;
        for (const rooms of map) {
            for (const room of rooms) {
                // corners.
                // draw the northern corners
                this.drawCorner(room.x1 - 1, room.y1 - 1, room.WNorth, room.WWest, getMutableTile);
                // if the room is 2 wide.
                if (room.x3 === -1) {
                    this.drawCorner(room.x2 + 1, room.y1 - 1, room.WNorth, room.WEast, getMutableTile);
                    // draw the southern corners, account for different heights
                    // if the room is 2 tall.
                    if (room.y3 === -1) {
                        this.drawCorner(room.x1 - 1, room.y2 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x2 + 1, room.y2 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                    // if the room is 3 tall.
                    else {
                        this.drawCorner(room.x1 - 1, room.y3 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x2 + 1, room.y3 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                }
                // if the room is 3 wide.
                else {
                    this.drawCorner(room.x3 + 1, room.y1 - 1, room.WNorth, room.WEast, getMutableTile);
                    // draw the southern corners, account for different heights
                    // if the room is 2 tall.
                    if (room.y3 === -1) {
                        this.drawCorner(room.x1 - 1, room.y2 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x3 + 1, room.y2 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                    // if the room is 3 tall.
                    else {
                        this.drawCorner(room.x1 - 1, room.y3 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x3 + 1, room.y3 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                }
                // if there is a wall to the north, draw it.
                if (room.WNorth) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube: boolean = map[v][w - 1] && rand <= 8 && ((!map[v][w - 1].WEast && !room.WEast) ||
                                    (!map[v][w - 1].WWest && !room.WWest)) ? true : false;
                    // if the room is 3 wide.
                    this.drawWall(room.x1, room.y1 - 1, getMutableTile);
                    getMutableTile(room.x1, room.y1 - 1).decoration = cube ? 1 : 0;
                    this.drawWall(room.x2, room.y1 - 1, getMutableTile);
                    getMutableTile(room.x2, room.y1 - 1).decoration = cube ? 1 : 0;
                    // if the room is 3 wide.
                    if (room.x3 !== -1) {
                        this.drawWall(room.x3, room.y1 - 1, getMutableTile);
                        getMutableTile(room.x3, room.y1 - 1).decoration = cube ? 1 : 0;
                    }
                }
                // if there is a wall to the east, draw it.
                if (room.WEast) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube: boolean = map[v + 1] && rand <= 8 && ((!map[v + 1][w].WNorth && !room.WNorth) ||
                                        (!map[v + 1][w].WSouth && !room.WSouth)) ? true : false;
                    // if the room is 3 wide.
                    if (room.x3 !== -1) {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x3 + 1, room.y1, getMutableTile);
                        getMutableTile(room.x3 + 1, room.y1).decoration = cube ? 2 : 0;
                        this.drawWall(room.x3 + 1, room.y2, getMutableTile);
                        getMutableTile(room.x3 + 1, room.y2).decoration = cube ? 2 : 0;
                        // if the room is 3 tall.
                        if (room.y3 !== -1) {
                            // place the wall as long as it doesn't cover up a door.
                            this.drawWall(room.x3 + 1, room.y3, getMutableTile);
                            getMutableTile(room.x3 + 1, room.y3).decoration = cube ? 2 : 0;
                        }
                    }
                    // if the room is 2 wide.
                    else {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x2 + 1, room.y1, getMutableTile);
                        getMutableTile(room.x2 + 1, room.y1).decoration = cube ? 2 : 0;
                        this.drawWall(room.x2 + 1, room.y2, getMutableTile);
                        getMutableTile(room.x2 + 1, room.y2).decoration = cube ? 2 : 0;
                        // if the room is 3 tall.
                        if (room.y3 !== -1) {
                            // place the wall as long as it doesn't cover up a door.
                            this.drawWall(room.x2 + 1, room.y3, getMutableTile);
                            getMutableTile(room.x2 + 1, room.y3).decoration = cube ? 2 : 0;
                        }
                    }
                }
                // if there is a wall to the south, drawn it.
                if (room.WSouth) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube: boolean = map[v][w + 1] && rand <= 8 && ((!map[v][w + 1].WEast && !room.WEast) ||
                                        (!map[v][w + 1].WWest && !room.WWest)) ? true : false;
                    // if the room is 3 tall.
                    if (room.y3 !== -1) {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x1, room.y3 + 1, getMutableTile);
                        getMutableTile(room.x1, room.y3 + 1).decoration = cube ? 1 : 0;
                        this.drawWall(room.x2, room.y3 + 1, getMutableTile);
                        getMutableTile(room.x2, room.y3 + 1).decoration = cube ? 1 : 0;
                        // if the room is 3 wide.
                        if (room.x3 !== -1) {
                            this.drawWall(room.x3, room.y3 + 1, getMutableTile);
                            getMutableTile(room.x3, room.y3 + 1).decoration = cube ? 1 : 0;
                        }
                        // if the room is 2 tall.
                    }
                    else {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x1, room.y2 + 1, getMutableTile);
                        getMutableTile(room.x1, room.y2 + 1).decoration = cube ? 1 : 0;
                        this.drawWall(room.x2, room.y2 + 1, getMutableTile);
                        getMutableTile(room.x2, room.y2 + 1).decoration = cube ? 1 : 0;
                        // if the room is 3 wide.
                        if (room.x3 !== -1) {
                            this.drawWall(room.x3, room.y2 + 1, getMutableTile);
                            getMutableTile(room.x3, room.y2 + 1).decoration = cube ? 1 : 0;
                        }
                    }
                }
                // if there is a wall to the west, draw it.
                if (room.WWest) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube: boolean = map[v - 1] && rand <= 8 && ((!map[v - 1][w].WNorth && !room.WNorth) ||
                                        (!map[v - 1][w].WSouth && !room.WSouth)) ? true : false;
                    // place the wall as long as it doesn't cover up a door.
                    this.drawWall(room.x1 - 1, room.y1, getMutableTile);
                    getMutableTile(room.x1 - 1, room.y1).decoration = cube ? 2 : 0;
                    this.drawWall(room.x1 - 1, room.y2, getMutableTile);
                    getMutableTile(room.x1 - 1, room.y2).decoration = cube ? 2 : 0;
                    // if the room is 3 tall.
                    if (room.y3 !== -1) {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x1 - 1, room.y3, getMutableTile);
                        getMutableTile(room.x1 - 1, room.y3).decoration = cube ? 2 : 0;
                    }
                }
                w++;
            }
            v++;
            w = 0;
        }
        // iterate over the map in order to draw rooms.
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                const room = map[x][y];
                // start drawing walls
                let shift = 0;
                // if there is door to the north, draw it.
                if (room.DNorth === true) {
                    // make sure it is drawn only once.
                    if (map[x][y - 1]) {
                        map[x][y - 1].DSouth = false;
                    }
                    // figure out which part of the wall to make the door.
                    if (room.WNorth === true) {
                        // determines possible placements depending on room size.
                        const size = room.x3 === -1 ? 2 : 3;
                        // pick a random spot.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        //  decide which spot the door should be on.
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(room.x1 + i, room.y1 - 2).machine !== undefined ||
                                    getMutableTile(room.x1 + i, room.y1).machine !== undefined) && temp < size) ||
                                    getMutableTile(room.x1 + i, room.y1 - 2).isWall ||
                                    getMutableTile(room.x1 + i, room.y1 - 2).decoration === 1 ||
                                    getMutableTile(room.x1 + i, room.y1 - 2).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(room.x1, room.y1 - 1, 1, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(room.x2, room.y1 - 1, 1, getMutableTile);
                        }
                        else {
                            this.drawDoor(room.x3, room.y1 - 1, 1, getMutableTile);
                        }
                    }
                }
                // if there is a door to the east.
                if (room.DEast === true) {
                    // make sure it is drawn only once.
                    if (map[x + 1]) {
                        map[x + 1][y].DWest = false;
                    }
                    if (room.WEast === true) {
                        // determines possible placements depending on room size.
                        const size = room.y3 === -1 ? 2 : 3;
                        // determines which x value will be used
                        const roomX = room.x3 === -1 ? room.x2 : room.x3;
                        // figure out which part of the wall to make the door.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(roomX + 2, room.y1 + i).machine !== undefined ||
                                    getMutableTile(roomX, room.y1 + i).machine !== undefined) && temp < size) ||
                                    getMutableTile(roomX + 2, room.y1 + i).isWall ||
                                    getMutableTile(roomX + 2, room.y1 + i).decoration === 1 ||
                                    getMutableTile(roomX + 2, room.y1 + i).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(roomX + 1, room.y1, 2, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(roomX + 1, room.y2, 2, getMutableTile);
                        }
                        else {
                            this.drawDoor(roomX + 1, room.y3, 2, getMutableTile);
                        }
                    }
                }
                if (room.DSouth === true) {
                    // make sure it is drawn only once.
                    if (map[x][y + 1]) {
                        map[x][y + 1].DNorth = false;
                    }
                    if (room.WSouth === true) {
                        // determines possible placements depending on room size.
                        const size = room.x3 === -1 ? 2 : 3;
                        // determines which y value will be used
                        const roomY = room.y3 === -1 ? room.y2 : room.y3;
                        // figure out which part of the wall to make the door.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(room.x1 + i, roomY + 2).machine !== undefined ||
                                    getMutableTile(room.x1 + i, roomY).machine !== undefined) && temp < size) ||
                                    getMutableTile(room.x1 + i, roomY + 2).isWall ||
                                    getMutableTile(room.x1 + i, roomY + 2).decoration === 1 ||
                                    getMutableTile(room.x1 + i, roomY + 2).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(room.x1, roomY + 1, 1, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(room.x2, roomY + 1, 1, getMutableTile);
                        }
                        else {
                            this.drawDoor(room.x3, roomY + 1, 1, getMutableTile);
                        }
                    }
                }
                if (room.DWest === true) {
                    // make sure it is drawn only once.
                    if (map[x - 1]) {
                        map[x - 1][y].DEast = false;
                    }
                    if (room.WWest === true) {
                        // determines possible placements depending on room size.
                        const size = room.y3 === -1 ? 2 : 3;
                        // figure out which part of the wall to make the door.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(room.x1 - 2, room.y1 + i).machine !== undefined ||
                                    getMutableTile(room.x1, room.y1 + i).machine !== undefined) && temp < size) ||
                                    getMutableTile(room.x1 - 2, room.y1 + i).isWall ||
                                    getMutableTile(room.x1 - 2, room.y1 + i).decoration === 1 ||
                                    getMutableTile(room.x1 - 2, room.y1 + i).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(room.x1 - 1, room.y1, 2, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(room.x1 - 1, room.y2, 2, getMutableTile);
                        }
                        else {
                            this.drawDoor(room.x1 - 1, room.y3, 2, getMutableTile);
                        }
                    }
                }
            }
        }
    }

    /**
     * this draws a corner if there aren't room connections in that direction.
     *
     * @param x - the x point the corner will be placed at.
     * @param y - the y point the corner will be placed at.
     * @param dir1 - direction one to check to see if the corner should be placed.
     * @param dir2 - direction two to check to see if the corner should be placed.
     * @param getMutableTile - the function for it to grab tiles.
     * @returns nothing.
     */
    private drawCorner(x: number, y: number, dir1: boolean, dir2: boolean,
                       getMutableTile: (x: number, y: number) => Mutable<Tile>): void {
        if (dir1 === true || dir2 === true) {
            getMutableTile(x, y).isWall = true;
        }
    }

    /**
     * this draws walls and makes sure that there isn't a door there.
     *
     * @param x - the x point the corner will be placed at.
     * @param y - the y point the corner will be placed at.
     * @param getMutableTile - the function for it to grab tiles.
     * @returns nothing.
     */
    private drawWall(x: number, y: number, getMutableTile: (x: number, y: number) => Mutable<Tile>): void {
        if (getMutableTile(x, y).decoration !== 1) {
            getMutableTile(x, y).isWall = true;
        }
    }

    /**
     * this draws walls and makes sure that there isn't a door there.
     *
     * @param x - the x point the corner will be placed at.
     * @param y - the y point the corner will be placed at.
     * @param d - decoration value of the door. Default of 1
     * @param getMutableTile - the function for it to grab tiles.
     * @returns nothing.
     */
    private drawDoor(x: number, y: number, d: number = 1,
                     getMutableTile: (x: number, y: number) => Mutable<Tile>): void {
        getMutableTile(x, y).isWall = false;
        getMutableTile(x, y).decoration = d;
    }

    /**
     * this makes sure the room is in the list. I was uncreative with the name.
     *
     * @param uncon - a list of x and y points.
     * @param x - the x point you are checking for.
     * @param y - the y point you are checking for.
     * @returns returns it's index or -1 if it doesn't exist.
     */
    private has(uncon: IPoint[], x: number, y: number): number {
        for (let w = 0; w < uncon.length; w++) {
            if (uncon[w].x === x && uncon[w].y === y) {
                return w;
            }
        }

        return -1;
    }

    /**
     * Attempts to spawn in a unit for a given player.
     * @param player - The player that will own the unit.
     * @param job - The job of the unit.
     */
    private spawnUnit(player: Player, job: Job): void {
        // Iterate through each player's spawn tiles to find a spot to spawn unit.
        for (const tile of player.spawnTiles) {
            // Check to see if there is a Unit on the tile.
            // If there is move on to the next tile.
            if (tile.unit) {
                continue;
            }
            // Else spawn in Unit and return success to spawning.
            else {
                tile.unit = this.manager.create.unit({
                    acted: false,
                    health: job.health,
                    job,
                    owner: player,
                    tile,
                    moves: job.moves,
                });
                player.units.push(tile.unit);
                this.units.push(tile.unit);

                return;
            }
        }
    }

    // <<-- /Creer-Merge: protected-private-functions -->>
}
