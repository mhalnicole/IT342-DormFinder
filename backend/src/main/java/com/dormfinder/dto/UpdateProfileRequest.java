package com.dormfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "First name is required.")
    @Size(min = 2, max = 60, message = "First name must be between 2 and 60 characters.")
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Size(min = 2, max = 60, message = "Last name must be between 2 and 60 characters.")
    private String lastName;

    @NotBlank(message = "Phone number is required.")
    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters.")
    private String phoneNumber;

    private String course;
    private Integer yearLevel;
    private String emergencyContact;

    private String businessPermitNo;
    private String officeAddress;

    public UpdateProfileRequest() {}

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Integer getYearLevel() { return yearLevel; }
    public void setYearLevel(Integer yearLevel) { this.yearLevel = yearLevel; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getBusinessPermitNo() { return businessPermitNo; }
    public void setBusinessPermitNo(String businessPermitNo) { this.businessPermitNo = businessPermitNo; }

    public String getOfficeAddress() { return officeAddress; }
    public void setOfficeAddress(String officeAddress) { this.officeAddress = officeAddress; }
}
