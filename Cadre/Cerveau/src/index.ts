/** This file is the entry-point to start Cerveau */

// first code to execute, like a mini sanity test
console.log("~~~ Cerveau is starting ~~~"); // tslint:disable-line:no-console

process.title = "Cerveau Game Server";

import { setupThread } from "./core/setup-thread";
setupThread(); // We must do this before doing any aliased imports below

import { Lobby } from "./core/server";
Lobby.getInstance(); // This will create the singleton Lobby instance

import { setupWebServer } from "./web/app";
setupWebServer();
