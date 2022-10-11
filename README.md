 ## <img src="https://www.svgrepo.com/show/323821/battleship.svg" height="100px" width="100px"> Battleship <img src="https://www.svgrepo.com/show/323821/battleship.svg" height="100px" width="100px">
 ### Live at: [here](https://velthas.github.io/battleship)
 <p>Battleship is PvE front end project built to put into practice TDD concepts and familiarize myself with <strong>Jest</strong> testing framework.</p>
 <p>Battleship is a simple board game where two players can place a set of ships on a 10x10 board, then take turns in attacking the enemy until either player's ships are all sunk.  </p>
 
 ### Testing
While Jest itself is extremely intuitive to pick up and use, I must say my first approach to TDD was not the most pleasant.

Having to think about possible corner cases and expected behaviors initially set me back, and left the me thinking I had done nothing except slow my process: I was very wrong. 

When I ran the tests and inevitably stumbled on some mistakes, fixing the issues was just a matter of seconds, instead of lenghty sessions in the time-hungry debugger, constantly checking every variable and condition for any typo or faulty logic.

Not only that, testing also promoted healthy design choices, organizing code in a way that was testable and as decoupled as possible. I wouldn't want to bore you, but testing is definitely something I won't let go of so easily.

### Design Structure
The game logic is split into many modules that all eventually converge in the 'Game' one. There, the game loop is assembled and executed. Let's take a look at the modules individually and try to understand their public interfaces.
#### 1.  Ship
The most important element of the game other than the board are the ships: in Battleship, they come in different lenghts, and can be placed either horizontally or vertically. This module's purpose is to build ships and service information about their status. 

A ship takes three parameters as arguments. The most important are the first two, *size* and *orientation*. Size dictates the size of the ship, which can span from 1 to 5. Orientation dictates how that ship is placed on the board, either in a vertical or horizontal fashion. The third argument, which is optional, is merely the name of the ship. Here are a ship's methods:

 1. **hit**: a ship is made up of n positions, where n is the size of the ship. Hit takes as argument a number from 1 to N, which dictates which 'tile' of the ship is hit. When a ship takes a hit, the position is registered on the private hitPositions array.
 2. **isSunk**: this method takes no argument, just looks at the length of the hitPositions array and returns wether or not it matches with the length of the ship. When a ship has been hit as many times as it is long, it means it's sunk, thus true is returned, otherwise false.
 3. **getOffsets**: to make the game work, each ship has to be placed on a given position and as its size increases, it will span over several neighboring cells other than the selected one. This is why I use predetermined offsets based on ship size to determine which tiles will be occupied by the ship when a position is chosen. getOffsets merely fetches an array of offsets I.E. [ [0, -1], [0, 0] ] for the given ship's orientation and size.
 4. **getName**: this function simply returns the name of the ship in string format if it has been assigned, otherwise an empty string.
 
#### 2.  Board
The second most essential component, the board(s) represent the table onto which we lay our ships, without which we couldn't place ships or even attack the enemy's.

Under the hood, my board is a multidimensional 10x10 array where each index contains a **Tile** object: a Tile is essentially a cell on the board and can service back a variety of information as well as carrying forward the game loop by receiving hits and reporting them. By default, a tile has a variable *hit* and *ship*. Here are the methods:

 1. **isHit**: this method simply returns the value of the *hit* variable. The hit variable is a boolean value, true if the tile has been hit, false if not. But how do we set this...?
 2. **setShip**: when part of a ship is to be placed on a tile, we store its information inside the *ship* variable.
 3. **setHit**: when this method is called on a tile, the hit variable is set to true, effectively marking it as hit. If *ship* is not false however, meaning part of a ship is laying on that tile, we call the hit() method on it  so that a ship knows that position has been hit.
 4. **hasShip**: if you want to know if a tile has a ship or not, simply call this method and it will return a boolean value.
 5. **getShip**: this method gives you a reference to the ship object, if there is no ship it will simply return nothing. As of the moment of writing, the object returned is a shallow copy, so this has to be replaced with a deep copy in future updates.
 
 Having understood what a Tile does, we can now look at the public interface of the **Board** itself:
 
 1. **isPositionLegal:** takes as an argument the position where the ship is to be placed, and the offsets of the ship to place. What it does is check that the boat doesn't fall of the board and that there isn't any more ships on the tile it is meant to occupy by using a filter function on the offset array. If the 'legalMoves' array that is produced has the same length of the offset array, it means all positions passed the safety check and ship can be placed.
 2. **placeShip:** takes a Ship and coordinate as argument. After verifying the position is ok for the ship we are trying to place, it goes ahead and set the ship on the appropriate tiles using the Tile.setShip method. Whenever a ship is placed succesfully, said ship is also stored in the ships array.
 3. **receiveAttack:** uses the Tile.setHit method to mark a position as hit on the board, and then takes the position off the unplayedTiles array. For reference, the unplayedTiles array contains the index of all the tiles that have not been hit.
 4. **getBoard:** this method returns a reference to the board, so that individual tiles can be checked by using coordinates (y and x). At the moment, the copy returned is shallow, which is, admittedly, a bad choice. Before committing to this I thought of using lodash's deepClone, and even the structuredClone API, but the first felt like an unearned workaround and the second was not recognized by Jest, which meant having test suites that did not pass. For the time being, given the nature of the project, it is fine the way it is. I will eventually come back and make this function return a deep copy of the board only. 
 5. **allShipsSunk:** checks the ships array and verifies which ones are sunk. If they all are, returns true, otherwise false.
 6. **getUnplayedTiles:** this function returns a deep copy of an array containing the number of tiles that have not yet been hit (1-100). This way, when making a random move, the computer needs not conjure random numbers until a non-hit tile is found: it can get one directly by getting a random number calculated off the length of the array.
 7. **markTileAsPlayed**: when a tile is played, we remove it from the unplayedTiles array using this method. 
 
