package com.devsage.bugtracker.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // Don't include null fields in JSON
public class Bug {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Column(columnDefinition = "TEXT")
    private String aiReasoning;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private User assignedTo;
    

    @ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "reported_by")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@JsonInclude(JsonInclude.Include.NON_NULL)  // ✅ Force inclusion if present
private User reportedBy;

    @OneToMany(mappedBy = "bug", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum Status {
        OPEN, IN_PROGRESS, RESOLVED
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
