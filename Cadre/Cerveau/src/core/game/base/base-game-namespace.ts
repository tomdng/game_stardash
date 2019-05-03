import { ISanitizableType } from "~/core/sanitize/sanitizable-interfaces";
import { Constructor, Immutable, TypedObject } from "~/utils";
import { BaseAI } from "./base-ai";
import { BaseGame } from "./base-game";
import { BaseGameManager } from "./base-game-manager";
import { BaseGameObjectFactory } from "./base-game-object-factory";
import { BaseGameSettingsManager } from "./base-game-settings";
import { BasePlayer } from "./base-player";

/** Namespace schema for a base game object */
export interface IBaseGameObjectSchema {
    parentClassName?: string;
    attributes: TypedObject<ISanitizableType & { defaultValue?: unknown }>;
    functions: TypedObject<IBaseGameObjectFunctionSchema>;
}

/** Namespace schema for functions that game objects can invoke */
export interface IBaseGameObjectFunctionSchema {
    args: Array<ISanitizableType & {
        argName: string;
        defaultValue?: unknown;
    }>;
    returns: ISanitizableType;
    invalidValue?: unknown;
}

/** The namespace all game index files should export */
export interface IBaseGameNamespace {
    AI: typeof BaseAI;
    Game: typeof BaseGame;
    GameManager: typeof BaseGameManager;
    GameObjectFactory: typeof BaseGameObjectFactory;
    GameSettingsManager: typeof BaseGameSettingsManager;
    Player: Constructor<BasePlayer>;

    gameName: string;
    gameObjectsSchema: {
        AI: IBaseGameObjectSchema;
        Game: IBaseGameObjectSchema;
        [gameObjectName: string]: IBaseGameObjectSchema | undefined;
    };
    gameSettingsManager: BaseGameSettingsManager;
}

/**
 * Should be invoked by all games to format their namespace correctly.
 *
 * @param namespace - The base game namespace to use. Will be mutated.
 * @returns The same game namespace ready to be used to play games with.
 */
export function makeNamespace<T extends IBaseGameNamespace>(
    namespace: Readonly<T>, // readonly as keys do not change, but their values do mutate a bit.
): Immutable<T> { // do not mutate the returned namespaces
    for (const obj of Object.values(namespace.gameObjectsSchema)) {
        if (!obj) {
            throw new Error(`unexpected non object in namespace ${namespace.gameName}`);
        }

        let depth = obj;
        while (depth.parentClassName) {
            // hook up the parent classes' attributes/functions
            const parent = namespace.gameObjectsSchema[depth.parentClassName];
            if (!parent) {
                throw new Error(`No parent for namespace ${namespace.gameName} recursively constructing!`);
            }

            Object.assign(obj.attributes, parent.attributes);
            Object.assign(obj.functions, parent.functions);
            depth = parent;
        }
    }

    return Object.freeze(namespace) as Immutable<T>;
}
