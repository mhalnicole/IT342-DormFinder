package com.dormfinder.service;

import com.dormfinder.entity.LandlordProfile;
import com.dormfinder.entity.User;
import com.dormfinder.repository.LandlordProfileRepository;
import com.dormfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class LandlordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LandlordProfileRepository landlordProfileRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getLandlordDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Landlord not found"));

        LandlordProfile profile = user.getLandlordProfile();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("landlordName", user.getFirstName() + " " + user.getLastName());
        dashboard.put("email", user.getEmail());
        dashboard.put("phoneNumber", user.getPhoneNumber());
        dashboard.put("businessPermitNo", profile != null ? profile.getBusinessPermitNo() : "N/A");
        dashboard.put("officeAddress", profile != null ? profile.getOfficeAddress() : "N/A");
        dashboard.put("verificationStatus", profile != null ? profile.getVerificationStatus() : "PENDING");

        // SRS Increment 1 Stats
        dashboard.put("totalProperties", 0);
        dashboard.put("totalRooms", 0);
        dashboard.put("pendingViewingAppointments", 0);
        dashboard.put("inquiriesThisMonth", 0);

        return dashboard;
    }
}
