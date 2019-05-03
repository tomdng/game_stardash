# Unit: A unit group in the game. This may consist of a ship and any number of crew.

# DO NOT MODIFY THIS FILE
# Never try to directly create an instance of this class, or modify its member variables.
# Instead, you should only be reading its variables and calling its functions.

from games.pirates.game_object import GameObject

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class Unit(GameObject):
    """The class representing the Unit in the Pirates game.

    A unit group in the game. This may consist of a ship and any number of crew.
    """

    def __init__(self):
        """Initializes a Unit with basic logic as provided by the Creer code generator."""
        GameObject.__init__(self)

        # private attributes to hold the properties so they appear read only
        self._acted = False
        self._crew = 0
        self._crew_health = 0
        self._gold = 0
        self._moves = 0
        self._owner = None
        self._path = []
        self._ship_health = 0
        self._stun_turns = 0
        self._target_port = None
        self._tile = None

    @property
    def acted(self):
        """Whether this Unit has performed its action this turn.

        :rtype: bool
        """
        return self._acted

    @property
    def crew(self):
        """How many crew are on this Tile. This number will always be <= crewHealth.

        :rtype: int
        """
        return self._crew

    @property
    def crew_health(self):
        """How much total health the crew on this Tile have.

        :rtype: int
        """
        return self._crew_health

    @property
    def gold(self):
        """How much gold this Unit is carrying.

        :rtype: int
        """
        return self._gold

    @property
    def moves(self):
        """How many more times this Unit may move this turn.

        :rtype: int
        """
        return self._moves

    @property
    def owner(self):
        """The Player that owns and can control this Unit, or None if the Unit is neutral.

        :rtype: games.pirates.player.Player
        """
        return self._owner

    @property
    def path(self):
        """(Merchants only) The path this Unit will follow. The first element is the Tile this Unit will move to next.

        :rtype: list[games.pirates.tile.Tile]
        """
        return self._path

    @property
    def ship_health(self):
        """If a ship is on this Tile, how much health it has remaining. 0 for no ship.

        :rtype: int
        """
        return self._ship_health

    @property
    def stun_turns(self):
        """(Merchants only) The number of turns this merchant ship won't be able to move. They will still attack. Merchant ships are stunned when they're attacked.

        :rtype: int
        """
        return self._stun_turns

    @property
    def target_port(self):
        """(Merchants only) The Port this Unit is moving to.

        :rtype: games.pirates.port.Port
        """
        return self._target_port

    @property
    def tile(self):
        """The Tile this Unit is on.

        :rtype: games.pirates.tile.Tile
        """
        return self._tile

    def attack(self, tile, target):
        """ Attacks either the 'crew' or 'ship' on a Tile in range.

        Args:
            tile (games.pirates.tile.Tile): The Tile to attack.
            target (str): Whether to attack 'crew' or 'ship'. Crew deal damage to crew and ships deal damage to ships. Consumes any remaining moves.

        Returns:
            bool: True if successfully attacked, False otherwise.
        """
        return self._run_on_server('attack', tile=tile, target=target)

    def bury(self, amount):
        """ Buries gold on this Unit's Tile. Gold must be a certain distance away for it to get interest (Game.minInterestDistance).

        Args:
            amount (int): How much gold this Unit should bury. Amounts <= 0 will bury as much as possible.

        Returns:
            bool: True if successfully buried, False otherwise.
        """
        return self._run_on_server('bury', amount=amount)

    def deposit(self, amount=0):
        """ Puts gold into an adjacent Port. If that Port is the Player's port, the gold is added to that Player. If that Port is owned by merchants, it adds to that Port's investment.

        Args:
            amount (Optional[int]): The amount of gold to deposit. Amounts <= 0 will deposit all the gold on this Unit.

        Returns:
            bool: True if successfully deposited, False otherwise.
        """
        return self._run_on_server('deposit', amount=amount)

    def dig(self, amount=0):
        """ Digs up gold on this Unit's Tile.

        Args:
            amount (Optional[int]): How much gold this Unit should take. Amounts <= 0 will dig up as much as possible.

        Returns:
            bool: True if successfully dug up, False otherwise.
        """
        return self._run_on_server('dig', amount=amount)

    def move(self, tile):
        """ Moves this Unit from its current Tile to an adjacent Tile. If this Unit merges with another one, the other Unit will be destroyed and its tile will be set to None. Make sure to check that your Unit's tile is not None before doing things with it.

        Args:
            tile (games.pirates.tile.Tile): The Tile this Unit should move to.

        Returns:
            bool: True if it moved, False otherwise.
        """
        return self._run_on_server('move', tile=tile)

    def rest(self):
        """ Regenerates this Unit's health. Must be used in range of a port.

        Returns:
            bool: True if successfully rested, False otherwise.
        """
        return self._run_on_server('rest')

    def split(self, tile, amount=1, gold=0):
        """ Moves a number of crew from this Unit to the given Tile. This will consume a move from those crew.

        Args:
            tile (games.pirates.tile.Tile): The Tile to move the crew to.
            amount (Optional[int]): The number of crew to move onto that Tile. Amount <= 0 will move all the crew to that Tile.
            gold (Optional[int]): The amount of gold the crew should take with them. Gold < 0 will move all the gold to that Tile.

        Returns:
            bool: True if successfully split, False otherwise.
        """
        return self._run_on_server('split', tile=tile, amount=amount, gold=gold)

    def withdraw(self, amount=0):
        """ Takes gold from the Player. You can only withdraw from your own Port.

        Args:
            amount (Optional[int]): The amount of gold to withdraw. Amounts <= 0 will withdraw everything.

        Returns:
            bool: True if successfully withdrawn, False otherwise.
        """
        return self._run_on_server('withdraw', amount=amount)



    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you want to add any client side logic (such as state checking functions) this is where you can add them
    # <<-- /Creer-Merge: functions -->>
