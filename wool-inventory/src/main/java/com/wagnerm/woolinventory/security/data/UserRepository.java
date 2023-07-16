package com.wagnerm.woolinventory.security.data;

import com.wagnerm.woolinventory.security.data.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    public Optional<User> findByEmail(String email);
}
