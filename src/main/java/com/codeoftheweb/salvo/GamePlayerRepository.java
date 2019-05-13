package com.codeoftheweb.salvo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GamePlayerRepository extends JpaRepository<GamePlayer, Long> {
 Optional<GamePlayer> findById(Long gpId);
}