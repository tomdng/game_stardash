# Warehouse: A typical abandoned warehouse... that anarchists hang out in and can be bribed to burn down Buildings.

# DO NOT MODIFY THIS FILE
# Never try to directly create an instance of this class, or modify its member variables.
# Instead, you should only be reading its variables and calling its functions.

from games.anarchy.building import Building

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class Warehouse(Building):
    """The class representing the Warehouse in the Anarchy game.

    A typical abandoned warehouse... that anarchists hang out in and can be bribed to burn down Buildings.
    """

    def __init__(self):
        """Initializes a Warehouse with basic logic as provided by the Creer code generator."""
        Building.__init__(self)

        # private attributes to hold the properties so they appear read only
        self._exposure = 0
        self._fire_added = 0

    @property
    def exposure(self):
        """How exposed the anarchists in this warehouse are to PoliceDepartments. Raises when bribed to ignite buildings, and drops each turn if not bribed.

        :rtype: int
        """
        return self._exposure

    @property
    def fire_added(self):
        """The amount of fire added to buildings when bribed to ignite a building. Headquarters add more fire than normal Warehouses.

        :rtype: int
        """
        return self._fire_added

    def ignite(self, building):
        """ Bribes the Warehouse to light a Building on fire. This adds this building's fireAdded to their fire, and then this building's exposure is increased based on the Manhatten distance between the two buildings.

        Args:
            building (games.anarchy.building.Building): The Building you want to light on fire.

        Returns:
            int: The exposure added to this Building's exposure. -1 is returned if there was an error.
        """
        return self._run_on_server('ignite', building=building)

    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you want to add any client side logic (such as state checking functions) this is where you can add them
    # <<-- /Creer-Merge: functions -->>
