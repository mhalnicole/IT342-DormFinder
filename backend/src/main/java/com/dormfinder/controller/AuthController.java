package com.dormfinder.controller;

import com.dormfinder.dto.ApiResponse;
import com.dormfinder.dto.AuthResponse;
import com.dormfinder.dto.ForgotPasswordRequest;
import com.dormfinder.dto.ForgotPasswordResponse;
import com.dormfinder.dto.LoginRequest;
import com.dormfinder.dto.RegisterRequest;
import com.dormfinder.dto.ResetPasswordRequest;
import com.dormfinder.service.AuthService;
import com.dormfinder.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(
                ApiResponse.success("Account registered successfully! Welcome to DormFinder.", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success("Login successful! Redirecting to your dashboard.", response)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>(ApiResponse.error("User not authenticated"), HttpStatus.UNAUTHORIZED);
        }
        AuthResponse response = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("User session verified", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully. Session terminated."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<ForgotPasswordResponse>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ForgotPasswordResponse response = passwordResetService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset token generated successfully.", response));
    }

    @GetMapping("/verify-reset-token")
    public ResponseEntity<ApiResponse<Boolean>> verifyResetToken(@RequestParam("token") String token) {
        boolean valid = passwordResetService.verifyToken(token);
        if (valid) {
            return ResponseEntity.ok(ApiResponse.success("Token is valid and active.", true));
        } else {
            return new ResponseEntity<>(ApiResponse.error("Reset token is invalid, expired, or has already been used."), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been successfully reset! You can now log in with your new password."));
    }
}
