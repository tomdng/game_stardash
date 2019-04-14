# This is where you build your AI for the Stardash game.

from joueur.base_ai import BaseAI

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
from games.stardash.body import Body
from games.stardash.game import Game
from games.stardash.game_object import GameObject
from games.stardash.job import Job
from games.stardash.player import Player
from games.stardash.projectile import Projectile
from games.stardash.unit import Unit
# <<-- /Creer-Merge: imports -->>

class AI(BaseAI):
    """ The AI you add and improve code inside to play Stardash. """

    @property
    def game(self):
        """The reference to the Game instance this AI is playing.

        :rtype: games.stardash.game.Game
        """
        return self._game # don't directly touch this "private" variable pls

    @property
    def player(self):
        """The reference to the Player this AI controls in the Game.

        :rtype: games.stardash.player.Player
        """
        return self._player # don't directly touch this "private" variable pls

    def get_name(self):
        """ This is the name you send to the server so your AI will control the
            player named this string.

        Returns
            str: The name of your Player.
        """
        # <<-- Creer-Merge: get-name -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        return "TandT" # REPLACE THIS WITH YOUR TEAM NAME
        # <<-- /Creer-Merge: get-name -->>

    def start(self):
        """ This is called once the game starts and your AI knows its player and
            game. You can initialize your AI here.
        """
        # <<-- Creer-Merge: start -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your start logic

        #CHECKING INITIAL VARIABLES

        self.hasDashed = False


        self.initialPosX = self.player.units[0].x
        self.initialPosY = self.player.units[0].y
        # <<-- /Creer-Merge: start -->>

    def game_updated(self):
        """ This is called every time the game's state updates, so if you are
        tracking anything you can update it here.
        """
        # <<-- Creer-Merge: game-updated -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your game updated logic
        # <<-- /Creer-Merge: game-updated -->>

    def end(self, won, reason):
        """ This is called when the game ends, you can clean up your data and
            dump files here if need be.

        Args:
            won (bool): True means you won, False means you lost.
            reason (str): The human readable string explaining why your AI won
            or lost.
        """
        # <<-- Creer-Merge: end -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your end logic
        # <<-- /Creer-Merge: end -->>
    def run_turn(self):
        """ This is called every time it is this AI.player's turn.

        Returns:
            bool: Represents if you want to end your turn. True means end your turn, False means to keep your turn going and re-call this function.
        """
        # <<-- Creer-Merge: runTurn -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # Put your game logic here for runTurn
        for boys in self.player.units:
          if boys.job.title=="miner":
            boysPosX = boys.x
            boysPosY = boys.y

#boys.move(boys.x+10, boys.y+10)
            if boys.job.carry_limit >= (boys.genarium+boys.legendarium+boys.mythicite+boys.rarium):
              boys.dash(initialPosX, initialPosY)
              self.hasDashed=False

            else:
              minX=10000
              minY=10000
              minDistance=10000
              minGirl = None
              for girls in self.game.bodies:
                if girls.body_type == "asteroid" and girls.owner == None:
                  girlsPosX = girls.x
                  girlsPosY = girls.y
                  girlsDistance = ((girlsPosX-boysPosX)**2+(girlsPosY-boysPosY)**2)**(1/2)
                  if girlsDistance < minDistance:
                    minX=girlsPosX
                    minY=girlsPosY
                    minDistance = girlsDistance
                    minGirl = girls

              if !self.hasDashed:
                boys.dash(minX, minY)
              else:
                boys.move(minX, minY)
                boys.mine(minGirl)

        self.hasDashed = True

        return True
        # <<-- /Creer-Merge: runTurn -->>

    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you need additional functions for your AI you can add them here
    # <<-- /Creer-Merge: functions -->>
