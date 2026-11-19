package com.dormfinder.service;

import com.dormfinder.entity.StudentProfile;
import com.dormfinder.entity.User;
import com.dormfinder.repository.StudentProfileRepository;
import com.dormfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class StudentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getStudentDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        StudentProfile profile = user.getStudentProfile();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("studentName", user.getFirstName() + " " + user.getLastName());
        dashboard.put("email", user.getEmail());
        dashboard.put("phoneNumber", user.getPhoneNumber());
        dashboard.put("studentIdNumber", profile != null ? profile.getStudentIdNumber() : "N/A");
        dashboard.put("course", profile != null ? profile.getCourse() : "N/A");
        dashboard.put("yearLevel", profile != null ? profile.getYearLevel() : 1);
        dashboard.put("verifiedEnrollment", profile != null && profile.isVerifiedEnrollment());

        // SRS Increment 1 Stats
        dashboard.put("activeViewingRequests", 0);
        dashboard.put("savedAccommodations", 0);
        dashboard.put("campusBenchmark", "0.45 km from CIT-U N. Bacalso Gate");
        dashboard.put("systemStatus", "Account Active & Verified");

        return dashboard;
    }
}
