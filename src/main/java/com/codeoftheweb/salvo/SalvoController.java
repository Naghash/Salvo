package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@RestController()
@RequestMapping("/api")
public class SalvoController {

    @Autowired
    private GameRepository repositoryGame;
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

    @Autowired
    private GamePlayerRepository repositoryGamePlayer;
    @RequestMapping("/game_view/{gamePlayerId}")
    private Map<String, Object> makeDTO( @PathVariable Long gamePlayerId) {
        return repositoryGamePlayer.findById(gamePlayerId)
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
                    put("oponent", game.getGamePlayers().stream()
                            .filter(gp -> gp.getId() != gamePlayerId)
                            .findFirst()
                            .map(gp -> gp.toDTO())
                            .orElse(null));
                }}).orElse(null);
    }


    @RequestMapping("/players")
    private  List<Object> makeDTO2 (){

       return repositoryPlayer.findAll()

                .stream()
                .map(player -> player.toDTO1())
                .collect(toList());


    }


    @Autowired
    private PlayerRepository repositoryPlayer;
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
}
