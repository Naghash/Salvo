package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="ship")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column
    private List<String> location = new ArrayList<>();

    private String typeOfShip;

    public Ship() {

    }

    public Ship(List <String> location, String typeOfShip) {
        this.location = location;
        this.typeOfShip = typeOfShip;

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


    public String getTypeOfShip() {
        return typeOfShip;
    }

    public void setTypeOfShip(String typeOfShip) {
        this.typeOfShip = typeOfShip;
    }


    public Map<String, Object> toDTOshp(){
        return new LinkedHashMap<String, Object>(){{
                put("type", getTypeOfShip());
                put("location", getLocation());
        }};
    }
    }


