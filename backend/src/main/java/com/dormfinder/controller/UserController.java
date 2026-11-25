package com.dormfinder.controller;

import com.dormfinder.dto.ApiResponse;
import com.dormfinder.dto.ChangePasswordRequest;
import com.dormfinder.dto.UpdateProfileRequest;
import com.dormfinder.dto.UserProfileDTO;
import com.dormfinder.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserProfileDTO profile = userService.getUserProfile(email);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully.", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileDTO>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        String email = authentication.getName();
        UserProfileDTO updated = userService.updateUserProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully.", updated));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        String email = authentication.getName();
        userService.changePassword(email, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully! Please use your new password next time you sign in."));
    }
}
