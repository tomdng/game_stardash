// This file handles all the CLI args, parsing them, and outputting a sane obj

import { ArgumentOptions, ArgumentParser } from "argparse";
import { config } from "dotenv";
import { IWorkerGameSessionData } from "~/core/server/worker";
import { Immutable, UnknownObject, unStringify } from "~/utils";

/**
 * Set this to true while real life tournaments are on going and competitors
 * are cloning this repo. Otherwise keep on false during development so you
 * can easily move between branches and commits without it being fussy.
 */
const UPDATER_ENABLED_BY_DEFAULT = false;

// loads the config from an optional `.env` file
config();

/** The shape of config variables */
export interface IArgs {
    /** port offset for the default port values */
    PORT_OFFSET: number;

    /** the port that TCP clients should connect through */
    TCP_PORT: number;

    /** the port that the web interface should be accessed through */
    HTTP_PORT: number;

    /** the port that WebSocket clients should connect though */
    WS_PORT: number;

    /** the title of this game sever for the web interface */
    MAIN_TITLE?: string;

    /** forces clients to send a password */
    AUTH_PASSWORD?: string;

    /** run the v8 profilers against threaded game sessions */
    RUN_PROFILER: boolean;

    /** store all logged console strings to text files in LOGS_DIR */
    LOG_TO_FILES: boolean;

    /** The directory to store generated logs (e.g. gamelogs) in. */
    LOGS_DIR: string;

    /** The winston logger will not print anything to the console */
    SILENT: boolean;

    /** the base url the a remote visualizer to send clients to */
    VISUALIZER_URL: string;

    /** starts the server in arena mode, where certain functionality is changed */
    ARENA_MODE: boolean;

    /** (debugging) print IO through the TCP socket to the terminal */
    PRINT_TCP: boolean;

    /** (debugging) override for how long clients have before a timeout occurs */
    TIMEOUT_TIME: number | false;

    /** if the game settings are enabled */
    GAME_SETTINGS_ENABLED: boolean;

    /** The names of specific games to [try] to load, to speed up ts-node startup times */
    GAME_NAMES_TO_LOAD: Immutable<string[]>;

    /** should existing gamelogs be loaded from the disk to the web interface/api */
    LOAD_EXISTING_GAMELOGS: boolean;

    /** if the api is enabled */
    API_ENABLED: boolean;

    /** if the web interface is enabled */
    WEB_ENABLED: boolean;

    /** if the update checker is enabled */
    UPDATER_ENABLED: boolean;

    /** if the updater should try to auto update when updates are found */
    AUTO_UPDATE_ENABLED: boolean;

    /** if the updater will not try to auto update when updates are found */
    AUTO_UPDATE: boolean;

    /** if the game server should run in single threaded mode (easier to debug) */
    SINGLE_THREADED: boolean;

    /** The base directory to include files from */
    BASE_DIR: string;

    /** If sessions should time out, to prevent zombie processes */
    SESSION_TIMEOUTS_ENABLED: boolean;

    /** The config for worker threads, if this is a worker thread, undefined if master thread */
    WORKER_DATA?: Immutable<IWorkerGameSessionData>;
}

const parserArgs: Array<[string[], ArgumentOptions & { dest: string }]> = [
    [["--port-offset"], {action: "store", dest: "PORT_OFFSET", defaultValue: 0,
        type: "int", help: "port offset for the default port values"}],

    [["--tcp-port"], {action: "store", dest: "TCP_PORT", defaultValue: 3000,
        type: "int", help: "the port that TCP clients should connect through"}],

    [["--http-port"], {action: "store", dest: "HTTP_PORT", defaultValue: 3080,
        type: "int", help: "the port that the web interface should be accessed through"}],

    [["--ws-port"], {action: "store", dest: "WS_PORT", defaultValue: 3088,
        type: "int", help: "the port that WebSocket clients should connect though"}],

    [["--title"], {action: "store", dest: "MAIN_TITLE", defaultValue: "Cerveau",
        help: "the title of this game sever for the web interface"}],

    [["--password"], {action: "store", dest: "AUTH_PASSWORD", defaultValue: "",
        help: "forces clients to send a valid password to be able to play"}],

    [["--profile"], {action: "storeTrue", dest: "RUN_PROFILER",
        help: "run the v8 profilers against threaded game sessions"}],

    [["--log"], {action: "storeTrue", dest: "LOG_TO_FILES",
        help: "store all logged strings to text files in LOGS_DIR/console/"}],

    [["--logs-dir"], {action: "store", dest: "LOGS_DIR", defaultValue: "logs/",
        help: "The directory to store generated logs (e.g. gamelogs) in."}],

    [["--silent"], {action: "storeTrue", dest: "SILENT",
        help: "log will not print anything to the console"}],

    [["--single-threaded"], {action: "storeTrue", dest: "SINGLE_THREADED",
        help: "If game sessions should be ran on the master thread, for easier debugging of game logic"}],

    [["--only-load"], {nargs: "+", dest: "GAME_NAMES_TO_LOAD",
        help: "The names of specific games to [try] to load, to speed up ts-node startup times"}],

    [["--visualizer-url"], {action: "store", dest: "VISUALIZER_URL",
        help: "the base url the a remote visualizer to send clients to",
        // tslint:disable-next-line:no-http-string - because it has to be
        defaultValue: "http://vis.siggame.io/"}],

    [["--arena"], {action: "storeTrue", dest: "ARENA_MODE",
        help: "starts the server in arena mode, where certain functionality is changed", defaultValue: false}],

    [["--print-tcp"], {action: "storeTrue", dest: "PRINT_TCP",
        help: "(debugging) print IO through the TCP socket to the terminal", defaultValue: false}],

    [["--timeout"], {action: "store", dest: "TIMEOUT_TIME",
        help: "(debugging) override for how long clients have before a timeout occurs", defaultValue: true}],

    [["--no-timeout"], {action: "storeFalse", dest: "TIMEOUT_TIME",
        help: "(debugging) clients cannot time out"}],

    [["--no-game-settings"], {action: "storeFalse", dest: "GAME_SETTINGS_ENABLED",
        help: "ignores any requested game settings from clients", defaultValue: true}],

    [["--no-load-gamelogs"], {action: "storeFalse", dest: "LOAD_EXISTING_GAMELOGS",
        help: "gamelogs are not loaded to get the status or view in the web interface", defaultValue: true}],

    [["--no-session-timeouts"], {action: "storeFalse", dest: "SESSION_TIMEOUTS_ENABLED",
        help: "disables sessions timing out, most useful for debugging", defaultValue: true}],

    [["--no-api"], {action: "storeFalse", dest: "API_ENABLED",
        help: "does not run the hooks for the REST API service", defaultValue: true}],

    [["--no-web"], {action: "storeFalse", dest: "WEB_ENABLED",
        help: "does not run the web interface", defaultValue: true}],

    [["--no-updater"], {action: "storeFalse", dest: "UPDATER_ENABLED",
        help: "does not run the update checker", defaultValue: UPDATER_ENABLED_BY_DEFAULT}],

    [["--no-auto-update"], {action: "storeFalse", dest: "AUTO_UPDATE_ENABLED", defaultValue: true,
        help: "the updater will not try to autoUpdate when updates are found"}],
];

