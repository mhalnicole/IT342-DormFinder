package com.dormfinder.dto;

public class ForgotPasswordResponse {

    private String token;
    private String resetLink;
    private int expiryMinutes;
    private String message;

    public ForgotPasswordResponse() {}

    public ForgotPasswordResponse(String token, String resetLink, int expiryMinutes, String message) {
        this.token = token;
        this.resetLink = resetLink;
        this.expiryMinutes = expiryMinutes;
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getResetLink() { return resetLink; }
    public void setResetLink(String resetLink) { this.resetLink = resetLink; }

    public int getExpiryMinutes() { return expiryMinutes; }
    public void setExpiryMinutes(int expiryMinutes) { this.expiryMinutes = expiryMinutes; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
