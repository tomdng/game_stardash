// WARNING: Here be Dragons
// This file is generated by Creer, do not modify it
// It basically sets up all the classes, interfaces, types, and what-not that
// we need for TypeScript to know the base classes, while allowing for minimal
// code for developers to be forced to fill out.

// tslint:disable:max-classes-per-file
// ^ because we need to build a bunch of base class wrappers here

// base game classes
import { BaseAI, BaseGame, BaseGameManager, BaseGameObject,
         BaseGameObjectFactory, BaseGameSettingsManager, BasePlayer,
         makeNamespace } from "~/core/game";

// mixins
import { ITiledPlayer, ITurnBasedPlayer, ITwoPlayerPlayer, mixTiled,
         mixTurnBased, mixTwoPlayer } from "~/core/game/mixins";

// extract game object constructor args
import { FirstArgumentFromConstructor } from "~/utils";

/**
 * The interface the Player for the Stumped game
 * must implement from mixed in game logic.
 */
export interface IBaseStumpedPlayer extends
    BasePlayer,
    ITwoPlayerPlayer,
    ITurnBasedPlayer,
    ITiledPlayer {
}

const base0 = {
    AI: BaseAI,
    Game: BaseGame,
    GameManager: BaseGameManager,
    GameObject: BaseGameObject,
    GameSettings: BaseGameSettingsManager,
};

const base1 = mixTwoPlayer(base0);
const base2 = mixTurnBased(base1);
const base3 = mixTiled(base2);

const mixed = base3;

/** The base AI class for the Stumped game will mixin logic. */
class BaseStumpedAI extends mixed.AI {}

/** The base Game class for the Stumped game will mixin logic. */
class BaseStumpedGame extends mixed.Game {}

/** The base GameManager class for the Stumped game will mixin logic. */
class BaseStumpedGameManager extends mixed.GameManager {}

/** The base GameObject class for the Stumped game will mixin logic. */
class BaseStumpedGameObject extends mixed.GameObject {}

/** The base GameSettings class for the Stumped game will mixin logic. */
class BaseStumpedGameSettings extends mixed.GameSettings {}

/** The Base classes that game classes build off of. */
export const BaseClasses = {
    AI: BaseStumpedAI,
    Game: BaseStumpedGame,
    GameManager: BaseStumpedGameManager,
    GameObject: BaseStumpedGameObject,
    GameSettings: BaseStumpedGameSettings,
};

// Now all the base classes are created;
// so we can start importing/exporting the classes that need them.

/** All the possible properties for an Beaver. */
export interface IBeaverProperties {
    /**
     * The number of actions remaining for the Beaver this turn.
     */
    actions?: number;

    /**
     * The amount of branches this Beaver is holding.
     */
    branches?: number;

    /**
     * The amount of food this Beaver is holding.
     */
    food?: number;

    /**
     * How much health this Beaver has left.
     */
    health?: number;

    /**
     * The Job this Beaver was recruited to do.
     */
    job?: Job;

    /**
     * How many moves this Beaver has left this turn.
     */
    moves?: number;

    /**
     * The Player that owns and can control this Beaver.
     */
    owner?: Player;

    /**
     * True if the Beaver has finished being recruited and can do things, False
     * otherwise.
     */
    recruited?: boolean;

    /**
     * The Tile this Beaver is on.
     */
    tile?: Tile;

    /**
     * Number of turns this Beaver is distracted for (0 means not distracted).
     */
    turnsDistracted?: number;

}

/**
 * Argument overrides for Beaver's attack function. If you return an object of
 * this interface from the invalidate functions, the value(s) you set will be
 * used in the actual function.
 */
export interface IBeaverAttackArgs {
    /**
     * The Beaver to attack. Must be on an adjacent Tile.
     */
    beaver?: Beaver;
}

/**
 * Argument overrides for Beaver's buildLodge function. If you return an object
 * of this interface from the invalidate functions, the value(s) you set will
 * be used in the actual function.
 */
export interface IBeaverBuildLodgeArgs {
}

/**
 * Argument overrides for Beaver's drop function. If you return an object of
 * this interface from the invalidate functions, the value(s) you set will be
 * used in the actual function.
 */
export interface IBeaverDropArgs {
    /**
     * The Tile to drop branches/food on. Must be the same Tile that the Beaver
     * is on, or an adjacent one.
     */
    tile?: Tile;
    /**
     * The type of resource to drop ('branches' or 'food').
     */
    resource?: "branches" | "food";
    /**
     * The amount of the resource to drop, numbers <= 0 will drop all the
     * resource type.
     */
    amount?: number;
}