const parserArgByDest = new Map<string, ArgumentOptions>();
for (const [, arg] of parserArgs) {
    parserArgByDest.set(arg.dest, arg);
}

const parser = new ArgumentParser({
    addHelp: true,
    description: "Runs the game server with various options for play",
});

const defaults: UnknownObject = {};
for (const [names, options] of parserArgs) {
    parser.addArgument(names, options);
    defaults[options.dest] = options.defaultValue as unknown;
}

// first two args are `node main.js`, with the full path to each
const parsedArgs = parser.parseArgs(process.argv.slice(2)) as UnknownObject;
// tslint:disable-next-line:no-any
const args: IArgs = {} as any; // we will set it so that it becomes a valid
                               // IArgs in the next loop

for (const key of Object.keys(parsedArgs)) {
    const envValue = process.env[key];
    const commandLineValue = parsedArgs[key];

    // if the command line value is the default value, and an env value was set
    // use the env value, otherwise use the command line value which will be the
    // default/cli value
    let value = commandLineValue === defaults[key] && envValue
        ? unStringify(envValue)
        : commandLineValue;

    if (value === null) {
        // We want undefined to be correct for ? types.
        value = undefined;
    }

    const arg = parserArgByDest.get(key);
    if (arg && arg.nargs && !Array.isArray(value)) { // It is not an array, but should be (probably string from dotenv)
        value = value === undefined
            ? []
            : String(value)
                .split(",") // Split on commas to create an array
                .map((str) => str.trim()); // And trim each string of whitespace
    }

    // tslint:disable-next-line:no-any no-unsafe-any - have to set for IArgs
    (args as any)[key] = value;
}

// not exposed because this is an easy thing to fuck up everything else with if you change it
args.BASE_DIR = args.BASE_DIR || __dirname;

if (process.env.WORKER_GAME_SESSION_DATA) {
    // hackish, but let's assume if the data is set it is in the correct format.
    // tslint:disable-next-line:no-unsafe-any
    args.WORKER_DATA = JSON.parse(process.env.WORKER_GAME_SESSION_DATA);
}

if (args.RUN_PROFILER) {
    try {
        // tslint:disable-next-line:no-var-requires no-require-imports
        if (!require("v8-profiler")) {
            throw new Error(
// tslint:disable-next-line:no-multiline-string
`ERROR: Module 'v8-profiler' not found and is needed for profiling.
Please use 'npm install v8-profiler'.
NOTE: This will require node-gyp to compile its C++ addons.`,
            );
        }
    }
    catch (err) {
        // tslint:disable-next-line no-console
        console.error(err);
        process.exit(1);
    }
}

if (args.ARENA_MODE) {
    args.LOG_TO_FILES = true;
    args.GAME_SETTINGS_ENABLED = false;
    args.WEB_ENABLED = false;
    args.LOAD_EXISTING_GAMELOGS = false;
    args.UPDATER_ENABLED = false;
    args.AUTO_UPDATE = false;
}

if (!isNaN(args.PORT_OFFSET)) {
    args.TCP_PORT += args.PORT_OFFSET;
    args.HTTP_PORT += args.PORT_OFFSET;
    args.WS_PORT += args.PORT_OFFSET;
}

/** The current config as set from CLI and the .env file. */
export const Config = Object.freeze(args);
