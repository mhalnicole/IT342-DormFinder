package com.dormfinder.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "student_id_number", length = 30)
    private String studentIdNumber;

    @Column(name = "course", length = 80)
    private String course;

    @Column(name = "year_level")
    private Integer yearLevel;

    @Column(name = "emergency_contact", length = 30)
    private String emergencyContact;

    @Column(name = "verified_enrollment")
    private boolean verifiedEnrollment = false;

    public StudentProfile() {}

    public StudentProfile(User user, String studentIdNumber, String course, Integer yearLevel, String emergencyContact) {
        this.user = user;
        this.studentIdNumber = studentIdNumber;
        this.course = course;
        this.yearLevel = yearLevel;
        this.emergencyContact = emergencyContact;
        this.verifiedEnrollment = false;
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

    public String getStudentIdNumber() {
        return studentIdNumber;
    }

    public void setStudentIdNumber(String studentIdNumber) {
        this.studentIdNumber = studentIdNumber;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getYearLevel() {
        return yearLevel;
    }

    public void setYearLevel(Integer yearLevel) {
        this.yearLevel = yearLevel;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public boolean isVerifiedEnrollment() {
        return verifiedEnrollment;
    }

    public void setVerifiedEnrollment(boolean verifiedEnrollment) {
        this.verifiedEnrollment = verifiedEnrollment;
    }
}
