package com.dormfinder.controller;

import com.dormfinder.dto.ApiResponse;
import com.dormfinder.service.LandlordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/landlord")
@PreAuthorize("hasRole('LANDLORD')")
public class LandlordController {

    @Autowired
    private LandlordService landlordService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(Authentication authentication) {
        Map<String, Object> data = landlordService.getLandlordDashboard(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Landlord dashboard data retrieved successfully", data));
    }
}
