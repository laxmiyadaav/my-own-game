class Game {
    constructor() {


        this.leadeboardTitle = createElement("h2");

        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
        this.playerMoving = false;
    }

    getState() {
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        });
    }
    update(state) {
        database.ref("/").update({
            gameState: state
        });
    }

    start() {
        player = new Player();
        playerCount = player.getCount();

        form = new Form();
        form.display();

        rocket = createSprite(width / 2 - 50, height - 100);
        rocket.addImage(" rocket", rocket_img);
        rocket.scale = 0.07;



        rocket = [rocket];


        astroid = new Group();
        star = new Group();

        // Adding fuel sprite in the game
        this.addSprites(astroid, 4, astroidImage, 0.02);

        // Adding coin sprite in the game
        this.addSprites(star, 18, starImage, 0.09);
    }

    // C38 TA
    addSprites(spriteGroup, numberOfSprites, spriteImage, scale) {
        for (var i = 0; i < numberOfSprites; i++) {
            var x, y;

            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);

            var sprite = createSprite(x, y);
            sprite.addImage("sprite", spriteImage);

            sprite.scale = scale;
            spriteGroup.add(sprite);
        }
    }

    handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("gameTitleAfterEffect");

        this.leadeboardTitle.html("Leaderboard");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 60, 40);

        this.leader1.class("leadersText");
        this.leader1.position(width / 3 - 50, 80);

        this.leader2.class("leadersText");
        this.leader2.position(width / 3 - 50, 130);
    }

    play() {
        this.handleElements();
        player.getrocketAtEnd();

        Player.getPlayersInfo();

        if (allPlayers !== undefined) {

            image(track, 0, -height * 5, width, height * 6);
            this.showLeaderboard();


            var index = 0;
            for (var plr in allPlayers) {
                index = index + 1;


                var x = allPlayers[plr].positionX;
                var y = height - allPlayers[plr].positionY;

                rocket[index - 1].position.x = x;



                if (index === player.index) {
                    stroke(10);
                    fill("red");
                    ellipse(x, y, 60, 60);

                    this.handleAstroid(index);
                    this.handleStar(index);
                    camera.position.x = rocket[index - 1].position.x;

                }
            }


            const finshLine = height * 6 - 100;

            if (player.positionY > finshLine) {
                gameState = 2;
                this.update(gameState);

                player.rank += 1;
                Player.updaterocketsAtEnd(player.rank);


                player.update();

            }
            if (keyIsDown(UP_ARROW)) {
                player.positionY += 10;
                player.update();
            }
            drawSprites();
        }
    }

    showLeaderboard() {
        var leader1, leader2;
        var players = Object.values(allPlayers);
        if (
            (players[0].rank === 0 && players[1].rank === 0) ||
            players[0].rank === 1
        ) {
            // &emsp;    This tag is used for displaying four spaces.
            leader1 =
                players[0].rank +
                "&emsp;" +
                players[0].name +
                "&emsp;" +
                players[0].score;

            leader2 =
                players[1].rank +
                "&emsp;" +
                players[1].name +
                "&emsp;" +
                players[1].score;
        }

        if (players[1].rank === 1) {
            leader1 =
                players[1].rank +
                "&emsp;" +
                players[1].name +
                "&emsp;" +
                players[1].score;

            leader2 =
                players[0].rank +
                "&emsp;" +
                players[0].name +
                "&emsp;" +
                players[0].score;
        }

        this.leader1.html(leader1);
        this.leader2.html(leader2);
    }





    handleAstroid(index) {

        rocket[index - 1].overlap(astroids, function (collector, collected) {
            player.astroids = 185;

            collected.remove();
        });
    }

    handleStar(index) {
        rockets[index - 1].overlap(star, function (collector, collected) {
            player.score + 21;
            player += 21;
            player.update();
            collected.remove();
        });
    }
}