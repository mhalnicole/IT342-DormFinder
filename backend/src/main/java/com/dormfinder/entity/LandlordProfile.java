package com.dormfinder.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "landlord_profiles")
public class LandlordProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "landlord_id")
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_permit_no", length = 80)
    private String businessPermitNo;

    @Column(name = "office_address", length = 200)
    private String officeAddress;

    @Column(name = "verification_status", length = 30)
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    public LandlordProfile() {}

    public LandlordProfile(User user, String businessPermitNo, String officeAddress) {
        this.user = user;
        this.businessPermitNo = businessPermitNo;
        this.officeAddress = officeAddress;
        this.verificationStatus = "PENDING";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBusinessPermitNo() {
        return businessPermitNo;
    }

    public void setBusinessPermitNo(String businessPermitNo) {
        this.businessPermitNo = businessPermitNo;
    }

    public String getOfficeAddress() {
        return officeAddress;
    }

    public void setOfficeAddress(String officeAddress) {
        this.officeAddress = officeAddress;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }
}