/**
 * Argument overrides for Beaver's harvest function. If you return an object of
 * this interface from the invalidate functions, the value(s) you set will be
 * used in the actual function.
 */
export interface IBeaverHarvestArgs {
    /**
     * The Spawner you want to harvest. Must be on an adjacent Tile.
     */
    spawner?: Spawner;
}

/**
 * Argument overrides for Beaver's move function. If you return an object of
 * this interface from the invalidate functions, the value(s) you set will be
 * used in the actual function.
 */
export interface IBeaverMoveArgs {
    /**
     * The Tile this Beaver should move to.
     */
    tile?: Tile;
}

/**
 * Argument overrides for Beaver's pickup function. If you return an object of
 * this interface from the invalidate functions, the value(s) you set will be
 * used in the actual function.
 */
export interface IBeaverPickupArgs {
    /**
     * The Tile to pickup branches/food from. Must be the same Tile that the
     * Beaver is on, or an adjacent one.
     */
    tile?: Tile;
    /**
     * The type of resource to pickup ('branches' or 'food').
     */
    resource?: "branches" | "food";
    /**
     * The amount of the resource to drop, numbers <= 0 will pickup all of the
     * resource type.
     */
    amount?: number;
}

/** All the possible properties for an GameObject. */
export interface IGameObjectProperties {
}

/** All the possible properties for an Job. */
export interface IJobProperties {
    /**
     * The number of actions this Job can make per turn.
     */
    actions?: number;

    /**
     * How many combined resources a beaver with this Job can hold at once.
     */
    carryLimit?: number;

    /**
     * Scalar for how many branches this Job harvests at once.
     */
    chopping?: number;

    /**
     * How much food this Job costs to recruit.
     */
    cost?: number;

    /**
     * The amount of damage this Job does per attack.
     */
    damage?: number;

    /**
     * How many turns a beaver attacked by this Job is distracted by.
     */
    distractionPower?: number;

    /**
     * The amount of starting health this Job has.
     */
    health?: number;

    /**
     * The number of moves this Job can make per turn.
     */
    moves?: number;

    /**
     * Scalar for how much food this Job harvests at once.
     */
    munching?: number;

    /**
     * The Job title.
     */
    title?: string;

}

/**
 * Argument overrides for Job's recruit function. If you return an object of
 * this interface from the invalidate functions, the value(s) you set will be
 * used in the actual function.
 */
export interface IJobRecruitArgs {
    /**
     * The Tile that is a lodge owned by you that you wish to spawn the Beaver
     * of this Job on.
     */
    tile?: Tile;
}

/** All the possible properties for an Player. */
export interface IPlayerProperties {
    /**
     * The list of Beavers owned by this Player.
     */
    beavers?: Beaver[];

    /**
     * How many branches are required to build a lodge for this Player.
     */
    branchesToBuildLodge?: number;

    /**
     * What type of client this is, e.g. 'Python', 'JavaScript', or some other
     * language. For potential data mining purposes.
     */
    clientType?: string;

    /**
     * A list of Tiles that contain lodges owned by this player.
     */
    lodges?: Tile[];

    /**
     * If the player lost the game or not.
     */
    lost?: boolean;

    /**
     * The name of the player.
     */
    name?: string;

    /**
     * This player's opponent in the game.
     */
    opponent?: Player;

    /**
     * The reason why the player lost the game.
     */
    reasonLost?: string;

    /**
     * The reason why the player won the game.
     */
    reasonWon?: string;

    /**
     * The amount of time (in ns) remaining for this AI to send commands.
     */
    timeRemaining?: number;

    /**
     * If the player won the game or not.
     */
    won?: boolean;

}

/** All the possible properties for an Spawner. */
export interface ISpawnerProperties {
    /**
     * True if this Spawner has been harvested this turn, and it will not heal
     * at the end of the turn, false otherwise.
     */
    hasBeenHarvested?: boolean;

    /**
     * How much health this Spawner has, which is used to calculate how much of
     * its resource can be harvested.
     */
    health?: number;

    /**
     * The Tile this Spawner is on.
     */
    tile?: Tile;

    /**
     * What type of resource this is ('food' or 'branches').
     */
    type?: "food" | "branches";

}

/** All the possible properties for an Tile. */
export interface ITileProperties {
    /**
     * The Beaver on this Tile if present, otherwise undefined.
     */
    beaver?: Beaver;

    /**
     * The number of branches dropped on this Tile.
     */
    branches?: number;

