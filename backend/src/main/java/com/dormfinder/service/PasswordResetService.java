package com.dormfinder.service;

import com.dormfinder.dto.ForgotPasswordRequest;
import com.dormfinder.dto.ForgotPasswordResponse;
import com.dormfinder.dto.ResetPasswordRequest;
import com.dormfinder.entity.PasswordResetToken;
import com.dormfinder.entity.User;
import com.dormfinder.repository.PasswordResetTokenRepository;
import com.dormfinder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final int EXPIRY_MINUTES = 15;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public ForgotPasswordResponse requestPasswordReset(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account registered with email address: " + email));

        if (!user.isActive()) {
            throw new IllegalArgumentException("Cannot reset password: account has been deactivated by administration.");
        }

        List<PasswordResetToken> existingTokens = passwordResetTokenRepository.findByUserAndUsedFalse(user);
        for (PasswordResetToken pt : existingTokens) {
            pt.setUsed(true);
        }
        passwordResetTokenRepository.saveAll(existingTokens);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, EXPIRY_MINUTES);
        passwordResetTokenRepository.save(resetToken);

        String resetLink = "/reset-password?token=" + token;
        String message = "Password reset instructions generated successfully. Token is valid for " + EXPIRY_MINUTES + " minutes.";

        return new ForgotPasswordResponse(token, resetLink, EXPIRY_MINUTES, message);
    }

    @Transactional(readOnly = true)
    public boolean verifyToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        return passwordResetTokenRepository.findByTokenAndUsedFalse(token.trim())
                .filter(t -> !t.isExpired())
                .isPresent();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String token = request.getToken().trim();

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> new IllegalArgumentException("The password reset token is invalid or has already been used."));

        if (resetToken.isExpired()) {
            resetToken.setUsed(true);
            passwordResetTokenRepository.save(resetToken);
            throw new IllegalArgumentException("The password reset token has expired. Please request a new password reset link.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("The new password and confirmation password do not match.");
        }

        User user = resetToken.getUser();

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Your new password cannot be identical to your previous password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
