package com.gopalkundu.leettracker.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "questions")
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 50)
    private String _id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 1000)
    private String link;

    @Column(length = 20)
    private String difficulty;

    @Column(length = 1000)
    private String youtube;

    private Float timeTaken;
    private boolean done;
    private int revisions;

    @Column(name = "user_id", length = 50)
    private String user; // CreatedBy

    @CreatedDate
    @Column(length = 50)
    private String createdAt;

    @LastModifiedDate
    @Column(length = 50)
    private String updatedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;
}