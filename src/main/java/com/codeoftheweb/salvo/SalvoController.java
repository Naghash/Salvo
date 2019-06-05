package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.*;

import static java.util.stream.Collectors.toList;

@RestController()
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository repositoryGame;
    @Autowired
    private GamePlayerRepository repositoryGamePlayer;
    @Autowired
    private ShipRepository repositoryShip;
    @Autowired
    private PlayerRepository repositoryPlayer;

    @RequestMapping("/games")
    public Map<String, Object> getAuth(Authentication authentication) {
        return new LinkedHashMap<String, Object>(){{
            put("logged_player", isGuest(authentication)? null : repositoryPlayer
                    .findByUserName(
                            authentication
                                    .getName()));
            put("games", getGame());

        }};

    }

    public List<Object> getGame() {
        return repositoryGame
                .findAll()
                .stream()
                .map(game ->
                        new LinkedHashMap<String, Object>() {{
                            put("id", game.getId());
                            put("created", game.getCreationDate());
                            put("gameplayers", game.getGamePlayers().stream()
                                    .map(gp -> gp.toDTO()).collect(toList()));
                        }}
                ).collect(toList());

    }
    private boolean isGuest(Authentication authentication) {
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }


    @RequestMapping("/game_view/{gamePlayerId}")

    private ResponseEntity<Map<String, Object>> makeDTO( @PathVariable Long gamePlayerId, Authentication authentication) {
        Optional<GamePlayer> gameP = repositoryGamePlayer.findById(gamePlayerId);
        if (gameP.isPresent() && authentication.getName() != null) {
            System.out.println("hey1");
            long playerID = gameP.get().getPlayer().getId();
            long userID = repositoryPlayer.findByUserName(authentication.getName()).getId();
            if (playerID == userID) {
                System.out.println("hey2");
                return new ResponseEntity<>(repositoryGamePlayer.findById(gamePlayerId)
                        .map(gamePlayer -> gamePlayer.getGame())
                        .map(game ->
                                new LinkedHashMap<String, Object>() {{
                                    put("id", game.getId());
                                    put("created", game.getCreationDate());
                                    put("gameplayer", game.getGamePlayers()
                                            .stream()
                                            .filter(gp -> gp.getId() == gamePlayerId)
                                            .findFirst()
                                            .map(gp -> gp.toDTO())
                                            .orElse(null));
                                    put("oponent", game.getGamePlayers()
                                            .stream()
                                            .filter(gp -> gp.getId() != gamePlayerId)
                                            .findFirst()
                                            .map(gp ->
                                                    new LinkedHashMap<String, Object>() {{
                                                    put("id", gp.getId());
                                                    put("player", gp.getPlayer().toDTO1());
                                                    put("salvos", gp.getSalvos());
                                                    }})
                                            .orElse(null)) ;

                                }}).orElse(null), HttpStatus.OK);
            } else {
                System.out.println("hey3");
                return new ResponseEntity<>( new LinkedHashMap<String, Object>() {{
                            put("message", "You are not authorized");
                        }}, HttpStatus.FORBIDDEN);
            }
        } else {
            System.out.println("4");
            return new ResponseEntity<>( new LinkedHashMap<String, Object>() {{
            put("message", "You are not authorized");
        }},HttpStatus.UNAUTHORIZED);

        }
    }



    @RequestMapping("/players")
    private  List<Object> makeDTO2 (){

       return repositoryPlayer.findAll()

                .stream()
                .map(player -> player.toDTO1())
                .collect(toList());


    }



    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Object> register(
            @RequestParam String userName, @RequestParam String password) {

        if (userName.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>("Missing data", HttpStatus.FORBIDDEN);
        }

        if (repositoryPlayer.findByUserName(userName) !=  null) {
            return new ResponseEntity<>("Name already in use", HttpStatus.FORBIDDEN);
        }

        repositoryPlayer.save(new Player(userName, password));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity <Map<String, Object>> createGame(Authentication authentication){

            if (authentication != null) {
                Player player4 = repositoryPlayer.findByUserName(authentication.getName());

                if (player4 != null) {
                    Map<String, Object> newGame = new LinkedHashMap<>();
                    Game game1 = new Game(LocalDateTime.now());
                    GamePlayer gamePlayer = new GamePlayer(LocalDateTime.now(), game1, player4);
                    repositoryGame.save(game1);
                    repositoryGamePlayer.save(gamePlayer);

                    newGame.put("gpId", gamePlayer.getId());
                    newGame.put("gplayer", gamePlayer.getPlayer());
                    newGame.put("gpgame", gamePlayer.getGame());


                    return new ResponseEntity<>(newGame, HttpStatus.CREATED);

                } else {
                    return new ResponseEntity<>(new LinkedHashMap<String, Object>(){{
                        put("error", "Log in!");
                    }} , HttpStatus.UNAUTHORIZED);
                }

            } else {
                return new ResponseEntity<>(new LinkedHashMap<String, Object>(){{
                    put("error", "Log in!");
                }} , HttpStatus.UNAUTHORIZED);
            }
        }

    @RequestMapping(path = "/games/{gameId}/players", method = RequestMethod.POST)
    public ResponseEntity <Map<String, Object>> joinGame( @PathVariable Long gameId, Authentication authentication){

        Optional<Game> game1 = repositoryGame.findById(gameId);

        if (authentication == null) {
            System.out.println("its ok 1");
            return new ResponseEntity<>(new LinkedHashMap<String, Object>(){{
                put("error", "Log in!");
            }} , HttpStatus.FORBIDDEN);
        }
        if (!game1.isPresent()) {
            System.out.println("its ok 2");
            return new ResponseEntity<>(new LinkedHashMap<String, Object>(){{
                put("error", "Game does not exist!");
            }} , HttpStatus.FORBIDDEN);
        }

       if (game1.get().getGamePlayers().size()!=1) {
           return new ResponseEntity<>(new LinkedHashMap<String, Object>() {{
               System.out.println("the size");

               put("error", "The size isnt 1!");
           }}, HttpStatus.FORBIDDEN);
       }

                Map<String, Object> joinedPlayer = new LinkedHashMap<>();

                Player  player = repositoryPlayer.findByUserName(authentication.getName());
                GamePlayer gamePlayer = new GamePlayer(LocalDateTime.now(), game1.get(), player);
                repositoryGamePlayer.save(gamePlayer);

                joinedPlayer.put("game", gamePlayer.getGame());
                joinedPlayer.put("gpId", gamePlayer.getId());

        System.out.println("here we go");
        System.out.println(gamePlayer.getGame().getId());
                return new ResponseEntity<>(joinedPlayer, HttpStatus.CREATED);

            }


    @RequestMapping(path = "/games/players/{gpId}/ships", method = RequestMethod.POST)
    public ResponseEntity <Map<String, Object>> addShips( @PathVariable Long gpId, @RequestBody List <Ship> ships, Authentication authentication){

        Optional<GamePlayer> gamePlayer = repositoryGamePlayer.findById(gpId);

        if (authentication == null) {
            return new ResponseEntity<>(new LinkedHashMap<String, Object>(){{
                put("error", "Please, Log in!");
            }} , HttpStatus.UNAUTHORIZED);
        }
        if (!gamePlayer.isPresent()) {
            System.out.println("its ok 2");
            return new ResponseEntity<>(new LinkedHashMap<String, Object>(){{
                put("error", "GamePlayer does not exist!");
            }} , HttpStatus.UNAUTHORIZED);
        }

        if (gamePlayer.get().getShips().size()!= 0) {
            return new ResponseEntity<>(new LinkedHashMap<String, Object>() {{
                System.out.println("ships size");

                put("error", "You already have ships placed!");
            }}, HttpStatus.FORBIDDEN);
        }
        Player  player = repositoryPlayer.findByUserName(authentication.getName());

        if (gamePlayer.get().getPlayer().getId() != player.getId()){
            return new ResponseEntity<>(new LinkedHashMap<String, Object>() {{
                System.out.println("not your game");
                put("error", "It is not your game!");
            }}, HttpStatus.FORBIDDEN);
        }

        Map<String, Object> shipsAdded = new LinkedHashMap<>();
        ships.forEach(ship -> {
            gamePlayer.get().addShip(ship);
            repositoryShip.save(ship);
        });

        shipsAdded.put("games", gamePlayer.get().getGame());
        return new ResponseEntity<>(shipsAdded, HttpStatus.CREATED);

    }
}




