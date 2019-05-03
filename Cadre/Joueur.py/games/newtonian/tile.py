# Tile: A Tile in the game that makes up the 2D map grid.

# DO NOT MODIFY THIS FILE
# Never try to directly create an instance of this class, or modify its member variables.
# Instead, you should only be reading its variables and calling its functions.

from games.newtonian.game_object import GameObject

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class Tile(GameObject):
    """The class representing the Tile in the Newtonian game.

    A Tile in the game that makes up the 2D map grid.
    """

    def __init__(self):
        """Initializes a Tile with basic logic as provided by the Creer code generator."""
        GameObject.__init__(self)

        # private attributes to hold the properties so they appear read only
        self._blueium = 0
        self._blueium_ore = 0
        self._decoration = 0
        self._direction = ""
        self._is_wall = False
        self._machine = None
        self._owner = None
        self._redium = 0
        self._redium_ore = 0
        self._tile_east = None
        self._tile_north = None
        self._tile_south = None
        self._tile_west = None
        self._type = ""
        self._unit = None
        self._x = 0
        self._y = 0

    @property
    def blueium(self):
        """The amount of blueium on this tile.

        :rtype: int
        """
        return self._blueium

    @property
    def blueium_ore(self):
        """The amount of blueium ore on this tile.

        :rtype: int
        """
        return self._blueium_ore

    @property
    def decoration(self):
        """(Visualizer only) Different tile types, cracked, slightly dirty, etc. This has no effect on gameplay, but feel free to use it if you want.

        :rtype: int
        """
        return self._decoration

    @property
    def direction(self):
        """The direction of a conveyor belt ('blank', 'north', 'east', 'south', or 'west'). blank means conveyor doesn't move.

        :rtype: str
        """
        return self._direction

    @property
    def is_wall(self):
        """Whether or not the tile is a wall.

        :rtype: bool
        """
        return self._is_wall

    @property
    def machine(self):
        """The Machine on this Tile if present, otherwise None.

        :rtype: games.newtonian.machine.Machine
        """
        return self._machine

    @property
    def owner(self):
        """The owner of this Tile, or None if owned by no-one. Only for generators and spawn areas.

        :rtype: games.newtonian.player.Player
        """
        return self._owner

    @property
    def redium(self):
        """The amount of redium on this tile.

        :rtype: int
        """
        return self._redium

    @property
    def redium_ore(self):
        """The amount of redium ore on this tile.

        :rtype: int
        """
        return self._redium_ore

    @property
    def tile_east(self):
        """The Tile to the 'East' of this one (x+1, y). None if out of bounds of the map.

        :rtype: games.newtonian.tile.Tile
        """
        return self._tile_east

    @property
    def tile_north(self):
        """The Tile to the 'North' of this one (x, y-1). None if out of bounds of the map.

        :rtype: games.newtonian.tile.Tile
        """
        return self._tile_north

    @property
    def tile_south(self):
        """The Tile to the 'South' of this one (x, y+1). None if out of bounds of the map.

        :rtype: games.newtonian.tile.Tile
        """
        return self._tile_south

    @property
    def tile_west(self):
        """The Tile to the 'West' of this one (x-1, y). None if out of bounds of the map.

        :rtype: games.newtonian.tile.Tile
        """
        return self._tile_west

    @property
    def type(self):
        """The type of Tile this is ('normal', 'generator', 'conveyor', or 'spawn').

        :rtype: str
        """
        return self._type

    @property
    def unit(self):
        """The Unit on this Tile if present, otherwise None.

        :rtype: games.newtonian.unit.Unit
        """
        return self._unit

    @property
    def x(self):
        """The x (horizontal) position of this Tile.

        :rtype: int
        """
        return self._x

    @property
    def y(self):
        """The y (vertical) position of this Tile.

        :rtype: int
        """
        return self._y


    directions = ["North", "East", "South", "West"]
    """int: The valid directions that tiles can be in, "North", "East", "South", or "West"
    """

    def get_neighbors(self):
        """Gets the neighbors of this Tile

        :rtype list[games.newtonian.tile.Tile]
        """
        neighbors = []

        for direction in Tile.directions:
            neighbor = getattr(self, "tile_" + direction.lower())
            if neighbor:
                neighbors.append(neighbor)

        return neighbors

    def is_pathable(self):
        """Checks if a Tile is pathable to units

        Returns:
            bool: True if pathable, False otherwise
        """
        # <<-- Creer-Merge: is_pathable_builtin -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        return false  # DEVELOPER ADD LOGIC HERE
        # <<-- /Creer-Merge: is_pathable_builtin -->>

    def has_neighbor(self, tile):
        """Checks if this Tile has a specific neighboring Tile
        Args:
            tile (games.newtonian.tile.Tile): tile to check against
        Returns:
            bool: True if the tile is a neighbor of this Tile, False otherwise
        """
        return bool(tile and tile in self.get_neighbors())

    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you want to add any client side logic (such as state checking functions) this is where you can add them
    # <<-- /Creer-Merge: functions -->>