####  3. Player
As expected from a two player game, we needed a way to keep track of turns and enforcing that turn system, as well as allowing the partecipants to do things like placing ships both randomly (for CPU) and intentionally (for Players) and play their moves. 

A player takes as argument a number to signal wether they get the first turn or not, their own board, and the enemy board. Let's have a look at what a player can do:

 1. **playTurn:** given a coordinate, allows you to play a move against the enemy board. If the position isn't legal, or it has been played, the turn is not played.
 2. **playRandomMove:** this move is for CPUs. Initially, it literally did what the name implied: picked an unplayed tile on the enemy board, and just ran with it. As of now, it has been updated to make more sensible moves making use of the **AI** module. Basically, if we didn't get a hit then we just proceed randomly, otherwise there is a strict tile selection we must run through before we can proceed.
 3. **createUserShips:** this function creates ships for the user in accordance to my current requirements ( 1 Carrier, 1 Battleship, 1 Submarine, 1 Destroyer, 1 Patroller) in both horizontal and vertical fashion, then returns an array with them. The user can then decide which to place by going through the ship placement minigame on game startup.
 4. **placeShipsRandomly:** CPUs can't really place ships like users would, so we do it for them by creating a set of 5 random ships, and then placing them on the board in random positions until all of them are placed.
 5. **turnOver:** use this function to set the turn to false, meaning it is no longer the given player's turn.
 6. **isTurn:** when opponent's turn is over, you can use this to give the given player back their turn.
 #### 4. AI 
 As the game is currently played against the AI, the least I could do is make the computer at least a little smart. The AI module elaborates on this desire, and works to make the CPU a little more competitive.

This was the logic behind it: when the CPU gets a hit, assuming in the best case scenario it just hit the edge of a carrier (the longest ship), the other four tiles can be either up, down, left or right. We calculate the coordinates for four tiles in each direction. If we hit in a direction and we miss, given that a ship's tiles are adjacent, we can take for granted we won't find the rest of what we hit in that direction: so we try another, and another, until we find it. Once we get a hit, we continue up that direction for at most four moves.

The AI is implemented through these methods:

 1.  **initialize**: when the AI is initialized, we calculate the positions that could be potential hits from the coordinate of our first hit. We then add those moves to the movesToPlay array. 
 2.**hasMovesToPlay:** this function returns true or false depending on if the array has anything left in it or not. If there is, it overrides 'playRandomMove' usual behavior and plays the next smart move.
 2. **getMove:** this function handles the move selection part of our AI. It selects the next move that is due, if it is a hit, it makes it so the direction keeps getting hit, otherwise we just switch to the next direction and try again.
#### 5. DomElements
This module essentially handles everything Dom Related, generating the grids to house the boards and handles the ship placement minigame in the beginning. This is definitely more on the dom manipulation side of things, so I think no further clarifications are needed.
#### 6. Game
The game module puts all the modules we've ran through together to form the main game loop for the name. The code itself is pretty straightforward, and just the combination of all the other functions we've described thus far.
 
### Conclusions 
My biggest takeaway from this project is the extreme importance of test driven development and its many benefits: while on the surface it may seem a significant time drain, by keeping in mind the rules set forward by Sandi Metz (https://www.youtube.com/watch?v=URSWYvyc42M&ab_channel=Confreaks) one can create better, more scalable applications that are easy to work with and understand.

While I still much to learn in the ways of software design, I am seeing improvement and know each experience and each wall I hit my head on is inevitably forcing me to improve. 
