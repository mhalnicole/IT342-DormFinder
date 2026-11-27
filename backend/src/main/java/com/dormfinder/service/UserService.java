package com.dormfinder.service;

import com.dormfinder.dto.ChangePasswordRequest;
import com.dormfinder.dto.UpdateProfileRequest;
import com.dormfinder.dto.UserProfileDTO;
import com.dormfinder.entity.LandlordProfile;
import com.dormfinder.entity.Role;
import com.dormfinder.entity.StudentProfile;
import com.dormfinder.entity.User;
import com.dormfinder.repository.LandlordProfileRepository;
import com.dormfinder.repository.StudentProfileRepository;
import com.dormfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private LandlordProfileRepository landlordProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserProfileDTO getUserProfile(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return buildUserProfileDTO(user);
    }

    @Transactional
    public UserProfileDTO updateUserProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = user.getStudentProfile();
            if (profile == null) {
                profile = new StudentProfile();
                profile.setUser(user);
                user.setStudentProfile(profile);
            }
            if (request.getCourse() != null) {
                profile.setCourse(request.getCourse().trim());
            }
            if (request.getYearLevel() != null) {
                if (request.getYearLevel() < 1 || request.getYearLevel() > 5) {
                    throw new IllegalArgumentException("Year level must be between 1 and 5.");
                }
                profile.setYearLevel(request.getYearLevel());
            }
            if (request.getEmergencyContact() != null) {
                profile.setEmergencyContact(request.getEmergencyContact().trim());
            }
            studentProfileRepository.save(profile);

        } else if (user.getRole() == Role.LANDLORD) {
            LandlordProfile profile = user.getLandlordProfile();
            if (profile == null) {
                profile = new LandlordProfile();
                profile.setUser(user);
                user.setLandlordProfile(profile);
            }
            if (request.getBusinessPermitNo() != null) {
                profile.setBusinessPermitNo(request.getBusinessPermitNo().trim());
            }
            if (request.getOfficeAddress() != null) {
                profile.setOfficeAddress(request.getOfficeAddress().trim());
            }
            landlordProfileRepository.save(profile);
        }

        User updatedUser = userRepository.save(user);
        return buildUserProfileDTO(updatedUser);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("The current password entered is incorrect.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("The new password and confirmation password do not match.");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("The new password cannot be the same as your current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserProfileDTO buildUserProfileDTO(User user) {
        Map<String, Object> details = new HashMap<>();

        if (user.getRole() == Role.STUDENT && user.getStudentProfile() != null) {
            StudentProfile sp = user.getStudentProfile();
            details.put("studentIdNumber", sp.getStudentIdNumber());
            details.put("course", sp.getCourse());
            details.put("yearLevel", sp.getYearLevel());
            details.put("emergencyContact", sp.getEmergencyContact());
            details.put("verifiedEnrollment", sp.isVerifiedEnrollment());
        } else if (user.getRole() == Role.LANDLORD && user.getLandlordProfile() != null) {
            LandlordProfile lp = user.getLandlordProfile();
            details.put("businessPermitNo", lp.getBusinessPermitNo());
            details.put("officeAddress", lp.getOfficeAddress());
            details.put("verificationStatus", lp.getVerificationStatus());
        } else if (user.getRole() == Role.ADMIN) {
            details.put("department", "CIT-U Student Housing Office");
            details.put("accessLevel", "SUPER_ADMIN");
        }

        return new UserProfileDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                details
        );
    }
}
