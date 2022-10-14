 ## <img src="https://www.svgrepo.com/show/323821/battleship.svg" height="100px" width="100px"> Battleship <img src="https://www.svgrepo.com/show/323821/battleship.svg" height="100px" width="100px">
 ### Live at: [here](https://velthas.github.io/battleship)
 <p>Battleship is PvE front end project built to put into practice TDD concepts and familiarize myself with <strong>Jest</strong> testing framework.</p>
 <p>Battleship is a simple board game where two players can place a set of ships on a 10x10 board, then take turns in attacking the enemy until either player's ships are all sunk.  </p>
 
 ### Testing
<p>While Jest itself is extremely intuitive to pick up and use, I must say my first approach to TDD was not the most pleasant.</p>

<p>Having to think about possible corner cases and expected behaviors initially set me back, and left the me thinking I had done nothing except slow my process: I was very wrong. </p>

<p>When I ran the tests and inevitably stumbled on some mistakes, fixing the issues was just a matter of seconds, instead of lenghty sessions in the time-hungry debugger, constantly checking every variable and condition for any typo or faulty logic.</p>

<p>Not only that, testing also promoted healthy design choices, organizing code in a way that was testable and as decoupled as possible. </p>

### Design Structure
<p>The game logic is split into many modules that all eventually converge in the 'Game' one. There, the game loop is assembled and executed. Let's take a look at the modules individually and try to understand their public interfaces.</p>

#### 1.  Ship
<p>The most important element of the game other than the board are the ships: in Battleship, they come in different lenghts, and can be placed either horizontally or vertically. This module's purpose is to build ships and service information about their status. </p>

<p>A ship takes three parameters as arguments, two of which optional. The most important are the first two, <em>size</em> and <em>orientation</em>. Size dictates the size of the ship, which can span from 1 to 5. Orientation dictates how that ship is placed on the board, either in a vertical or horizontal fashion. The third argument is merely the name of the ship.</p>

#### 2.  Board
<p>The second most essential component, the board(s) represent the table onto which we lay our ships, without which we couldn't place ships or even attack the enemy's.</p>

<p>Under the hood, my board is a multidimensional 10x10 array where each index contains a <em>Tile</em> object: a Tile is essentially a cell on the board and can service back a variety of information as well as carrying forward the game loop by receiving hits and reporting them. By default, a tile has a variable <em>hit</em> and <em>ship</em>.</p>

####  3. Player
As expected from a two player game, we needed a way to keep track of turns and enforcing that turn system, as well as allowing the partecipants to do things like placing ships randomly (in the case of CPU)

A player takes as argument true or false to signal wether they get the first turn or not, their own board, and the enemy board.
 #### 4. AI 
 As the game is currently played against the AI, the least I could do is make the computer at least a little smart. The AI module elaborates on this desire, and works to make the CPU a little more competitive.

This was the logic behind it: when the CPU gets a hit, assuming in the best case scenario it just hit the edge of a carrier (the longest ship), the other four tiles can be either up, down, left or right. We calculate the coordinates for four tiles in each direction. If we hit in a direction and we miss, given that a ship's tiles are adjacent, we can take for granted we won't find the rest of what we hit in that direction: so we try another, and another, until we find it. Once we get a hit, we continue up that direction for at most four moves.
#### 5. DomElements
This module essentially handles everything Dom Related, generating the grids to house the boards and handles the ship placement minigame in the beginning. 
#### 6. Game
The game module puts all the modules we've ran through together to form the main game loop for the game. The code itself is pretty straightforward, and just the combination of all the other functions we've described thus far.
 
### Conclusions 
My biggest takeaway from this project is the extreme importance of test driven development and its many benefits: while on the surface it may seem a significant time drain, by keeping in mind the rules set forward by Sandi Metz (https://www.youtube.com/watch?v=URSWYvyc42M&ab_channel=Confreaks) one can create better, more scalable applications that are easy to work with and understand.

While I still much to learn in the ways of software design, I am seeing improvement and know each experience and each wall I hit my head on is inevitably forcing me to improve. 