    /**
     * The cardinal direction water is flowing on this Tile ('North', 'East',
     * 'South', 'West').
     */
    flowDirection?: "North" | "East" | "South" | "West" | "";

    /**
     * The number of food dropped on this Tile.
     */
    food?: number;

    /**
     * The owner of the Beaver lodge on this Tile, if present, otherwise
     * undefined.
     */
    lodgeOwner?: Player;

    /**
     * The resource Spawner on this Tile if present, otherwise undefined.
     */
    spawner?: Spawner;

    /**
     * The Tile to the 'East' of this one (x+1, y). Undefined if out of bounds
     * of the map.
     */
    tileEast?: Tile;

    /**
     * The Tile to the 'North' of this one (x, y-1). Undefined if out of bounds
     * of the map.
     */
    tileNorth?: Tile;

    /**
     * The Tile to the 'South' of this one (x, y+1). Undefined if out of bounds
     * of the map.
     */
    tileSouth?: Tile;

    /**
     * The Tile to the 'West' of this one (x-1, y). Undefined if out of bounds
     * of the map.
     */
    tileWest?: Tile;

    /**
     * What type of Tile this is, either 'water' or 'land'.
     */
    type?: "land" | "water";

    /**
     * The x (horizontal) position of this Tile.
     */
    x?: number;

    /**
     * The y (vertical) position of this Tile.
     */
    y?: number;

}

export * from "./beaver";
export * from "./game-object";
export * from "./job";
export * from "./player";
export * from "./spawner";
export * from "./tile";
export * from "./game";
export * from "./game-manager";
export * from "./ai";

import { Beaver } from "./beaver";
import { GameObject } from "./game-object";
import { Job } from "./job";
import { Player } from "./player";
import { Spawner } from "./spawner";
import { Tile } from "./tile";

import { AI } from "./ai";
import { StumpedGame } from "./game";
import { StumpedGameManager } from "./game-manager";
import { StumpedGameSettingsManager } from "./game-settings";

/** The arguments used to construct a Beaver */
export type BeaverArgs = FirstArgumentFromConstructor<typeof Beaver>;

/** The arguments used to construct a Job */
export type JobArgs = FirstArgumentFromConstructor<typeof Job>;

/** The arguments used to construct a Spawner */
export type SpawnerArgs = FirstArgumentFromConstructor<typeof Spawner>;

/** The arguments used to construct a Tile */
export type TileArgs = FirstArgumentFromConstructor<typeof Tile>;

/**
 * The factory that **must** be used to create any game objects in
 * the Stumped game.
 */
export class StumpedGameObjectFactory extends BaseGameObjectFactory {
    /**
     * Creates a new Beaver in the Game and tracks it for all players.
     *
     * @param args - Data about the Beaver to set. Any keys matching a property
     * in the game object's class will be automatically set for you.
     * @returns A new Beaver hooked up in the game and ready for you to use.
     */
    public beaver<T extends BeaverArgs>(
        args: Readonly<T>,
    ): Beaver & T {
        return this.createGameObject("Beaver", Beaver, args);
    }

    /**
     * Creates a new Job in the Game and tracks it for all players.
     *
     * @param args - Data about the Job to set. Any keys matching a property in
     * the game object's class will be automatically set for you.
     * @returns A new Job hooked up in the game and ready for you to use.
     */
    public job<T extends JobArgs>(
        args: Readonly<T>,
    ): Job & T {
        return this.createGameObject("Job", Job, args);
    }

    /**
     * Creates a new Spawner in the Game and tracks it for all players.
     *
     * @param args - Data about the Spawner to set. Any keys matching a
     * property in the game object's class will be automatically set for you.
     * @returns A new Spawner hooked up in the game and ready for you to use.
     */
    public spawner<T extends SpawnerArgs>(
        args: Readonly<T>,
    ): Spawner & T {
        return this.createGameObject("Spawner", Spawner, args);
    }

    /**
     * Creates a new Tile in the Game and tracks it for all players.
     *
     * @param args - Data about the Tile to set. Any keys matching a property
     * in the game object's class will be automatically set for you.
     * @returns A new Tile hooked up in the game and ready for you to use.
     */
    public tile<T extends TileArgs>(
        args: Readonly<T>,
    ): Tile & T {
        return this.createGameObject("Tile", Tile, args);
    }

}

/**
 * The shared namespace for Stumped that is used to
 * initialize each game instance.
 */
