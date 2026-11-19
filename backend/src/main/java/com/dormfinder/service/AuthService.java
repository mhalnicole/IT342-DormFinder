package com.dormfinder.service;

import com.dormfinder.dto.AuthResponse;
import com.dormfinder.dto.LoginRequest;
import com.dormfinder.dto.RegisterRequest;
import com.dormfinder.entity.LandlordProfile;
import com.dormfinder.entity.Role;
import com.dormfinder.entity.StudentProfile;
import com.dormfinder.entity.User;
import com.dormfinder.repository.LandlordProfileRepository;
import com.dormfinder.repository.StudentProfileRepository;
import com.dormfinder.repository.UserRepository;
import com.dormfinder.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private LandlordProfileRepository landlordProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("The email address '" + request.getEmail() + "' is already registered.");
        }

        // 2. Validate role constraint
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Administrator accounts cannot be self-registered.");
        }

        // 3. Create user entity with hashed password
        User user = new User(
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName().trim(),
                request.getLastName().trim(),
                request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : "",
                request.getRole()
        );

        // 4. Attach role-specific profile based on SRS entity models
        if (request.getRole() == Role.STUDENT) {
            StudentProfile profile = new StudentProfile(
                    user,
                    request.getStudentIdNumber() != null ? request.getStudentIdNumber().trim() : "",
                    request.getCourse() != null ? request.getCourse().trim() : "",
                    request.getYearLevel() != null ? request.getYearLevel() : 1,
                    request.getEmergencyContact() != null ? request.getEmergencyContact().trim() : ""
            );
            user.setStudentProfile(profile);
        } else if (request.getRole() == Role.LANDLORD) {
            LandlordProfile profile = new LandlordProfile(
                    user,
                    request.getBusinessPermitNo() != null ? request.getBusinessPermitNo().trim() : "",
                    request.getOfficeAddress() != null ? request.getOfficeAddress().trim() : ""
            );
            user.setLandlordProfile(profile);
        }

        User savedUser = userRepository.save(user);

        // 5. Generate token and construct response
        String token = jwtUtil.generateToken(savedUser);
        return buildAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // 1. Authenticate credentials
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid email or password combination. Please try again.");
        } catch (DisabledException ex) {
            throw new DisabledException("Your account has been deactivated. Please contact the administrator.");
        }

        // 2. Fetch full user entity
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User record not found."));

        if (!user.isActive()) {
            throw new DisabledException("Your account is currently disabled. Please contact system support.");
        }

        // 3. Generate JWT and respond
        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(user, token);
    }

    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        Map<String, Object> profileData = new HashMap<>();

        if (user.getRole() == Role.STUDENT && user.getStudentProfile() != null) {
            StudentProfile sp = user.getStudentProfile();
            profileData.put("studentIdNumber", sp.getStudentIdNumber());
            profileData.put("course", sp.getCourse());
            profileData.put("yearLevel", sp.getYearLevel());
            profileData.put("emergencyContact", sp.getEmergencyContact());
            profileData.put("verifiedEnrollment", sp.isVerifiedEnrollment());
        } else if (user.getRole() == Role.LANDLORD && user.getLandlordProfile() != null) {
            LandlordProfile lp = user.getLandlordProfile();
            profileData.put("businessPermitNo", lp.getBusinessPermitNo());
            profileData.put("officeAddress", lp.getOfficeAddress());
            profileData.put("verificationStatus", lp.getVerificationStatus());
        } else if (user.getRole() == Role.ADMIN) {
            profileData.put("department", "CIT-U Student Housing Office");
            profileData.put("accessLevel", "SUPER_ADMIN");
        }

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                profileData
        );
    }
}
