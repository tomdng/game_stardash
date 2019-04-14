# Game: The traditional 8x8 chess board with pieces.

# DO NOT MODIFY THIS FILE
# Never try to directly create an instance of this class, or modify its member variables.
# Instead, you should only be reading its variables and calling its functions.

from joueur.base_game import BaseGame

# import game objects
from games.chess.game_object import GameObject
from games.chess.player import Player

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class Game(BaseGame):
    """The class representing the Game in the Chess game.

    The traditional 8x8 chess board with pieces.
    """

    def __init__(self):
        """Initializes a Game with basic logic as provided by the Creer code generator."""
        BaseGame.__init__(self)

        # private attributes to hold the properties so they appear read only
        self._fen = ""
        self._game_objects = {}
        self._history = []
        self._players = []
        self._session = ""

        self.name = "Chess"

        self._game_object_classes = {
            'GameObject': GameObject,
            'Player': Player
        }

    @property
    def fen(self):
        """Forsyth-Edwards Notation (fen), a notation that describes the game board state.

        :rtype: str
        """
        return self._fen

    @property
    def game_objects(self):
        """A mapping of every game object's ID to the actual game object. Primarily used by the server and client to easily refer to the game objects via ID.

        :rtype: dict[str, games.chess.game_object.GameObject]
        """
        return self._game_objects

    @property
    def history(self):
        """The list of [known] moves that have occured in the game, in Standard Algebriac Notation (SAN) format. The first element is the first move, with the last being the most recent.

        :rtype: list[str]
        """
        return self._history

    @property
    def players(self):
        """List of all the players in the game.

        :rtype: list[games.chess.player.Player]
        """
        return self._players

    @property
    def session(self):
        """A unique identifier for the game instance that is being played.

        :rtype: str
        """
        return self._session

    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you want to add any client side logic (such as state checking functions) this is where you can add them
    # <<-- /Creer-Merge: functions -->>
