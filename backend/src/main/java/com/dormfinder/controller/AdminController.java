package com.dormfinder.controller;

import com.dormfinder.dto.ApiResponse;
import com.dormfinder.dto.UserSummaryDTO;
import com.dormfinder.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardMetrics() {
        Map<String, Object> metrics = adminService.getAdminDashboardMetrics();
        return ResponseEntity.ok(ApiResponse.success("Admin metrics retrieved successfully", metrics));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserSummaryDTO>>> getAllUsers() {
        List<UserSummaryDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Registered users list retrieved successfully", users));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserSummaryDTO>> toggleUserStatus(@PathVariable Long id) {
        UserSummaryDTO updatedUser = adminService.toggleUserStatus(id);
        String statusLabel = updatedUser.isActive() ? "activated" : "deactivated";
        return ResponseEntity.ok(ApiResponse.success("User successfully " + statusLabel + ".", updatedUser));
    }
}
