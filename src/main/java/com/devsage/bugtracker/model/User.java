package com.devsage.bugtracker.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user") // ✅ add this line
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        TESTER, DEVELOPER, ADMIN
    }
}
