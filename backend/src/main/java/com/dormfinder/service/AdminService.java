package com.dormfinder.service;

import com.dormfinder.dto.UserSummaryDTO;
import com.dormfinder.entity.Role;
import com.dormfinder.entity.User;
import com.dormfinder.repository.LandlordProfileRepository;
import com.dormfinder.repository.StudentProfileRepository;
import com.dormfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private LandlordProfileRepository landlordProfileRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminDashboardMetrics() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalLandlords = userRepository.countByRole(Role.LANDLORD);
        long pendingVerifications = landlordProfileRepository.countByVerificationStatus("PENDING");

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", totalUsers);
        metrics.put("totalStudents", totalStudents);
        metrics.put("totalLandlords", totalLandlords);
        metrics.put("pendingVerifications", pendingVerifications);
        metrics.put("systemHealth", "OPERATIONAL");
        metrics.put("databaseConnected", true);

        return metrics;
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserSummary)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserSummaryDTO toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Prevent deactivating super admin
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Administrator accounts cannot be deactivated.");
        }

        user.setActive(!user.isActive());
        User updated = userRepository.save(user);
        return mapToUserSummary(updated);
    }

    private UserSummaryDTO mapToUserSummary(User user) {
        String additionalInfo = "";
        if (user.getRole() == Role.STUDENT && user.getStudentProfile() != null) {
            additionalInfo = "ID: " + user.getStudentProfile().getStudentIdNumber() +
                    " (" + user.getStudentProfile().getCourse() + " Y" + user.getStudentProfile().getYearLevel() + ")";
        } else if (user.getRole() == Role.LANDLORD && user.getLandlordProfile() != null) {
            additionalInfo = "Permit: " + user.getLandlordProfile().getBusinessPermitNo() +
                    " [" + user.getLandlordProfile().getVerificationStatus() + "]";
        } else if (user.getRole() == Role.ADMIN) {
            additionalInfo = "CIT-U Housing Administration";
        }

        return new UserSummaryDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt(),
                additionalInfo
        );
    }
}
