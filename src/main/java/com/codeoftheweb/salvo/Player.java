package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers = new HashSet<>();

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<Score> scores = new HashSet<>();

    private String userName;

    public Player() {

    }

    public Player(String user) {

        this.userName = user;
    }


    public String getUserName() {

        return userName;
    }

    public void setUserName(String userName)
    {

        this.userName = userName;
    }

    public long getId() {


        return id;
    }

    public void setId(long id) {

        this.id = id;
    }
    public void addScore(Score score){
        score.addPlayer(this);
        scores.add(score);
    }

    public Map<String, Object> toDTO(){
        return new LinkedHashMap<String, Object>(){{
            put("id", id);
            put("name", userName);
            put("score", scores);
        }};
    }
}




