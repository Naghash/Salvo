package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Entity
public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="game")
    private Game game;


    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    private Set <Ship> ships = new HashSet<>();

    @OneToMany(mappedBy="gamePlayer", fetch=FetchType.EAGER)
    private Set <Salvo> salvos = new HashSet<>();


    private LocalDateTime joinDate;

    public GamePlayer() {}

    public GamePlayer(LocalDateTime joinDate, Game game, Player player){
        this.joinDate = joinDate;
        this.game = game;
        this.player = player;
    }

    @JsonIgnore
    public Game getGame() {
        return game;
    }
    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public void setGame(Game game) {
        this.game =  game;
    }

    public Set<Ship> getShips() {
        return ships;
    }

    public Set<Salvo> getSalvos() {
        return salvos;
    }



    public long getId() {

        return id;
    }
    public Map<String, Object> toDTO(){
        return new LinkedHashMap<String, Object>(){{
            put("id", id);
            put("player", player.toDTO1());
            put("ships", ships);
            put("salvos", salvos);

        }};
    }

    public void addShip(Ship ship){
        ship.addGP(this);
        ships.add(ship);
    }

    public void addSalvos(Salvo salvo){
        salvo.addGP(this);
        salvos.add(salvo);
    }
    public void setId(long id) {
        this.id = id;
    }

    public LocalDateTime getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDateTime joinDate) {

        this.joinDate = joinDate;
    }
}