export const Namespace = makeNamespace({
    AI,
    Game: StumpedGame,
    GameManager: StumpedGameManager,
    GameObjectFactory: StumpedGameObjectFactory,
    GameSettingsManager: StumpedGameSettingsManager,
    Player,

    // These are generated metadata that allow delta-merging values from
    // clients.
    // They are never intended to be directly interfaced with outside of the
    // Cerveau core developers.
    gameName: "Stumped",
    gameSettingsManager: new StumpedGameSettingsManager(),
    gameObjectsSchema: {
        AI: {
            attributes: {
            },
            functions: {
                runTurn: {
                    args: [
                    ],
                    returns: {
                        typeName: "boolean",
                    },
                },
            },
        },
        Game: {
            attributes: {
                beavers: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Beaver,
                        nullable: false,
                    },
                },
                currentPlayer: {
                    typeName: "gameObject",
                    gameObjectClass: Player,
                    nullable: false,
                },
                currentTurn: {
                    typeName: "int",
                },
                freeBeaversCount: {
                    typeName: "int",
                },
                gameObjects: {
                    typeName: "dictionary",
                    keyType: {
                        typeName: "string",
                    },
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: GameObject,
                        nullable: false,
                    },
                },
                jobs: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Job,
                        nullable: false,
                    },
                },
                lodgeCostConstant: {
                    typeName: "float",
                },
                lodgesToWin: {
                    typeName: "int",
                },
                mapHeight: {
                    typeName: "int",
                },
                mapWidth: {
                    typeName: "int",
                },
                maxTurns: {
                    typeName: "int",
                },
                players: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Player,
                        nullable: false,
                    },
                },
                session: {
                    typeName: "string",
                },
                spawner: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Spawner,
                        nullable: false,
                    },
                },
                spawnerHarvestConstant: {
                    typeName: "float",
                },
                spawnerTypes: {
                    typeName: "list",
                    valueType: {
                        typeName: "string",
                    },
                },
                tiles: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Tile,
                        nullable: false,
                    },
                },
                timeAddedPerTurn: {
                    typeName: "int",
                },
            },
            functions: {
            },
        },
        Beaver: {
            parentClassName: "GameObject",
            attributes: {
                actions: {
                    typeName: "int",
                },
                branches: {
                    typeName: "int",
                },
                food: {
                    typeName: "int",
                },
                health: {
                    typeName: "int",
                },
                job: {
                    typeName: "gameObject",
                    gameObjectClass: Job,
                    nullable: false,
                },
                moves: {
                    typeName: "int",
                },
                owner: {
                    typeName: "gameObject",
                    gameObjectClass: Player,
                    nullable: false,
                },
                recruited: {
                    typeName: "boolean",
                },
                tile: {
                    typeName: "gameObject",
                    gameObjectClass: Tile,
                    nullable: true,
                },
                turnsDistracted: {
                    typeName: "int",
                },
            },
            functions: {
                attack: {
                    args: [
                        {
                            argName: "beaver",
                            typeName: "gameObject",
                            gameObjectClass: Beaver,
                            nullable: false,
                        },
                    ],
                    invalidValue: false,
                    returns: {
                        typeName: "boolean",
                    },
                },
                buildLodge: {
                    args: [
                    ],
                    invalidValue: false,
                    returns: {
                        typeName: "boolean",
                    },
                },
                drop: {
                    args: [
                        {
                            argName: "tile",
                            typeName: "gameObject",
                            gameObjectClass: Tile,
                            nullable: false,
                        },
                        {
                            argName: "resource",
                            typeName: "string",
                            defaultValue: "branches",
                            literals: ["branches", "food"],
                        },
                        {
                            argName: "amount",
                            typeName: "int",
                            defaultValue: 0,
                        },
                    ],
                    invalidValue: false,
                    returns: {
                        typeName: "boolean",
                    },
                },
                harvest: {
                    args: [
                        {
                            argName: "spawner",
                            typeName: "gameObject",
                            gameObjectClass: Spawner,
                            nullable: false,
                        },
                    ],
                    invalidValue: false,
                    returns: {
                        typeName: "boolean",
                    },
                },
                move: {
                    args: [
                        {
                            argName: "tile",
                            typeName: "gameObject",
                            gameObjectClass: Tile,
                            nullable: false,
                        },
                    ],
                    invalidValue: false,
                    returns: {
                        typeName: "boolean",
                    },
                },
                pickup: {
                    args: [
                        {
                            argName: "tile",
                            typeName: "gameObject",
                            gameObjectClass: Tile,
                            nullable: false,
                        },
                        {
                            argName: "resource",
                            typeName: "string",
                            defaultValue: "branches",
                            literals: ["branches", "food"],
                        },
                        {
                            argName: "amount",
                            typeName: "int",
                            defaultValue: 0,
                        },
                    ],
                    invalidValue: false,
                    returns: {
                        typeName: "boolean",
                    },
                },
            },
        },
        GameObject: {
            attributes: {
                gameObjectName: {
                    typeName: "string",
                },
                id: {
                    typeName: "string",
                },
                logs: {
                    typeName: "list",
                    valueType: {
                        typeName: "string",
                    },
                },
            },
            functions: {
                log: {
                    args: [
                        {
                            argName: "message",
                            typeName: "string",
                        },
                    ],
                    returns: {
                        typeName: "void",
                    },
                },
            },
        },
        Job: {
            parentClassName: "GameObject",
            attributes: {
                actions: {
                    typeName: "int",
                },
                carryLimit: {
                    typeName: "int",
                },
                chopping: {
                    typeName: "int",
                },
                cost: {
                    typeName: "int",
                },
                damage: {
                    typeName: "int",
                },
                distractionPower: {
                    typeName: "int",
                },
                health: {
                    typeName: "int",
                },
                moves: {
                    typeName: "int",
                },
                munching: {
                    typeName: "int",
                },
                title: {
                    typeName: "string",
                },
            },
            functions: {
                recruit: {
                    args: [
                        {
                            argName: "tile",
                            typeName: "gameObject",
                            gameObjectClass: Tile,
                            nullable: false,
                        },
                    ],
                    invalidValue: undefined,
                    returns: {
                        typeName: "gameObject",
                        gameObjectClass: Beaver,
                        nullable: true,
                    },
                },
            },
        },
        Player: {
            parentClassName: "GameObject",
            attributes: {
                beavers: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Beaver,
                        nullable: false,
                    },
                },
                branchesToBuildLodge: {
                    typeName: "int",
                },
                clientType: {
                    typeName: "string",
                },
                lodges: {
                    typeName: "list",
                    valueType: {
                        typeName: "gameObject",
                        gameObjectClass: Tile,
                        nullable: false,
                    },
                },
                lost: {
                    typeName: "boolean",
                },
                name: {
                    typeName: "string",
                },
                opponent: {
                    typeName: "gameObject",
                    gameObjectClass: Player,
                    nullable: false,
                },
                reasonLost: {
                    typeName: "string",
                },
                reasonWon: {
                    typeName: "string",
                },
                timeRemaining: {
                    typeName: "float",
                },
                won: {
                    typeName: "boolean",
                },
            },
            functions: {
            },
        },
        Spawner: {
            parentClassName: "GameObject",
            attributes: {
                hasBeenHarvested: {
                    typeName: "boolean",
                },
                health: {
                    typeName: "int",
                },
                tile: {
                    typeName: "gameObject",
                    gameObjectClass: Tile,
                    nullable: false,
                },
                type: {
                    typeName: "string",
                    defaultValue: "food",
                    literals: ["food", "branches"],
                },
            },
            functions: {
            },
        },
        Tile: {
            parentClassName: "GameObject",
            attributes: {
                beaver: {
                    typeName: "gameObject",
                    gameObjectClass: Beaver,
                    nullable: true,
                },
                branches: {
                    typeName: "int",
                },
                flowDirection: {
                    typeName: "string",
                    defaultValue: "North",
                    literals: ["North", "East", "South", "West", ""],
                },
                food: {
                    typeName: "int",
                },
                lodgeOwner: {
                    typeName: "gameObject",
                    gameObjectClass: Player,
                    nullable: true,
                },
                spawner: {
                    typeName: "gameObject",
                    gameObjectClass: Spawner,
                    nullable: true,
                },
                tileEast: {
                    typeName: "gameObject",
                    gameObjectClass: Tile,
                    nullable: true,
                },
                tileNorth: {
                    typeName: "gameObject",
                    gameObjectClass: Tile,
                    nullable: true,
                },
                tileSouth: {
                    typeName: "gameObject",
                    gameObjectClass: Tile,
                    nullable: true,
                },
                tileWest: {
                    typeName: "gameObject",
                    gameObjectClass: Tile,
                    nullable: true,
                },
                type: {
                    typeName: "string",
                    defaultValue: "land",
                    literals: ["land", "water"],
                },
                x: {
                    typeName: "int",
                },
                y: {
                    typeName: "int",
                },
            },
            functions: {
            },
        },
    },
});
