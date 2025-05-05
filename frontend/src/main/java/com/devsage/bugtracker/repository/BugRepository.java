package com.devsage.bugtracker.repository;

import com.devsage.bugtracker.model.Bug;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BugRepository extends JpaRepository<Bug, Long> {
}
