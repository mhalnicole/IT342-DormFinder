package com.dormfinder.dto;

import com.dormfinder.entity.Role;
import java.time.LocalDateTime;
import java.util.Map;

public class UserProfileDTO {

    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Role role;
    private boolean active;
    private LocalDateTime createdAt;
    private Map<String, Object> profileDetails;

    public UserProfileDTO() {}

    public UserProfileDTO(Long userId, String email, String firstName, String lastName, String phoneNumber, Role role, boolean active, LocalDateTime createdAt, Map<String, Object> profileDetails) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
        this.profileDetails = profileDetails;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return firstName + " " + lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Map<String, Object> getProfileDetails() { return profileDetails; }
    public void setProfileDetails(Map<String, Object> profileDetails) { this.profileDetails = profileDetails; }
}
