package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="salvo")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column
    private List<String> location = new ArrayList<>();

    private int turn;

    public Salvo() {

    }

    public Salvo(List <String> location, int turn) {
        this.location = location;
        this.turn = turn;

    }
    public void addGP(GamePlayer gamePlayer){
        this.gamePlayer = gamePlayer;

    }
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public List<String> getLocation() {
        return location;
    }

    public void setLocation(List<String> location) {
        this.location = location;
    }


    public int getTurn() {
        return turn;
    }

    public void setTurn(int turn) {
        this.turn = turn;
    }


    public Map<String, Object> toDTOsalvo(){
        return new LinkedHashMap<String, Object>(){{
            put("turn", getTurn());
            put("location", getLocation());
        }};
    }
}


