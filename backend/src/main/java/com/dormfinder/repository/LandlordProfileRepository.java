package com.dormfinder.repository;

import com.dormfinder.entity.LandlordProfile;
import com.dormfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LandlordProfileRepository extends JpaRepository<LandlordProfile, Long> {
    Optional<LandlordProfile> findByUser(User user);
    Optional<LandlordProfile> findByUserId(Long userId);
    long countByVerificationStatus(String verificationStatus);
}
