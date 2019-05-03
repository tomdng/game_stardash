import { IBaseGameObjectRequiredData } from "~/core/game";
import { BuildingArgs, IWarehouseIgniteArgs, IWarehouseProperties } from "./";
import { Building } from "./building";
import { Player } from "./player";

// <<-- Creer-Merge: imports -->>
import { clamp } from "lodash";
import { manhattanDistance } from "~/utils";
// <<-- /Creer-Merge: imports -->>

/**
 * A typical abandoned warehouse... that anarchists hang out in and can be
 * bribed to burn down Buildings.
 */
export class Warehouse extends Building {
    /**
     * How exposed the anarchists in this warehouse are to PoliceDepartments.
     * Raises when bribed to ignite buildings, and drops each turn if not
     * bribed.
     */
    public exposure!: number;

    /**
     * The amount of fire added to buildings when bribed to ignite a building.
     * Headquarters add more fire than normal Warehouses.
     */
    public readonly fireAdded!: number;

    // <<-- Creer-Merge: attributes -->>

    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: attributes -->>

    /**
     * Called when a Warehouse is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
        args: Readonly<BuildingArgs & IWarehouseProperties & {
            // <<-- Creer-Merge: constructor-args -->>
            // You can add more constructor args in here
            // <<-- /Creer-Merge: constructor-args -->>
        }>,
        required: Readonly<IBaseGameObjectRequiredData>,
    ) {
        super(args, required);

        // <<-- Creer-Merge: constructor -->>

        this.fireAdded = 3;

        if (this.isHeadquarters) {
            this.owner.headquarters = this;
            this.health *= this.game.settings.headquartersHealthScalar;
            this.fireAdded = this.game.settings.maxFire;
        }

        // <<-- /Creer-Merge: constructor -->>
    }

    // <<-- Creer-Merge: public-functions -->>

    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.

    // <<-- /Creer-Merge: public-functions -->>

    /**
     * Invalidation function for ignite. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param building - The Building you want to light on fire.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    protected invalidateIgnite(
        player: Player,
        building: Building,
    ): void | string | IWarehouseIgniteArgs {
        // <<-- Creer-Merge: invalidate-ignite -->>

        const invalid = this.invalidateBribe(player);
        if (invalid) {
            return invalid;
        }

        if (building.isHeadquarters) {
            return `${building} Headquarters cannot be targeted by Warehouses directly.`;
        }

        // <<-- /Creer-Merge: invalidate-ignite -->>
    }

    /**
     * Bribes the Warehouse to light a Building on fire. This adds this
     * building's fireAdded to their fire, and then this building's exposure is
     * increased based on the Manhatten distance between the two buildings.
     *
     * @param player - The player that called this.
     * @param building - The Building you want to light on fire.
     * @returns The exposure added to this Building's exposure. -1 is returned
     * if there was an error.
     */
    protected async ignite(
        player: Player,
        building: Building,
    ): Promise<number> {
        // <<-- Creer-Merge: ignite -->>

        building.fire = clamp(building.fire + this.fireAdded, 0, this.game.maxFire);
        const exposure = manhattanDistance(this, building);
        this.exposure += exposure; // Do we want a cap on this?

        this.bribed = true;
        player.bribesRemaining--;

        return exposure;

        // <<-- /Creer-Merge: ignite -->>
    }

    // <<-- Creer-Merge: protected-private-functions -->>

    // Any additional protected or pirate methods can go here.

    // <<-- /Creer-Merge: protected-private-functions -->>
}
