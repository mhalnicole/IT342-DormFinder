package com.dormfinder.config;

import com.dormfinder.entity.LandlordProfile;
import com.dormfinder.entity.Role;
import com.dormfinder.entity.StudentProfile;
import com.dormfinder.entity.User;
import com.dormfinder.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Administrator if not present
        if (!userRepository.existsByEmail("admin@dormfinder.com")) {
            User admin = new User(
                    "admin@dormfinder.com",
                    passwordEncoder.encode("Admin@123"),
                    "System",
                    "Administrator",
                    "+63 917 111 2222",
                    Role.ADMIN
            );
            userRepository.save(admin);
            logger.info("Default Administrator seeded: admin@dormfinder.com / Admin@123");
        }

        // 2. Seed Sample Student if not present
        if (!userRepository.existsByEmail("student@cit.edu")) {
            User studentUser = new User(
                    "student@cit.edu",
                    passwordEncoder.encode("Student@123"),
                    "Juan",
                    "Dela Cruz",
                    "+63 928 333 4444",
                    Role.STUDENT
            );
            StudentProfile studentProfile = new StudentProfile(
                    studentUser,
                    "23-0065-102",
                    "Bachelor of Science in Information Technology",
                    3,
                    "+63 919 555 6666"
            );
            studentProfile.setVerifiedEnrollment(true);
            studentUser.setStudentProfile(studentProfile);
            userRepository.save(studentUser);
            logger.info("Sample Student seeded: student@cit.edu / Student@123");
        }

        // 3. Seed Sample Landlord if not present
        if (!userRepository.existsByEmail("landlord@dormfinder.com")) {
            User landlordUser = new User(
                    "landlord@dormfinder.com",
                    passwordEncoder.encode("Landlord@123"),
                    "Maria",
                    "Santos",
                    "+63 939 777 8888",
                    Role.LANDLORD
            );
            LandlordProfile landlordProfile = new LandlordProfile(
                    landlordUser,
                    "BP-CEBU-2026-9041",
                    "142 N. Bacalso Ave, Sambag 1, Cebu City"
            );
            landlordProfile.setVerificationStatus("VERIFIED");
            landlordUser.setLandlordProfile(landlordProfile);
            userRepository.save(landlordUser);
            logger.info("Sample Landlord seeded: landlord@dormfinder.com / Landlord@123");
        }
    }
}
