package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.Arrays;

import static java.time.LocalDateTime.now;

@SpringBootApplication
public class SalvoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalvoApplication.class);

    }


    @Bean
    public CommandLineRunner initData(PlayerRepository repositoryPlayer, GameRepository repositoryGame, GamePlayerRepository repositoryGamePlayer, ShipRepository repositoryShip, SalvoRepository repositorySalvo, ScoreRepository repositoryScore) {
        return (args) -> {

            Player player1 = new Player("Jack Bauer");
            Player player2 = new Player("Chloe O'Brian");
            Player player3 = new Player("Kim Bauer");
            Player player4 = new Player("Tony Almeida");

            Game game1 = new Game(now());

            LocalDateTime nextTime = LocalDateTime.now().plusHours(1);
            Game game2 = new Game(nextTime);
            LocalDateTime nextTime1 = LocalDateTime.now().plusHours(2);
            Game game3 = new Game(nextTime1);
            LocalDateTime nextTime3 = LocalDateTime.now().plusHours(3);
            Game game4 = new Game(nextTime3);
            LocalDateTime nextTime4 = LocalDateTime.now().plusHours(2);
            Game game5 = new Game(nextTime4);


            Ship ship1 = new Ship(Arrays.asList("B5", "B6", "B7", "B8", "B9"), "Destroyer");
            Ship ship2 = new Ship(Arrays.asList("E1", "F1", "G1"), "Submarine");
            Ship ship3 = new Ship(Arrays.asList("H4", "H5"), "Patrol Boat");
            Ship ship4 = new Ship(Arrays.asList("C1", "D1", "E1", "F1", "G1"), "Destroyer");
            Ship ship5 = new Ship(Arrays.asList("B5", "C5", "D5"), "Submarine");



            Salvo salvo1 = new Salvo(Arrays.asList("B5", "C5", "F1"), 1);
            Salvo salvo2 = new Salvo(Arrays.asList("F2", "D5" ), 2);
            Salvo salvo3 = new Salvo(Arrays.asList("B4", "B5", "B6"), 1);
            Salvo salvo4 = new Salvo(Arrays.asList("E1", "H3", "A2"), 2);


            GamePlayer gamePlayer1 = new GamePlayer(now(), game1, player1);
            GamePlayer gamePlayer2 = new GamePlayer(now(), game1, player2);
            GamePlayer gamePlayer3 = new GamePlayer(now(), game2, player3);
            GamePlayer gamePlayer4 = new GamePlayer(now(), game2, player4);

            LocalDateTime finishTime = LocalDateTime.now().minusMinutes(30);
            LocalDateTime finishTime1 = LocalDateTime.now().minusMinutes(45);

            Score score1 = new Score(finishTime, 1.0);
            Score score2 = new Score(finishTime1,0.0);
            Score score3 = new Score(finishTime, 0.5);
            Score score4 = new Score(finishTime1,0.5);
            Score score5 = new Score(finishTime, 1.0);
            Score score6 = new Score(finishTime1,0.0);

            player1.addScore(score1);
            player2.addScore(score2);
            player1.addScore(score3);
            player2.addScore(score4);
            player1.addScore(score5);
            player2.addScore(score6);
            player3.addScore(score1);
            player4.addScore(score2);
            player1.addScore(score3);
            player2.addScore(score4);
            player3.addScore(score5);
            player4.addScore(score6);

            gamePlayer1.addShip(ship1);
            gamePlayer1.addShip(ship2);
            gamePlayer1.addShip(ship3);

            gamePlayer2.addShip(ship4);
            gamePlayer2.addShip(ship5);


            gamePlayer1.addSalvos(salvo1);
            gamePlayer1.addSalvos(salvo2);
            gamePlayer2.addSalvos(salvo3);
            gamePlayer2.addSalvos(salvo4);



            repositoryPlayer.save(player1);
            repositoryPlayer.save(player2);
            repositoryPlayer.save(player3);
            repositoryPlayer.save(player4);


            repositoryGame.save(game1);
            repositoryGame.save(game2);
            repositoryGame.save(game3);
            repositoryGame.save(game4);
            repositoryGame.save(game5);

            repositoryGamePlayer.save(gamePlayer1);
            repositoryGamePlayer.save(gamePlayer2);
            repositoryGamePlayer.save(gamePlayer3);
            repositoryGamePlayer.save(gamePlayer4);


            repositoryShip.save(ship1);
            repositoryShip.save(ship2);
            repositoryShip.save(ship3);
            repositoryShip.save(ship4);
            repositoryShip.save(ship5);


            repositorySalvo.save(salvo1);
            repositorySalvo.save(salvo2);
            repositorySalvo.save(salvo3);
            repositorySalvo.save(salvo4);


            repositoryScore.save(score1);
            repositoryScore.save(score2);
            repositoryScore.save(score3);
            repositoryScore.save(score4);
            repositoryScore.save(score5);
            repositoryScore.save(score6);

        };
    }





}